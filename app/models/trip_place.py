"""
Database model for persisted trip places (saved attractions/points of interest).

A TripPlace represents an attraction or point of interest that a user has
explicitly saved to a trip, originally sourced from an external places
provider (e.g. OpenTripMap). Unlike the ephemeral "nearby places" search
results returned by PlacesService, TripPlace rows are durable and form the
basis for downstream features such as route optimization, AI itinerary
refinement, and offline viewing.
"""

from sqlalchemy import Float, ForeignKey, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.mixins import SoftDeleteMixin, TimestampMixin, UUIDMixin


class TripPlace(UUIDMixin, TimestampMixin, SoftDeleteMixin, Base):
    """
    Represents a single saved place (attraction/POI) belonging to a trip.
    """

    __tablename__ = "trip_places"
    __table_args__ = (
        UniqueConstraint(
            "trip_id",
            "latitude",
            "longitude",
            name="uq_trip_places_trip_lat_lon",
        ),
    )

    trip_id: Mapped[str] = mapped_column(
        ForeignKey("trips.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    latitude: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    longitude: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    kind: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    image_url: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    address: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    source: Mapped[str] = mapped_column(
        String(50),
        default="OpenTripMap",
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
            f"TripPlace(id={self.id}, "
            f"trip_id={self.trip_id}, "
            f"name='{self.name}', "
            f"source='{self.source}')"
        )
