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

DEFAULT_SEARCH_RADIUS_METERS = 10000
DEFAULT_PLACE_LIMIT = 20


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
    def _extract_category(kinds: str | None) -> str | None:
        """
        OpenTripMap returns "kinds" as a comma-separated tag string
        (e.g. "museums,historic,interesting_places"). The first tag
        is used as the place's primary category.
        """
        if not kinds:
            return None
        return kinds.split(",")[0]

    @classmethod
    def _parse_place_summary(cls, raw: dict[str, Any]) -> PlaceResponse:
        """
        Parse a single result from OpenTripMap's radius search. This
        endpoint does not return image/wikipedia/description, only
        the xid/name/category/coordinates.
        """
        point = raw.get("point", {})
        return PlaceResponse(
            xid=raw.get("xid", ""),
            name=raw.get("name") or "Unnamed place",
            category=cls._extract_category(raw.get("kinds")),
            coordinates=PlaceCoordinates(
                latitude=point.get("lat", 0.0),
                longitude=point.get("lon", 0.0),
            ),
            image=None,
            wikipedia=None,
            description=None,
        )

    @classmethod
    def _parse_place_details(cls, raw: dict[str, Any]) -> PlaceResponse:
        """
        Parse OpenTripMap's full place-details payload (by XID),
        which includes image/wikipedia/description when available.
        """
        point = raw.get("point", {})
        preview = raw.get("preview") or {}
        wikipedia_extracts = raw.get("wikipedia_extracts") or {}

        return PlaceResponse(
            xid=raw.get("xid", ""),
            name=raw.get("name") or "Unnamed place",
            category=cls._extract_category(raw.get("kinds")),
            coordinates=PlaceCoordinates(
                latitude=point.get("lat", 0.0),
                longitude=point.get("lon", 0.0),
            ),
            image=preview.get("source"),
            wikipedia=raw.get("wikipedia"),
            description=wikipedia_extracts.get("text"),
        )

    async def get_trip_places(
        self,
        user_id: UUID,
        trip_id: UUID,
        radius: int = DEFAULT_SEARCH_RADIUS_METERS,
        limit: int = DEFAULT_PLACE_LIMIT,
    ) -> NearbyPlacesResponse:
        """
        Retrieve nearby attractions for a trip owned by the given
        user, resolving the trip's destination to coordinates first.
        """
        trip = await self._get_owned_trip(user_id, trip_id)
        lat, lon = await self._resolve_coordinates(trip.destination_location)

        raw_places = await self.client.search_nearby(
            lat, lon, radius=radius, limit=limit
        )
        places = [self._parse_place_summary(raw_place) for raw_place in raw_places]

        return NearbyPlacesResponse(
            destination=trip.destination_location, places=places
        )

    async def get_place_details(self, xid: str) -> PlaceResponse:
        """
        Retrieve full details for a single place by its OpenTripMap
        XID. Not trip-scoped, so no ownership check applies.
        """
        raw = await self.client.get_place_details(xid)
        return self._parse_place_details(raw)
