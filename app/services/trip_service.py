from uuid import UUID

from app.core.exceptions import (
    AuthorizationException,
    NotFoundException,
    ValidationException,
)
from app.models.trip import Trip
from app.repositories.trip_repository import TripRepository
from app.schemas.trip import TripCreate, TripUpdate


class TripService:
    """
    Handles trip creation, retrieval, and lifecycle management.
    """

    def __init__(self, repository: TripRepository):
        self.repository = repository

    @staticmethod
    def _compute_total_days(start_date, end_date) -> int:
        """
        Validate a start/end date pair and return the inclusive day count.
        """
        total_days = (end_date - start_date).days + 1

        if total_days <= 0:
            raise ValidationException("end_date must be on or after start_date.")

        return total_days

    async def create_trip(self, user_id: UUID, trip_data: TripCreate) -> Trip:
        """
        Create a new trip owned by the given user.
        """
        total_days = self._compute_total_days(trip_data.start_date, trip_data.end_date)

        trip = Trip(
            user_id=user_id,
            title=trip_data.title,
            source_location=trip_data.source_location,
            destination_location=trip_data.destination_location,
            start_date=trip_data.start_date,
            end_date=trip_data.end_date,
            total_days=total_days,
            budget=trip_data.budget,
            travel_style=trip_data.travel_style,
            notes=trip_data.notes,
        )

        return await self.repository.create(trip)

    async def list_trips(self, user_id: UUID) -> list[Trip]:
        """
        List all trips belonging to the given user.
        """
        return await self.repository.get_all_for_user(user_id)

    async def get_trip(self, user_id: UUID, trip_id: UUID) -> Trip:
        """
        Retrieve a single trip, enforcing ownership.
        """
        trip = await self.repository.get_by_id(trip_id)

        if trip is None:
            raise NotFoundException("Trip not found.")

        if trip.user_id != user_id:
            raise AuthorizationException("You do not have access to this trip.")

        return trip

    async def update_trip(
        self, user_id: UUID, trip_id: UUID, trip_data: TripUpdate
    ) -> Trip:
        """
        Update an existing trip, enforcing ownership. Recalculates and
        validates total_days whenever either date field changes.
        """
        trip = await self.get_trip(user_id, trip_id)

        update_fields = trip_data.model_dump(exclude_unset=True)
        for field, value in update_fields.items():
            setattr(trip, field, value)

        if "start_date" in update_fields or "end_date" in update_fields:
            trip.total_days = self._compute_total_days(trip.start_date, trip.end_date)

        return await self.repository.update(trip)

    async def delete_trip(self, user_id: UUID, trip_id: UUID) -> None:
        """
        Soft-delete a trip, enforcing ownership.
        """
        trip = await self.get_trip(user_id, trip_id)
        await self.repository.delete(trip)
