from uuid import UUID

from app.core.exceptions import (
    AuthorizationException,
    NotFoundException,
    ValidationException,
)
from app.models.journal import Journal
from app.models.trip import Trip
from app.repositories.journal_repository import JournalRepository
from app.repositories.trip_repository import TripRepository
from app.schemas.journal import JournalCreate, JournalUpdate


class JournalService:
    """
    Handles journal entry creation, retrieval, and lifecycle management.

    Journal entries belong to a trip, which belongs to a user, so every
    operation verifies ownership by walking Journal -> Trip -> User.
    """

    def __init__(
        self,
        repository: JournalRepository,
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

    async def _get_owned_entry(
        self, user_id: UUID, journal_id: UUID
    ) -> tuple[Journal, Trip]:
        """
        Retrieve a journal entry along with its trip, enforcing
        ownership via the parent trip.
        """
        entry = await self.repository.get_by_id(journal_id)

        if entry is None:
            raise NotFoundException("Journal entry not found.")

        trip = await self._get_owned_trip(user_id, entry.trip_id)

        return entry, trip

    @staticmethod
    def _validate_journal_date(trip: Trip, journal_date) -> None:
        """
        Ensure a journal date falls within the trip's date range.
        """
        if journal_date < trip.start_date or journal_date > trip.end_date:
            raise ValidationException(
                "journal_date must fall between the trip's start_date and end_date."
            )

    async def create_entry(
        self, user_id: UUID, trip_id: UUID, entry_data: JournalCreate
    ) -> Journal:
        """
        Create a new journal entry for a trip owned by the given user.
        """
        trip = await self._get_owned_trip(user_id, trip_id)

        self._validate_journal_date(trip, entry_data.journal_date)

        entry = Journal(
            trip_id=trip_id,
            title=entry_data.title,
            description=entry_data.description,
            location=entry_data.location,
            mood=entry_data.mood,
            weather=entry_data.weather,
            journal_date=entry_data.journal_date,
        )

        return await self.repository.create(entry)

    async def list_entries(self, user_id: UUID, trip_id: UUID) -> list[Journal]:
        """
        List all journal entries belonging to a trip owned by the given user.
        """
        await self._get_owned_trip(user_id, trip_id)
        return await self.repository.get_all_for_trip(trip_id)

    async def get_entry(self, user_id: UUID, journal_id: UUID) -> Journal:
        """
        Retrieve a single journal entry, enforcing ownership via its trip.
        """
        entry, _ = await self._get_owned_entry(user_id, journal_id)
        return entry

    async def update_entry(
        self, user_id: UUID, journal_id: UUID, entry_data: JournalUpdate
    ) -> Journal:
        """
        Update an existing journal entry, enforcing ownership via its trip.
        """
        entry, trip = await self._get_owned_entry(user_id, journal_id)

        update_fields = entry_data.model_dump(exclude_unset=True)
        for field, value in update_fields.items():
            setattr(entry, field, value)

        if "journal_date" in update_fields:
            self._validate_journal_date(trip, entry.journal_date)

        return await self.repository.update(entry)

    async def delete_entry(self, user_id: UUID, journal_id: UUID) -> None:
        """
        Soft-delete a journal entry, enforcing ownership via its trip.
        """
        entry, _ = await self._get_owned_entry(user_id, journal_id)
        await self.repository.delete(entry)

    async def get_timeline(self, user_id: UUID, trip_id: UUID) -> list[Journal]:
        """
        Return all journal entries for a trip owned by the given user,
        ordered by journal_date ascending.
        """
        await self._get_owned_trip(user_id, trip_id)
        return await self.repository.get_all_for_trip_ordered_by_date(trip_id)
