from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.trip import Trip


class TripRepository:
    """
    Repository for all Trip database operations.
    """

    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, trip: Trip) -> Trip:
        """
        Create a new trip.
        """
        self.db.add(trip)
        await self.db.commit()
        await self.db.refresh(trip)
        return trip

    async def get_by_id(self, trip_id: UUID) -> Trip | None:
        """
        Get a trip by ID, excluding soft-deleted records.
        """
        result = await self.db.execute(
            select(Trip).where(Trip.id == trip_id, Trip.is_deleted.is_(False))
        )
        return result.scalar_one_or_none()

    async def get_all_for_user(self, user_id: UUID) -> list[Trip]:
        """
        Return all active trips belonging to a specific user.
        """
        result = await self.db.execute(
            select(Trip).where(
                Trip.user_id == user_id,
                Trip.is_deleted.is_(False),
            )
        )
        return list(result.scalars().all())

    async def update(self, trip: Trip) -> Trip:
        """
        Save changes to an existing trip.
        """
        await self.db.commit()
        await self.db.refresh(trip)
        return trip

    async def delete(self, trip: Trip) -> None:
        """
        Soft-delete a trip.
        """
        trip.soft_delete()
        self.db.add(trip)
        await self.db.commit()
        await self.db.refresh(trip)
