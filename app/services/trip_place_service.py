from uuid import UUID

from sqlalchemy.exc import IntegrityError

from app.core.exceptions import (
    AuthorizationException,
    ConflictException,
    NotFoundException,
)
from app.models.trip import Trip
from app.models.trip_place import TripPlace
from app.repositories.trip_place_repository import TripPlaceRepository
from app.repositories.trip_repository import TripRepository
from app.schemas.trip_place import (
    TripPlaceCreate,
    TripPlaceListResponse,
    TripPlaceResponse,
)


class TripPlaceService:
    """
    Handles saved-place creation, retrieval, and lifecycle management.

    Saved places belong to a trip, which belongs to a user, so every
    operation verifies ownership by walking TripPlace -> Trip -> User.
    """

    def __init__(
        self,
        repository: TripPlaceRepository,
        trip_repository: TripRepository,
    ):
        self.repository = repository
        self.trip_repository = trip_repository

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

    async def _get_owned_place(self, user_id: UUID, place_id: UUID) -> TripPlace:
        """
        Retrieve a saved place, enforcing ownership via its trip.
        """
        place = await self.repository.get_by_id(place_id)

        if place is None:
            raise NotFoundException("Saved place not found.")

        await self._get_owned_trip(user_id, place.trip_id)

        return place

    async def create_place(
        self, user_id: UUID, trip_id: UUID, place_data: TripPlaceCreate
    ) -> TripPlace:
        """
        Save a place to a trip owned by the given user.

        Rejects duplicate saves: a place at the same coordinates
        cannot be saved twice to the same trip.
        """
        await self._get_owned_trip(user_id, trip_id)

        if await self.repository.exists(
            trip_id, place_data.latitude, place_data.longitude
        ):
            raise ConflictException("This place has already been saved to this trip.")

        place = TripPlace(
            trip_id=trip_id,
            name=place_data.name,
            latitude=place_data.latitude,
            longitude=place_data.longitude,
            kind=place_data.kind,
            image_url=place_data.image_url,
            address=place_data.address,
            description=place_data.description,
            source=place_data.source,
        )

        try:
            return await self.repository.create(place)
        except IntegrityError as exc:
            # A concurrent request may have inserted the same place
            # between the exists() check above and this insert. The
            # DB-level unique constraint is the final source of truth;
            # translate its violation into the same ConflictException
            # a same-request duplicate would raise.
            raise ConflictException(
                "This place has already been saved to this trip."
            ) from exc

    async def list_places(self, user_id: UUID, trip_id: UUID) -> TripPlaceListResponse:
        """
        List all saved places belonging to a trip owned by the given user.
        """
        await self._get_owned_trip(user_id, trip_id)
        places = await self.repository.get_all_for_trip(trip_id)

        return TripPlaceListResponse(
            trip_id=trip_id,
            count=len(places),
            places=[TripPlaceResponse.model_validate(place) for place in places],
        )

    async def delete_place(self, user_id: UUID, place_id: UUID) -> None:
        """
        Soft-delete a saved place, enforcing ownership via its trip.
        """
        place = await self._get_owned_place(user_id, place_id)
        await self.repository.delete(place)
