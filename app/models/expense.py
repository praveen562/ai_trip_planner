from datetime import date
from decimal import Decimal

from sqlalchemy import Date, Enum, ForeignKey, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.enums import ExpenseCategory, PaymentMethod
from app.models.mixins import SoftDeleteMixin, TimestampMixin, UUIDMixin


class Expense(UUIDMixin, TimestampMixin, SoftDeleteMixin, Base):
    """
    Represents a single expense logged against a trip.
    """

    __tablename__ = "expenses"

    trip_id: Mapped[str] = mapped_column(
        ForeignKey("trips.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    title: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )

    category: Mapped[ExpenseCategory] = mapped_column(
        Enum(ExpenseCategory),
        nullable=False,
    )

    amount: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        nullable=False,
    )

    currency: Mapped[str] = mapped_column(
        String(10),
        default="INR",
        nullable=False,
    )

    expense_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
    )

    payment_method: Mapped[PaymentMethod | None] = mapped_column(
        Enum(PaymentMethod),
        nullable=True,
    )

    notes: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    # Relationship (one-directional; Trip is not modified to avoid touching
    # an existing, already-shipped module)
    trip = relationship(
        "Trip",
        lazy="selectin",
    )

    def __repr__(self) -> str:
        return (
            f"Expense(id={self.id}, "
            f"trip_id={self.trip_id}, "
            f"title='{self.title}', "
            f"amount={self.amount})"
        )
