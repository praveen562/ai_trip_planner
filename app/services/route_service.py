from typing import Any
from uuid import UUID

from app.core.exceptions import (
    AuthorizationException,
    NotFoundException,
    ValidationException,
)
from app.integrations.osrm_client import OSRMClient, OSRMProfile
from app.models.trip import Trip
from app.models.trip_place import TripPlace
from app.repositories.trip_place_repository import TripPlaceRepository
from app.repositories.trip_repository import TripRepository
from app.schemas.route import (
    OptimizedWaypoint,
    OptimizeRouteResponse,
    RouteLeg,
    RouteResponse,
    RouteSummary,
)

METERS_PER_KILOMETER = 1000
SECONDS_PER_MINUTE = 60
MIN_PLACES_FOR_ROUTE = 2


class RouteService:
    """
    Generates routes and optimized visiting orders for a trip's saved
    places via OSRM.

    Coordinates always come from persisted TripPlace rows -- callers
    never supply coordinates manually. Ownership is enforced
    identically to every other trip-child service in this project:
    every operation walks TripPlace -> Trip -> User via
    _get_owned_trip before calling out to OSRM.
    """

    def __init__(
        self,
        trip_repository: TripRepository,
        trip_place_repository: TripPlaceRepository,
        osrm_client: OSRMClient,
    ):
        self.trip_repository = trip_repository
        self.trip_place_repository = trip_place_repository
        self.osrm_client = osrm_client

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

    async def _get_routable_places(self, trip_id: UUID) -> list[TripPlace]:
        """
        Load a trip's saved places, ensuring there are enough of them
        to compute a route.
        """
        places = await self.trip_place_repository.get_all_for_trip(trip_id)

        if len(places) < MIN_PLACES_FOR_ROUTE:
            raise ValidationException(
                "At least two saved places are required to generate a "
                f"route. This trip currently has {len(places)}."
            )

        return places

    @staticmethod
    def _to_km(meters: float) -> float:
        """
        Convert meters (OSRM's unit) to kilometres, rounded for
        display.
        """
        return round(meters / METERS_PER_KILOMETER, 2)

    @staticmethod
    def _to_minutes(seconds: float) -> float:
        """
        Convert seconds (OSRM's unit) to minutes, rounded for
        display.
        """
        return round(seconds / SECONDS_PER_MINUTE, 1)

    def _build_summary(
        self, raw_route: dict[str, Any], profile: OSRMProfile
    ) -> RouteSummary:
        """
        Build the top-line distance/duration summary from a single
        OSRM route/trip object.
        """
        return RouteSummary(
            profile=profile,
            total_distance_km=self._to_km(raw_route["distance"]),
            total_duration_minutes=self._to_minutes(raw_route["duration"]),
        )

    def _build_legs(
        self, raw_route: dict[str, Any], places: list[TripPlace]
    ) -> list[RouteLeg]:
        """
        Pair each OSRM route leg with the saved places it connects,
        in visiting order.
        """
        return [
            RouteLeg(
                from_place=places[index].name,
                to_place=places[index + 1].name,
                distance_km=self._to_km(leg["distance"]),
                duration_minutes=self._to_minutes(leg["duration"]),
            )
            for index, leg in enumerate(raw_route.get("legs", []))
        ]

    async def get_route(
        self, user_id: UUID, trip_id: UUID, profile: OSRMProfile = "driving"
    ) -> RouteResponse:
        """
        Compute the route through a trip's saved places, visited in
        the order they were saved.
        """
        await self._get_owned_trip(user_id, trip_id)
        places = await self._get_routable_places(trip_id)

        coordinates = [(place.latitude, place.longitude) for place in places]
        raw = await self.osrm_client.get_route(coordinates, profile=profile)
        raw_route = raw["routes"][0]

        return RouteResponse(
            trip_id=trip_id,
            summary=self._build_summary(raw_route, profile),
            legs=self._build_legs(raw_route, places),
            geometry=raw_route.get("geometry", {}),
        )

    async def optimize_route(
        self, user_id: UUID, trip_id: UUID, profile: OSRMProfile = "driving"
    ) -> OptimizeRouteResponse:
        """
        Compute the most efficient visiting order for a trip's saved
        places (solves the underlying travelling-salesman problem via
        OSRM's /trip service).
        """
        await self._get_owned_trip(user_id, trip_id)
        places = await self._get_routable_places(trip_id)

        coordinates = [(place.latitude, place.longitude) for place in places]
        raw = await self.osrm_client.optimize_trip(coordinates, profile=profile)
        raw_trip = raw["trips"][0]
        raw_waypoints = raw.get("waypoints", [])

        waypoints = [
            OptimizedWaypoint(
                place_id=place.id,
                name=place.name,
                latitude=place.latitude,
                longitude=place.longitude,
                order=raw_waypoints[index]["waypoint_index"],
            )
            for index, place in enumerate(places)
        ]
        waypoints.sort(key=lambda waypoint: waypoint.order)

        return OptimizeRouteResponse(
            trip_id=trip_id,
            summary=self._build_summary(raw_trip, profile),
            waypoints=waypoints,
            geometry=raw_trip.get("geometry", {}),
        )
