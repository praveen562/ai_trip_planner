from datetime import date
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import ExpenseCategory, PaymentMethod


class ExpenseCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=150)
    category: ExpenseCategory
    amount: Decimal = Field(..., gt=0)
    currency: str | None = Field(default=None, max_length=10)
    expense_date: date
    payment_method: PaymentMethod | None = None
    notes: str | None = None


class ExpenseUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=150)
    category: ExpenseCategory | None = None
    amount: Decimal | None = Field(default=None, gt=0)
    currency: str | None = Field(default=None, max_length=10)
    expense_date: date | None = None
    payment_method: PaymentMethod | None = None
    notes: str | None = None


class ExpenseResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    trip_id: UUID
    title: str
    category: ExpenseCategory
    amount: Decimal
    currency: str
    expense_date: date
    payment_method: PaymentMethod | None
    notes: str | None


class ExpenseSummaryResponse(BaseModel):
    total_expenses: Decimal
    expense_count: int
    category_breakdown: dict[str, Decimal]
