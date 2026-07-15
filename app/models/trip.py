from datetime import date
from decimal import Decimal

from sqlalchemy import Date, Enum, ForeignKey, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.enums import TravelStyle, TripStatus
from app.models.mixins import SoftDeleteMixin, TimestampMixin, UUIDMixin


class Trip(UUIDMixin, TimestampMixin, SoftDeleteMixin, Base):
    """
    Represents a travel plan created by a user.
    """

    __tablename__ = "trips"

    user_id: Mapped[str] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    title: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )

    source_location: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )

    destination_location: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )

    start_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
    )

    end_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
    )

    total_days: Mapped[int] = mapped_column(
        nullable=False,
    )

    budget: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        nullable=False,
    )

    travel_style: Mapped[TravelStyle] = mapped_column(
        Enum(TravelStyle),
        default=TravelStyle.BALANCED,
        nullable=False,
    )

    status: Mapped[TripStatus] = mapped_column(
        Enum(TripStatus),
        default=TripStatus.PLANNING,
        nullable=False,
    )

    notes: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    # Relationships
    user = relationship(
        "User",
        back_populates="trips",
        lazy="selectin",
    )

    itineraries = relationship(
        "Itinerary",
        back_populates="trip",
        cascade="all, delete-orphan",
        lazy="selectin",
    )
    trips = relationship(
        "Trip",
        back_populates="user",
        cascade="all, delete-orphan",
        lazy="selectin",
    )

    def __repr__(self) -> str:
        return (
            f"Trip(id={self.id}, "
            f"title='{self.title}', "
            f"destination='{self.destination_location}')"
        )
