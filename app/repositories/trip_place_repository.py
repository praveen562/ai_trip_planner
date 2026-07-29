"""
Repository for all TripPlace database operations.
"""

from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.trip_place import TripPlace


class TripPlaceRepository:
    """
    Repository for all TripPlace database operations.
    """

    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, place: TripPlace) -> TripPlace:
        """
        Create a new saved place.
        """
        self.db.add(place)
        await self.db.commit()
        await self.db.refresh(place)
        return place

    async def get_by_id(self, place_id: UUID) -> TripPlace | None:
        """
        Get a saved place by ID, excluding soft-deleted records.
        """
        result = await self.db.execute(
            select(TripPlace).where(
                TripPlace.id == place_id, TripPlace.is_deleted.is_(False)
            )
        )
        return result.scalar_one_or_none()

    async def get_all_for_trip(self, trip_id: UUID) -> list[TripPlace]:
        """
        Return all active saved places belonging to a specific trip.
        """
        result = await self.db.execute(
            select(TripPlace).where(
                TripPlace.trip_id == trip_id,
                TripPlace.is_deleted.is_(False),
            )
        )
        return list(result.scalars().all())

    async def delete(self, place: TripPlace) -> None:
        """
        Soft-delete a saved place.
        """
        place.soft_delete()
        self.db.add(place)
        await self.db.commit()
        await self.db.refresh(place)

    async def exists(self, trip_id: UUID, latitude: float, longitude: float) -> bool:
        """
        Check whether an active saved place with the same coordinates
        already exists for a trip. Used by the service layer to reject
        duplicate saves before hitting the DB-level unique constraint.
        """
        result = await self.db.execute(
            select(TripPlace.id).where(
                TripPlace.trip_id == trip_id,
                TripPlace.latitude == latitude,
                TripPlace.longitude == longitude,
                TripPlace.is_deleted.is_(False),
            )
        )
        return result.scalar_one_or_none() is not None

    async def count_for_trip(self, trip_id: UUID) -> int:
        """
        Count all active saved places belonging to a specific trip.
        """
        result = await self.db.execute(
            select(func.count())
            .select_from(TripPlace)
            .where(
                TripPlace.trip_id == trip_id,
                TripPlace.is_deleted.is_(False),
            )
        )
        return int(result.scalar_one())
