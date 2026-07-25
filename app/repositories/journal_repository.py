from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.journal import Journal


class JournalRepository:
    """
    Repository for all Journal database operations.
    """

    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, journal: Journal) -> Journal:
        """
        Create a new journal entry.
        """
        self.db.add(journal)
        await self.db.commit()
        await self.db.refresh(journal)
        return journal

    async def get_by_id(self, journal_id: UUID) -> Journal | None:
        """
        Get a journal entry by ID, excluding soft-deleted records.
        """
        result = await self.db.execute(
            select(Journal).where(
                Journal.id == journal_id, Journal.is_deleted.is_(False)
            )
        )
        return result.scalar_one_or_none()

    async def get_all_for_trip(self, trip_id: UUID) -> list[Journal]:
        """
        Return all active journal entries belonging to a specific trip.
        """
        result = await self.db.execute(
            select(Journal).where(
                Journal.trip_id == trip_id,
                Journal.is_deleted.is_(False),
            )
        )
        return list(result.scalars().all())

    async def get_all_for_trip_ordered_by_date(self, trip_id: UUID) -> list[Journal]:
        """
        Return all active journal entries for a trip, ordered by
        journal_date ascending (used for the timeline view).
        """
        result = await self.db.execute(
            select(Journal)
            .where(
                Journal.trip_id == trip_id,
                Journal.is_deleted.is_(False),
            )
            .order_by(Journal.journal_date.asc())
        )
        return list(result.scalars().all())

    async def update(self, journal: Journal) -> Journal:
        """
        Save changes to an existing journal entry.
        """
        await self.db.commit()
        await self.db.refresh(journal)
        return journal

    async def delete(self, journal: Journal) -> None:
        """
        Soft-delete a journal entry.
        """
        journal.soft_delete()
        self.db.add(journal)
        await self.db.commit()
        await self.db.refresh(journal)
