from typing import Any
from uuid import UUID

from app.core.exceptions import (
    AuthorizationException,
    ExternalAPIException,
    NotFoundException,
)
from app.integrations.opentripmap_client import OpenTripMapClient
from app.models.trip import Trip
from app.repositories.trip_repository import TripRepository
from app.schemas.places import NearbyPlacesResponse, PlaceCoordinates, PlaceResponse

DEFAULT_SEARCH_RADIUS_METERS = 5000
DEFAULT_PLACE_LIMIT = 20
MAX_PLACE_LIMIT = 50
MAX_SEARCH_RADIUS_METERS = 50000

# Categories that rarely provide value to travellers; places whose
# entire tag set falls within this list are filtered out.
EXCLUDED_CATEGORIES = {
    "other",
    "cultural",
    "fountains",
    "urban_environment",
    "ruins",
    "historic_architecture",
    "abandoned_places",
}

# Tourist-relevant categories, used to prioritize results and choose
# the most meaningful "primary" category for a place.
INTERESTING_CATEGORIES = {
    "interesting_places",
    "architecture",
    "historic",
    "monuments_and_memorials",
    "museums",
    "religion",
    "churches",
    "temples",
    "view_points",
    "towers",
    "palaces",
    "castles",
    "gardens_and_parks",
    "beaches",
    "natural",
    "waterfalls",
    "bridges",
}

# How many raw results to request from the provider relative to the
# requested limit, to leave enough headroom after low-quality
# filtering and deduplication.
PROVIDER_FETCH_MULTIPLIER = 3
PROVIDER_FETCH_CAP = 100


class PlacesService:
    """
    Handles points-of-interest retrieval for a trip's destination.
    Ownership is enforced identically to WeatherService/ExpenseService:
    every trip-scoped operation verifies the trip belongs to the
    requesting user before calling out to the places provider.
    """

    def __init__(
        self,
        trip_repository: TripRepository,
        client: OpenTripMapClient,
    ):
        self.trip_repository = trip_repository
        self.client = client

    async def _get_owned_trip(self, user_id: UUID, trip_id: UUID) -> Trip:
        """
        Retrieve a trip, enforcing ownership.
        """
        trip = await self.trip_repository.get_by_id(trip_id)

        if trip is None:
            raise NotFoundException("Trip not found.")

        if trip.user_id != user_id:
            raise AuthorizationException("You do not have access to this trip.")

        return trip

    async def _resolve_coordinates(self, destination: str) -> tuple[float, float]:
        """
        Convert a destination name to coordinates via OpenTripMap's
        geocoding endpoint.
        """
        geocode_result = await self.client.geocode(destination)
        lat = geocode_result.get("lat")
        lon = geocode_result.get("lon")

        if lat is None or lon is None:
            raise ExternalAPIException(
                f"Could not resolve coordinates for '{destination}'."
            )

        return lat, lon

    @staticmethod
    def _extract_categories(kinds: str | None) -> list[str]:
        """
        OpenTripMap returns "kinds" as a comma-separated tag string
        (e.g. "museums,historic,interesting_places"). Split into a
        clean list of individual tags.
        """
        if not kinds:
            return []
        return [kind for kind in kinds.split(",") if kind]

    @staticmethod
    def _select_primary_category(categories: list[str]) -> str | None:
        """
        Choose the most relevant category to surface as the primary
        "category" field: the first tourist-relevant tag if one is
        present, otherwise the first tag overall.
        """
        if not categories:
            return None
        for category in categories:
            if category in INTERESTING_CATEGORIES:
                return category
        return categories[0]

    @staticmethod
    def _is_low_quality(name: str | None, categories: list[str]) -> bool:
        """
        A place is considered low-quality (and excluded from results)
        if it has no usable name, or if every one of its category
        tags falls within the low-value EXCLUDED_CATEGORIES set.
        """
        if not name or not name.strip() or name == "Unnamed place":
            return True
        if categories and all(
            category in EXCLUDED_CATEGORIES for category in categories
        ):
            return True
        return False

    @staticmethod
    def _parse_rate(raw_rate: Any) -> int:
        """
        OpenTripMap's "rate" field is inconsistently typed (int, or
        strings like "1h"/"2h"/"3h" for high-value sites). Extract a
        sortable integer, defaulting to 0 when unavailable.
        """
        if raw_rate is None:
            return 0
        if isinstance(raw_rate, int):
            return raw_rate
        digits = "".join(char for char in str(raw_rate) if char.isdigit())
        return int(digits) if digits else 0

    @classmethod
    def _build_place_response(
        cls,
        raw: dict[str, Any],
        categories: list[str],
        image: str | None = None,
        wikipedia: str | None = None,
        description: str | None = None,
    ) -> PlaceResponse:
        """
        Shared construction of a PlaceResponse from a raw OpenTripMap
        entry (used by both the lightweight radius-search parser and
        the full xid-details parser).
        """
        point = raw.get("point", {})
        return PlaceResponse(
            xid=raw.get("xid", ""),
            name=raw.get("name") or "Unnamed place",
            category=cls._select_primary_category(categories),
            categories=categories,
            coordinates=PlaceCoordinates(
                latitude=point.get("lat", 0.0),
                longitude=point.get("lon", 0.0),
            ),
            image=image,
            wikipedia=wikipedia,
            description=description,
        )

    @classmethod
    def _parse_place_summary(cls, raw: dict[str, Any]) -> PlaceResponse:
        """
        Parse a single result from OpenTripMap's radius search. This
        endpoint does not return image/wikipedia/description, only
        the xid/name/category/coordinates -- kept intentionally
        lightweight; full details are only fetched for a single xid.
        """
        categories = cls._extract_categories(raw.get("kinds"))
        return cls._build_place_response(raw, categories)

    @classmethod
    def _parse_place_details(cls, raw: dict[str, Any]) -> PlaceResponse:
        """
        Parse OpenTripMap's full place-details payload (by XID),
        which includes image/wikipedia/description when available.
        """
        categories = cls._extract_categories(raw.get("kinds"))
        preview = raw.get("preview") or {}
        wikipedia_extracts = raw.get("wikipedia_extracts") or {}

        return cls._build_place_response(
            raw,
            categories,
            image=preview.get("source"),
            wikipedia=raw.get("wikipedia"),
            description=wikipedia_extracts.get("text"),
        )

    @staticmethod
    def _deduplicate(
        entries: list[tuple[PlaceResponse, int]],
    ) -> list[tuple[PlaceResponse, int]]:
        """
        Remove duplicate places, keyed on xid where available,
        falling back to (name, rounded coordinates) otherwise.
        """
        seen_xids: set[str] = set()
        seen_keys: set[tuple[str, float, float]] = set()
        unique: list[tuple[PlaceResponse, int]] = []

        for place, rate in entries:
            fallback_key = (
                place.name.lower(),
                round(place.coordinates.latitude, 4),
                round(place.coordinates.longitude, 4),
            )

            if place.xid and place.xid in seen_xids:
                continue
            if fallback_key in seen_keys:
                continue

            if place.xid:
                seen_xids.add(place.xid)
            seen_keys.add(fallback_key)
            unique.append((place, rate))

        return unique

    @staticmethod
    def _sort_entries(
        entries: list[tuple[PlaceResponse, int]],
    ) -> list[tuple[PlaceResponse, int]]:
        """
        Stable sort by: (1) tourist-relevant category first,
        (2) named places first (unnamed places are filtered out
        earlier, but this keeps sorting correct if that ever changes),
        (3) higher OpenTripMap rate first.
        """
        return sorted(
            entries,
            key=lambda entry: (
                entry[0].category not in INTERESTING_CATEGORIES,
                entry[0].name == "Unnamed place" or not entry[0].name,
                -entry[1],
            ),
        )

    async def get_trip_places(
        self,
        user_id: UUID,
        trip_id: UUID,
        category: str | None = None,
        radius: int = DEFAULT_SEARCH_RADIUS_METERS,
        limit: int = DEFAULT_PLACE_LIMIT,
    ) -> NearbyPlacesResponse:
        """
        Retrieve nearby attractions for a trip owned by the given
        user, resolving the trip's destination to coordinates first.
        Low-quality results are filtered out, duplicates removed, and
        tourist-relevant places are sorted first. Only lightweight
        radius-search data is used here; no per-place detail calls.
        """
        trip = await self._get_owned_trip(user_id, trip_id)
        lat, lon = await self._resolve_coordinates(trip.destination_location)

        provider_fetch_limit = min(
            max(limit * PROVIDER_FETCH_MULTIPLIER, DEFAULT_PLACE_LIMIT),
            PROVIDER_FETCH_CAP,
        )
        raw_places = await self.client.search_nearby(
            lat, lon, radius=radius, limit=provider_fetch_limit
        )

        entries: list[tuple[PlaceResponse, int]] = []
        for raw_place in raw_places:
            categories = self._extract_categories(raw_place.get("kinds"))
            name = raw_place.get("name")

            if self._is_low_quality(name, categories):
                continue

            if category and category.lower() not in {c.lower() for c in categories}:
                continue

            place = self._parse_place_summary(raw_place)
            rate = self._parse_rate(raw_place.get("rate"))
            entries.append((place, rate))

        entries = self._deduplicate(entries)
        entries = self._sort_entries(entries)
        places = [place for place, _ in entries][:limit]

        return NearbyPlacesResponse(
            destination=trip.destination_location,
            radius=radius,
            count=len(places),
            places=places,
        )

    async def get_place_details(self, xid: str) -> PlaceResponse:
        """
        Retrieve full details for a single place by its OpenTripMap
        XID. Not trip-scoped, so no ownership check applies. This is
        the only place where description/image/wikipedia are fetched.
        """
        raw = await self.client.get_place_details(xid)
        return self._parse_place_details(raw)
