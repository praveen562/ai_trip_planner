from uuid import UUID

from fastapi import APIRouter, Depends, status

from app.api.deps import get_current_user, get_expense_service
from app.models.user import User
from app.schemas.expense import (
    ExpenseCreate,
    ExpenseResponse,
    ExpenseSummaryResponse,
    ExpenseUpdate,
)
from app.services.expense_service import ExpenseService

router = APIRouter()


@router.post(
    "/trips/{trip_id}/expenses",
    response_model=ExpenseResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_expense(
    trip_id: UUID,
    expense: ExpenseCreate,
    current_user: User = Depends(get_current_user),
    service: ExpenseService = Depends(get_expense_service),
):
    """
    Create a new expense for a trip owned by the currently logged-in user.
    """
    return await service.create_expense(current_user.id, trip_id, expense)


@router.get(
    "/trips/{trip_id}/expenses",
    response_model=list[ExpenseResponse],
    status_code=status.HTTP_200_OK,
)
async def list_expenses(
    trip_id: UUID,
    current_user: User = Depends(get_current_user),
    service: ExpenseService = Depends(get_expense_service),
):
    """
    List all expenses for a trip owned by the currently logged-in user.
    """
    return await service.list_expenses(current_user.id, trip_id)


@router.get(
    "/trips/{trip_id}/expenses/summary",
    response_model=ExpenseSummaryResponse,
    status_code=status.HTTP_200_OK,
)
async def get_expense_summary(
    trip_id: UUID,
    current_user: User = Depends(get_current_user),
    service: ExpenseService = Depends(get_expense_service),
):
    """
    Get total spend, expense count, and category breakdown for a trip
    owned by the currently logged-in user.
    """
    return await service.get_summary(current_user.id, trip_id)


@router.get(
    "/expenses/{expense_id}",
    response_model=ExpenseResponse,
    status_code=status.HTTP_200_OK,
)
async def get_expense(
    expense_id: UUID,
    current_user: User = Depends(get_current_user),
    service: ExpenseService = Depends(get_expense_service),
):
    """
    Get a single expense owned by the currently logged-in user (via its trip).
    """
    return await service.get_expense(current_user.id, expense_id)


@router.patch(
    "/expenses/{expense_id}",
    response_model=ExpenseResponse,
    status_code=status.HTTP_200_OK,
)
async def update_expense(
    expense_id: UUID,
    expense: ExpenseUpdate,
    current_user: User = Depends(get_current_user),
    service: ExpenseService = Depends(get_expense_service),
):
    """
    Update an expense owned by the currently logged-in user (via its trip).
    """
    return await service.update_expense(current_user.id, expense_id, expense)


@router.delete("/expenses/{expense_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_expense(
    expense_id: UUID,
    current_user: User = Depends(get_current_user),
    service: ExpenseService = Depends(get_expense_service),
):
    """
    Soft-delete an expense owned by the currently logged-in user (via its trip).
    """
    await service.delete_expense(current_user.id, expense_id)
