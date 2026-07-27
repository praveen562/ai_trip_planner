import asyncio
from abc import ABC, abstractmethod
from typing import Any

import httpx
import structlog

from app.core.config import settings
from app.core.exceptions import ExternalAPIException

logger = structlog.get_logger()

IMAGE_REQUEST_TIMEOUT_SECONDS = 15.0
IMAGE_MAX_RETRIES = 2
IMAGE_RETRY_BACKOFF_SECONDS = 1.0
IMAGE_CONCURRENCY_LIMIT = 5


class BaseImageClient(ABC):
    """
    Base class for pluggable image-provider clients. A new provider
    (Pexels, Pixabay, Google Places Photos, etc.) can be added later
    by subclassing this and implementing _fetch_image_url() only --
    PlacesService depends solely on the public search_image()
    contract defined here, so it never needs to change.

    Image lookups are always best-effort: any failure (missing
    config, timeout, rate limit, provider outage) results in None
    rather than an exception, since a missing image must never fail
    the endpoint that's enriching places with it.
    """

    def __init__(self) -> None:
        self._cache: dict[str, str | None] = {}
        self._in_flight: dict[str, asyncio.Task[str | None]] = {}
        self._semaphore = asyncio.Semaphore(IMAGE_CONCURRENCY_LIMIT)

    @staticmethod
    def _normalize_query(query: str) -> str:
        """
        Normalize a search query for use as a cache/dedup key.
        """
        return " ".join(query.lower().split())

    async def _search_with_cache(self, query: str) -> str | None:
        """
        Look up (and cache) an image URL for a single query string.
        Concurrent requests for the same normalized query share a
        single in-flight lookup rather than firing duplicate calls.
        """
        key = self._normalize_query(query)

        if key in self._cache:
            return self._cache[key]

        if key in self._in_flight:
            return await self._in_flight[key]

        task = asyncio.ensure_future(self._fetch_and_cache(key, query))
        self._in_flight[key] = task

        try:
            return await task
        finally:
            self._in_flight.pop(key, None)

    async def _fetch_and_cache(self, key: str, query: str) -> str | None:
        """
        Perform the provider-specific fetch, bounded by the shared
        concurrency semaphore, and cache the result (including a
        negative/failed result) so it is never looked up again.
        """
        async with self._semaphore:
            try:
                result = await self._fetch_image_url(query)
            except Exception as exc:  # noqa: BLE001 - best-effort by design
                logger.warning(
                    "Image provider lookup failed; continuing without an image",
                    query=query,
                    error=str(exc),
                )
                result = None

        self._cache[key] = result
        return result

    @abstractmethod
    async def _fetch_image_url(self, query: str) -> str | None:
        """
        Provider-specific implementation: perform the actual search
        and return the best matching image URL, or None if nothing
        was found. Raising ExternalAPIException here is fine -- it's
        caught by _fetch_and_cache and turned into a None result.
        """
        raise NotImplementedError

    async def search_image(
        self, place_name: str, destination: str | None = None
    ) -> str | None:
        """
        Search for an image of a place, trying the place name alone
        first, then falling back to "<place_name> <destination>" if
        no result was found and a destination is available. Never
        raises; returns None if no image could be found.
        """
        result = await self._search_with_cache(place_name)
        if result:
            return result

        if destination:
            fallback_query = f"{place_name} {destination}"
            return await self._search_with_cache(fallback_query)

        return None


class UnsplashClient(BaseImageClient):
    """
    Image provider client for Unsplash. Handles API key injection,
    timeouts, and retries for transient failures internally; all
    failures degrade to "no image" rather than propagating, per
    BaseImageClient's contract.
    """

    def __init__(self) -> None:
        super().__init__()
        self.api_key = settings.UNSPLASH_ACCESS_KEY
        self.base_url = settings.UNSPLASH_BASE_URL

    async def _fetch_image_url(self, query: str) -> str | None:
        """
        Query Unsplash's search/photos endpoint and return the first
        result's regular-size image URL, or None if unavailable.
        """
        if not self.api_key:
            logger.info("Unsplash is not configured; skipping image lookup")
            return None

        results = await self._search_photos(query)

        if not results:
            return None

        return results[0].get("urls", {}).get("regular")

    async def _search_photos(self, query: str) -> list[dict[str, Any]]:
        """
        Call Unsplash's /search/photos endpoint with retry handling
        for transient failures, mirroring the structure used by
        WeatherClient/OpenTripMapClient. Raises ExternalAPIException
        on unrecoverable failure (caught by the base class, which
        turns it into a None result).
        """
        params = {"query": query, "per_page": 1}
        headers = {"Authorization": f"Client-ID {self.api_key}"}

        last_exc: ExternalAPIException | None = None

        for attempt in range(IMAGE_MAX_RETRIES + 1):
            try:
                async with httpx.AsyncClient(
                    timeout=IMAGE_REQUEST_TIMEOUT_SECONDS
                ) as client:
                    response = await client.get(
                        f"{self.base_url}/search/photos",
                        params=params,
                        headers=headers,
                    )
            except httpx.TimeoutException as exc:
                logger.warning("Unsplash request timed out", attempt=attempt)
                last_exc = ExternalAPIException("The image service timed out.")
                if attempt < IMAGE_MAX_RETRIES:
                    await asyncio.sleep(IMAGE_RETRY_BACKOFF_SECONDS * (attempt + 1))
                    continue
                raise last_exc from exc
            except httpx.HTTPError as exc:
                logger.error("Unsplash network error", error=str(exc))
                raise ExternalAPIException(
                    "Unable to reach the image service."
                ) from exc

            if response.status_code == 200:
                data = response.json()
                return data.get("results", [])

            if response.status_code in (401, 403):
                logger.error("Unsplash auth failed", status=response.status_code)
                raise ExternalAPIException(
                    "The image service rejected the request credentials."
                )

            if response.status_code == 429:
                logger.warning("Unsplash rate limited", attempt=attempt)
                last_exc = ExternalAPIException("The image service is rate-limited.")
                if attempt < IMAGE_MAX_RETRIES:
                    await asyncio.sleep(IMAGE_RETRY_BACKOFF_SECONDS * (attempt + 1))
                    continue
                raise last_exc

            if response.status_code >= 500:
                logger.warning(
                    "Unsplash server error",
                    status=response.status_code,
                    attempt=attempt,
                )
                last_exc = ExternalAPIException("The image service is unavailable.")
                if attempt < IMAGE_MAX_RETRIES:
                    await asyncio.sleep(IMAGE_RETRY_BACKOFF_SECONDS * (attempt + 1))
                    continue
                raise last_exc

            logger.error("Unsplash unexpected status", status=response.status_code)
            raise ExternalAPIException("The image service returned an error.")

        raise last_exc or ExternalAPIException("The image service is unavailable.")
