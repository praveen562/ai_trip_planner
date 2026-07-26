import asyncio
from typing import Any

import httpx
import structlog

from app.core.config import settings
from app.core.exceptions import ExternalAPIException

logger = structlog.get_logger()

WEATHER_REQUEST_TIMEOUT_SECONDS = 30.0
WEATHER_MAX_RETRIES = 2
WEATHER_RETRY_BACKOFF_SECONDS = 1.0
WEATHER_FORECAST_DAYS = 5


class WeatherClient:
    """
    Thin client responsible for all direct communication with the
    external weather provider (WeatherAPI.com). Handles API key
    injection, timeouts, retries for transient failures, and
    translates every provider-side failure into the application's
    exception hierarchy.

    Services must never call the weather API directly; they depend
    on this client instead.
    """

    def __init__(self) -> None:
        self.api_key = settings.WEATHER_API_KEY
        self.base_url = settings.WEATHER_BASE_URL

    async def get_forecast(self, destination: str) -> dict[str, Any]:
        """
        Fetch the multi-day forecast for a destination (city name).
        Returns the raw provider payload as a dict.
        """
        if not self.api_key:
            raise ExternalAPIException(
                "The weather service is not configured. Please set WEATHER_API_KEY."
            )

        params = {
            "key": self.api_key,
            "q": destination,
            "days": WEATHER_FORECAST_DAYS,
            "aqi": "no",
            "alerts": "no",
        }

        last_exc: ExternalAPIException | None = None

        for attempt in range(WEATHER_MAX_RETRIES + 1):
            try:
                async with httpx.AsyncClient(
                    timeout=WEATHER_REQUEST_TIMEOUT_SECONDS
                ) as client:
                    response = await client.get(
                        f"{self.base_url}/forecast.json", params=params
                    )
            except httpx.TimeoutException as exc:
                logger.warning("Weather API request timed out", attempt=attempt)
                last_exc = ExternalAPIException(
                    "The weather service took too long to respond. Please try again."
                )
                if attempt < WEATHER_MAX_RETRIES:
                    await asyncio.sleep(WEATHER_RETRY_BACKOFF_SECONDS * (attempt + 1))
                    continue
                raise last_exc from exc
            except httpx.HTTPError as exc:
                logger.error("Weather API network error", error=str(exc))
                raise ExternalAPIException(
                    "Unable to reach the weather service. Please try again later."
                ) from exc

            if response.status_code == 200:
                return response.json()

            if response.status_code in (401, 403):
                logger.error("Weather API auth failed", status=response.status_code)
                raise ExternalAPIException(
                    "The weather service rejected the request credentials."
                )

            if response.status_code == 400:
                # WeatherAPI.com returns 400 for an invalid/unrecognized
                # location (e.g. error code 1006), rather than a 404.
                logger.warning(
                    "Weather API rejected the request",
                    destination=destination,
                )
                raise ExternalAPIException(
                    f"Weather data could not be found for '{destination}'."
                )

            if response.status_code == 429:
                logger.warning("Weather API rate limited", attempt=attempt)
                last_exc = ExternalAPIException(
                    "The weather service is rate-limited. Please try again shortly."
                )
                if attempt < WEATHER_MAX_RETRIES:
                    await asyncio.sleep(WEATHER_RETRY_BACKOFF_SECONDS * (attempt + 1))
                    continue
                raise last_exc

            if response.status_code >= 500:
                logger.warning(
                    "Weather API server error",
                    status=response.status_code,
                    attempt=attempt,
                )
                last_exc = ExternalAPIException(
                    "The weather service is currently unavailable. "
                    "Please try again later."
                )
                if attempt < WEATHER_MAX_RETRIES:
                    await asyncio.sleep(WEATHER_RETRY_BACKOFF_SECONDS * (attempt + 1))
                    continue
                raise last_exc

            logger.error("Weather API unexpected status", status=response.status_code)
            raise ExternalAPIException("The weather service returned an error.")

        raise last_exc or ExternalAPIException("The weather service is unavailable.")
