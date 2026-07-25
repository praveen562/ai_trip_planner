from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.expense import Expense


class ExpenseRepository:
    """
    Repository for all Expense database operations.
    """

    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, expense: Expense) -> Expense:
        """
        Create a new expense.
        """
        self.db.add(expense)
        await self.db.commit()
        await self.db.refresh(expense)
        return expense

    async def get_by_id(self, expense_id: UUID) -> Expense | None:
        """
        Get an expense by ID, excluding soft-deleted records.
        """
        result = await self.db.execute(
            select(Expense).where(
                Expense.id == expense_id, Expense.is_deleted.is_(False)
            )
        )
        return result.scalar_one_or_none()

    async def get_all_for_trip(self, trip_id: UUID) -> list[Expense]:
        """
        Return all active expenses belonging to a specific trip.
        """
        result = await self.db.execute(
            select(Expense).where(
                Expense.trip_id == trip_id,
                Expense.is_deleted.is_(False),
            )
        )
        return list(result.scalars().all())

    async def update(self, expense: Expense) -> Expense:
        """
        Save changes to an existing expense.
        """
        await self.db.commit()
        await self.db.refresh(expense)
        return expense

    async def delete(self, expense: Expense) -> None:
        """
        Soft-delete an expense.
        """
        expense.soft_delete()
        self.db.add(expense)
        await self.db.commit()
        await self.db.refresh(expense)
