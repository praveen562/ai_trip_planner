from decimal import Decimal
from uuid import UUID

from app.core.exceptions import (
    AuthorizationException,
    NotFoundException,
    ValidationException,
)
from app.models.expense import Expense
from app.models.trip import Trip
from app.repositories.expense_repository import ExpenseRepository
from app.repositories.trip_repository import TripRepository
from app.repositories.user_profile_repository import UserProfileRepository
from app.schemas.expense import ExpenseCreate, ExpenseSummaryResponse, ExpenseUpdate


class ExpenseService:
    """
    Handles expense creation, retrieval, and lifecycle management.

    Expenses belong to a trip, which belongs to a user, so every
    operation verifies ownership by walking Expense -> Trip -> User.
    """

    def __init__(
        self,
        repository: ExpenseRepository,
        trip_repository: TripRepository,
        profile_repository: UserProfileRepository,
    ):
        self.repository = repository
        self.trip_repository = trip_repository
        self.profile_repository = profile_repository

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

    async def _get_owned_expense(
        self, user_id: UUID, expense_id: UUID
    ) -> tuple[Expense, Trip]:
        """
        Retrieve an expense along with its trip, enforcing ownership
        via the parent trip.
        """
        expense = await self.repository.get_by_id(expense_id)

        if expense is None:
            raise NotFoundException("Expense not found.")

        trip = await self._get_owned_trip(user_id, expense.trip_id)

        return expense, trip

    @staticmethod
    def _validate_expense_date(trip: Trip, expense_date) -> None:
        """
        Ensure an expense date falls within the trip's date range.
        """
        if expense_date < trip.start_date or expense_date > trip.end_date:
            raise ValidationException(
                "expense_date must fall between the trip's start_date and end_date."
            )

    async def _resolve_currency(self, user_id: UUID, currency: str | None) -> str:
        """
        Resolve the currency for an expense: use the given value if
        provided, otherwise fall back to the user's preferred
        currency, otherwise default to INR.
        """
        if currency:
            return currency

        profile = await self.profile_repository.get_by_user_id(user_id)

        if profile is not None and profile.preferred_currency:
            return profile.preferred_currency

        return "INR"

    async def create_expense(
        self, user_id: UUID, trip_id: UUID, expense_data: ExpenseCreate
    ) -> Expense:
        """
        Create a new expense for a trip owned by the given user.
        """
        trip = await self._get_owned_trip(user_id, trip_id)

        self._validate_expense_date(trip, expense_data.expense_date)

        currency = await self._resolve_currency(user_id, expense_data.currency)

        expense = Expense(
            trip_id=trip_id,
            title=expense_data.title,
            category=expense_data.category,
            amount=expense_data.amount,
            currency=currency,
            expense_date=expense_data.expense_date,
            payment_method=expense_data.payment_method,
            notes=expense_data.notes,
        )

        return await self.repository.create(expense)

    async def list_expenses(self, user_id: UUID, trip_id: UUID) -> list[Expense]:
        """
        List all expenses belonging to a trip owned by the given user.
        """
        await self._get_owned_trip(user_id, trip_id)
        return await self.repository.get_all_for_trip(trip_id)

    async def get_expense(self, user_id: UUID, expense_id: UUID) -> Expense:
        """
        Retrieve a single expense, enforcing ownership via its trip.
        """
        expense, _ = await self._get_owned_expense(user_id, expense_id)
        return expense

    async def update_expense(
        self, user_id: UUID, expense_id: UUID, expense_data: ExpenseUpdate
    ) -> Expense:
        """
        Update an existing expense, enforcing ownership via its trip.
        """
        expense, trip = await self._get_owned_expense(user_id, expense_id)

        update_fields = expense_data.model_dump(exclude_unset=True)
        for field, value in update_fields.items():
            setattr(expense, field, value)

        if "expense_date" in update_fields:
            self._validate_expense_date(trip, expense.expense_date)

        return await self.repository.update(expense)

    async def delete_expense(self, user_id: UUID, expense_id: UUID) -> None:
        """
        Soft-delete an expense, enforcing ownership via its trip.
        """
        expense, _ = await self._get_owned_expense(user_id, expense_id)
        await self.repository.delete(expense)

    async def get_summary(self, user_id: UUID, trip_id: UUID) -> ExpenseSummaryResponse:
        """
        Compute total spend, expense count, and per-category breakdown
        for a trip owned by the given user.
        """
        await self._get_owned_trip(user_id, trip_id)
        expenses = await self.repository.get_all_for_trip(trip_id)

        total_expenses = Decimal("0")
        category_breakdown: dict[str, Decimal] = {}

        for expense in expenses:
            total_expenses += expense.amount
            category_label = expense.category.value.title()
            category_breakdown[category_label] = (
                category_breakdown.get(category_label, Decimal("0")) + expense.amount
            )

        return ExpenseSummaryResponse(
            total_expenses=total_expenses,
            expense_count=len(expenses),
            category_breakdown=category_breakdown,
        )
