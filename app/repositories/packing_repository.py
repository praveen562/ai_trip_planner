from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.packing_item import PackingItem


class PackingRepository:
    """
    Repository for all PackingItem database operations.
    """

    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, item: PackingItem) -> PackingItem:
        """
        Create a new packing item.
        """
        self.db.add(item)
        await self.db.commit()
        await self.db.refresh(item)
        return item

    async def get_by_id(self, item_id: UUID) -> PackingItem | None:
        """
        Get a packing item by ID, excluding soft-deleted records.
        """
        result = await self.db.execute(
            select(PackingItem).where(
                PackingItem.id == item_id, PackingItem.is_deleted.is_(False)
            )
        )
        return result.scalar_one_or_none()

    async def get_all_for_trip(self, trip_id: UUID) -> list[PackingItem]:
        """
        Return all active packing items belonging to a specific trip.
        """
        result = await self.db.execute(
            select(PackingItem).where(
                PackingItem.trip_id == trip_id,
                PackingItem.is_deleted.is_(False),
            )
        )
        return list(result.scalars().all())

    async def update(self, item: PackingItem) -> PackingItem:
        """
        Save changes to an existing packing item.
        """
        await self.db.commit()
        await self.db.refresh(item)
        return item

    async def delete(self, item: PackingItem) -> None:
        """
        Soft-delete a packing item.
        """
        item.soft_delete()
        self.db.add(item)
        await self.db.commit()
        await self.db.refresh(item)
