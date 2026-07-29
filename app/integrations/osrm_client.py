"""
Integration client for OSRM (Open Source Routing Machine).

Unlike WeatherClient/OpenTripMapClient, OSRM signals logical routing
failures (no route found, invalid coordinates, etc.) via a "code"
field inside an HTTP 200 response body rather than via the HTTP
status code, so every response body is inspected for `code != "Ok"`
in addition to the usual status-code checks.
"""

import asyncio
from typing import Any, Literal

import httpx
import structlog

from app.core.config import settings
from app.core.exceptions import ExternalAPIException

logger = structlog.get_logger()

OSRMProfile = Literal["driving", "cycling", "walking"]


class OSRMClient:
    """
    Thin client responsible for all direct communication with the
    OSRM routing engine. Handles timeouts, retries for transient
    failures, and translates every provider-side failure (both
    HTTP-level and OSRM's in-body "code" failures) into the
    application's exception hierarchy.

    Unlike WeatherClient/OpenTripMapClient (which hardcode their
    timeout/retry constants at module level), timeout and retry
    behavior here are read from settings (OSRM_TIMEOUT,
    OSRM_MAX_RETRIES, OSRM_RETRY_BACKOFF) per explicit project
    requirements, making them configurable per environment without a
    code change.

    Services must never call OSRM directly; they depend on this
    client instead.
    """

    def __init__(self) -> None:
        self.base_url = settings.OSRM_BASE_URL
        self.timeout = settings.OSRM_TIMEOUT
        self.max_retries = settings.OSRM_MAX_RETRIES
        self.retry_backoff = settings.OSRM_RETRY_BACKOFF

    @staticmethod
    def _format_coordinates(coordinates: list[tuple[float, float]]) -> str:
        """
        Format a list of (latitude, longitude) pairs into OSRM's
        expected "{lon},{lat};{lon},{lat};..." path segment.

        OSRM uses longitude-first ordering -- the opposite of the
        (latitude, longitude) convention used everywhere else in this
        project's models and schemas. This method is the single place
        that conversion happens.
        """
        return ";".join(f"{lon},{lat}" for lat, lon in coordinates)

    async def _get(self, path: str, params: dict[str, Any]) -> dict[str, Any]:
        """
        Perform a GET request against the OSRM API, applying the
        shared timeout/retry/exception-translation policy used by
        every method on this client.
        """
        last_exc: ExternalAPIException | None = None

        for attempt in range(self.max_retries + 1):
            try:
                async with httpx.AsyncClient(timeout=self.timeout) as client:
                    response = await client.get(f"{self.base_url}{path}", params=params)
            except httpx.TimeoutException as exc:
                logger.warning("OSRM request timed out", attempt=attempt)
                last_exc = ExternalAPIException(
                    "The route service took too long to respond. Please try again."
                )
                if attempt < self.max_retries:
                    await asyncio.sleep(self.retry_backoff * (attempt + 1))
                    continue
                raise last_exc from exc
            except httpx.HTTPError as exc:
                logger.error("OSRM network error", error=str(exc))
                raise ExternalAPIException(
                    "Unable to reach the route service. Please try again later."
                ) from exc

            if response.status_code == 429:
                logger.warning("OSRM rate limited", attempt=attempt)
                last_exc = ExternalAPIException(
                    "The route service is rate-limited. Please try again shortly."
                )
                if attempt < self.max_retries:
                    await asyncio.sleep(self.retry_backoff * (attempt + 1))
                    continue
                raise last_exc

            if response.status_code >= 500:
                logger.warning(
                    "OSRM server error", status=response.status_code, attempt=attempt
                )
                last_exc = ExternalAPIException(
                    "The route service is currently unavailable. "
                    "Please try again later."
                )
                if attempt < self.max_retries:
                    await asyncio.sleep(self.retry_backoff * (attempt + 1))
                    continue
                raise last_exc

            if response.status_code != 200:
                logger.error("OSRM unexpected status", status=response.status_code)
                raise ExternalAPIException("The route service returned an error.")

            data = response.json()
            code = data.get("code")

            if code == "Ok":
                return data

            if code in ("NoRoute", "NoSegment"):
                raise ExternalAPIException(
                    "No route could be found between the given locations."
                )

            if code in ("InvalidInput", "InvalidOptions", "InvalidValue"):
                raise ExternalAPIException(
                    "The route service rejected the given coordinates."
                )

            logger.error("OSRM logical error", code=code, message=data.get("message"))
            raise ExternalAPIException(
                data.get("message") or "The route service returned an error."
            )

        raise last_exc or ExternalAPIException("The route service is unavailable.")

    async def get_route(
        self,
        coordinates: list[tuple[float, float]],
        profile: OSRMProfile = "driving",
    ) -> dict[str, Any]:
        """
        Compute the route through a fixed sequence of (latitude,
        longitude) waypoints, visited in the given order, using
        OSRM's /route service. Returns the raw provider payload
        (distance, duration, and geometry).
        """
        if len(coordinates) < 2:
            raise ExternalAPIException(
                "At least two coordinates are required to compute a route."
            )

        coords_path = self._format_coordinates(coordinates)
        return await self._get(
            f"/route/v1/{profile}/{coords_path}",
            {"overview": "full", "geometries": "geojson", "steps": "false"},
        )

    async def optimize_trip(
        self,
        coordinates: list[tuple[float, float]],
        profile: OSRMProfile = "driving",
    ) -> dict[str, Any]:
        """
        Compute the most efficient visiting order for a set of
        (latitude, longitude) waypoints using OSRM's /trip service,
        which solves the underlying travelling-salesman problem. The
        first waypoint is fixed as the route's source; the rest may
        be reordered by OSRM for efficiency.
        """
        if len(coordinates) < 2:
            raise ExternalAPIException(
                "At least two coordinates are required to optimize a route."
            )

        coords_path = self._format_coordinates(coordinates)
        return await self._get(
            f"/trip/v1/{profile}/{coords_path}",
            {
                "overview": "full",
                "geometries": "geojson",
                "steps": "false",
                "source": "first",
                "roundtrip": "false",
            },
        )

    async def health_check(self) -> bool:
        """
        Check whether the OSRM service is reachable by issuing a
        minimal route request between two well-known coordinates
        (central Berlin, always resolvable on the public OSRM demo
        server and any standard OSM extract). Returns True if OSRM
        responds with a valid route, False for any connectivity or
        service-side failure. Does not raise.
        """
        try:
            await self.get_route(
                [(52.5170, 13.3889), (52.5200, 13.4050)], profile="driving"
            )
            return True
        except ExternalAPIException as exc:
            logger.warning("OSRM health check failed", error=str(exc))
            return False
