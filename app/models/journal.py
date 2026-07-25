from datetime import date

from sqlalchemy import Date, Enum, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.enums import Mood, Weather
from app.models.mixins import SoftDeleteMixin, TimestampMixin, UUIDMixin


class Journal(UUIDMixin, TimestampMixin, SoftDeleteMixin, Base):
    """
    Represents a single journal entry logged against a trip.
    """

    __tablename__ = "journals"

    trip_id: Mapped[str] = mapped_column(
        ForeignKey("trips.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    title: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )

    description: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    location: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True,
    )

    mood: Mapped[Mood | None] = mapped_column(
        Enum(Mood),
        nullable=True,
    )

    weather: Mapped[Weather | None] = mapped_column(
        Enum(Weather),
        nullable=True,
    )

    journal_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
    )

    # Relationship (one-directional; Trip is not modified to avoid touching
    # an existing, already-shipped module)
    trip = relationship(
        "Trip",
        lazy="selectin",
    )

    def __repr__(self) -> str:
        return (
            f"Journal(id={self.id}, "
            f"trip_id={self.trip_id}, "
            f"title='{self.title}')"
        )
