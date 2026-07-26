import asyncio
from typing import Any

import httpx
import structlog

from app.core.config import settings
from app.core.exceptions import ExternalAPIException

logger = structlog.get_logger()

OPENTRIPMAP_REQUEST_TIMEOUT_SECONDS = 30.0
OPENTRIPMAP_MAX_RETRIES = 2
OPENTRIPMAP_RETRY_BACKOFF_SECONDS = 1.0


class OpenTripMapClient:
    """
    Thin client responsible for all direct communication with the
    OpenTripMap API. Handles API key injection, timeouts, retries for
    transient failures, and translates every provider-side failure
    into the application's exception hierarchy.

    Services must never call the OpenTripMap API directly; they
    depend on this client instead.
    """

    def __init__(self) -> None:
        self.api_key = settings.OPENTRIPMAP_API_KEY
        self.base_url = settings.OPENTRIPMAP_BASE_URL

    async def _get(self, path: str, params: dict[str, Any]) -> Any:
        """
        Perform a GET request against the OpenTripMap API, applying
        the shared timeout/retry/exception-translation policy used by
        every endpoint on this client.
        """
        if not self.api_key:
            raise ExternalAPIException(
                "The places service is not configured. "
                "Please set OPENTRIPMAP_API_KEY."
            )

        request_params = {**params, "apikey": self.api_key}
        last_exc: ExternalAPIException | None = None

        for attempt in range(OPENTRIPMAP_MAX_RETRIES + 1):
            try:
                async with httpx.AsyncClient(
                    timeout=OPENTRIPMAP_REQUEST_TIMEOUT_SECONDS
                ) as client:
                    response = await client.get(
                        f"{self.base_url}{path}", params=request_params
                    )
            except httpx.TimeoutException as exc:
                logger.warning("OpenTripMap request timed out", attempt=attempt)
                last_exc = ExternalAPIException(
                    "The places service took too long to respond. " "Please try again."
                )
                if attempt < OPENTRIPMAP_MAX_RETRIES:
                    await asyncio.sleep(
                        OPENTRIPMAP_RETRY_BACKOFF_SECONDS * (attempt + 1)
                    )
                    continue
                raise last_exc from exc
            except httpx.HTTPError as exc:
                logger.error("OpenTripMap network error", error=str(exc))
                raise ExternalAPIException(
                    "Unable to reach the places service. Please try again later."
                ) from exc

            if response.status_code == 200:
                return response.json()

            if response.status_code in (401, 403):
                logger.error("OpenTripMap auth failed", status=response.status_code)
                raise ExternalAPIException(
                    "The places service rejected the request credentials."
                )

            if response.status_code == 404:
                raise ExternalAPIException("The requested place could not be found.")

            if response.status_code == 429:
                logger.warning("OpenTripMap rate limited", attempt=attempt)
                last_exc = ExternalAPIException(
                    "The places service is rate-limited. Please try again shortly."
                )
                if attempt < OPENTRIPMAP_MAX_RETRIES:
                    await asyncio.sleep(
                        OPENTRIPMAP_RETRY_BACKOFF_SECONDS * (attempt + 1)
                    )
                    continue
                raise last_exc

            if response.status_code >= 500:
                logger.warning(
                    "OpenTripMap server error",
                    status=response.status_code,
                    attempt=attempt,
                )
                last_exc = ExternalAPIException(
                    "The places service is currently unavailable. "
                    "Please try again later."
                )
                if attempt < OPENTRIPMAP_MAX_RETRIES:
                    await asyncio.sleep(
                        OPENTRIPMAP_RETRY_BACKOFF_SECONDS * (attempt + 1)
                    )
                    continue
                raise last_exc

            logger.error("OpenTripMap unexpected status", status=response.status_code)
            raise ExternalAPIException("The places service returned an error.")

        raise last_exc or ExternalAPIException("The places service is unavailable.")

    async def geocode(self, destination: str) -> dict[str, Any]:
        """
        Resolve a destination name to coordinates using OpenTripMap's
        geoname endpoint. Returns the raw payload (includes lat/lon).
        """
        return await self._get("/geoname", {"name": destination})

    async def search_nearby(
        self, lat: float, lon: float, radius: int = 10000, limit: int = 20
    ) -> list[dict[str, Any]]:
        """
        Search for points of interest within a radius (meters) of the
        given coordinates. Returns the raw list of place summaries.
        """
        result = await self._get(
            "/radius",
            {
                "radius": radius,
                "lat": lat,
                "lon": lon,
                "limit": limit,
                "format": "json",
            },
        )
        return result if isinstance(result, list) else []

    async def get_place_details(self, xid: str) -> dict[str, Any]:
        """
        Fetch full details for a single place by its OpenTripMap XID.
        """
        return await self._get(f"/xid/{xid}", {})
