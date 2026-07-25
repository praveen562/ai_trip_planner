from sqlalchemy import Boolean, Enum, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.enums import PackingCategory, PackingPriority
from app.models.mixins import SoftDeleteMixin, TimestampMixin, UUIDMixin


class PackingItem(UUIDMixin, TimestampMixin, SoftDeleteMixin, Base):
    """
    Represents a single packing checklist item for a trip.
    """

    __tablename__ = "packing_items"

    trip_id: Mapped[str] = mapped_column(
        ForeignKey("trips.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    item_name: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )

    category: Mapped[PackingCategory] = mapped_column(
        Enum(PackingCategory),
        nullable=False,
    )

    quantity: Mapped[int] = mapped_column(
        Integer,
        default=1,
        nullable=False,
    )

    is_packed: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    priority: Mapped[PackingPriority] = mapped_column(
        Enum(PackingPriority),
        default=PackingPriority.MEDIUM,
        nullable=False,
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
            f"PackingItem(id={self.id}, "
            f"trip_id={self.trip_id}, "
            f"item_name='{self.item_name}', "
            f"is_packed={self.is_packed})"
        )
