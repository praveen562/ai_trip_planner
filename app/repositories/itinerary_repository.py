from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.itinerary import Itinerary


class ItineraryRepository:
    """
    Repository for all Itinerary database operations.
    """

    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, itinerary: Itinerary) -> Itinerary:
        """
        Create a new itinerary.
        """
        self.db.add(itinerary)
        await self.db.commit()
        await self.db.refresh(itinerary)
        return itinerary

    async def get_by_id(self, itinerary_id: UUID) -> Itinerary | None:
        """
        Get an itinerary by ID, excluding soft-deleted records.
        """
        result = await self.db.execute(
            select(Itinerary).where(
                Itinerary.id == itinerary_id, Itinerary.is_deleted.is_(False)
            )
        )
        return result.scalar_one_or_none()

    async def get_trip_itinerary(self, trip_id: UUID) -> Itinerary | None:
        """
        Get the active (non-soft-deleted) itinerary for a trip, if any.
        A trip has at most one active itinerary.
        """
        result = await self.db.execute(
            select(Itinerary).where(
                Itinerary.trip_id == trip_id,
                Itinerary.is_deleted.is_(False),
            )
        )
        return result.scalar_one_or_none()

    async def update(self, itinerary: Itinerary) -> Itinerary:
        """
        Save changes to an existing itinerary.
        """
        await self.db.commit()
        await self.db.refresh(itinerary)
        return itinerary

    async def delete(self, itinerary: Itinerary) -> None:
        """
        Soft-delete an itinerary.
        """
        itinerary.soft_delete()
        self.db.add(itinerary)
        await self.db.commit()
        await self.db.refresh(itinerary)
