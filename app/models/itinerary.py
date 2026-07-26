from sqlalchemy import Boolean, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.mixins import SoftDeleteMixin, TimestampMixin, UUIDMixin


class Itinerary(UUIDMixin, TimestampMixin, SoftDeleteMixin, Base):
    """
    Represents an AI-generated itinerary for a trip. Stores both the
    prompt sent to the AI provider and its response, so the itinerary
    can be viewed later without regenerating it.
    """

    __tablename__ = "itineraries"

    trip_id: Mapped[str] = mapped_column(
        ForeignKey("trips.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    title: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )

    ai_prompt: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    ai_response: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    total_days: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    is_regenerated: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
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
            f"Itinerary(id={self.id}, "
            f"trip_id={self.trip_id}, "
            f"title='{self.title}', "
            f"is_regenerated={self.is_regenerated})"
        )
