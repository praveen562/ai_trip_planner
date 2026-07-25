from datetime import date

from sqlalchemy import Date, Enum, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.enums import Gender
from app.models.mixins import SoftDeleteMixin, TimestampMixin, UUIDMixin


class UserProfile(UUIDMixin, TimestampMixin, SoftDeleteMixin, Base):
    """
    Stores user profile information separate
    from authentication data.
    """

    __tablename__ = "user_profiles"

    user_id: Mapped[str] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
    )

    full_name: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )

    phone_number: Mapped[str | None] = mapped_column(
        String(20),
        nullable=True,
    )

    date_of_birth: Mapped[date | None] = mapped_column(
        Date,
        nullable=True,
    )

    gender: Mapped[Gender | None] = mapped_column(
        Enum(Gender),
        nullable=True,
    )

    nationality: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    preferred_language: Mapped[str | None] = mapped_column(
        String(50),
        default="English",
    )

    preferred_currency: Mapped[str | None] = mapped_column(
        String(10),
        default="INR",
    )

    emergency_contact_name: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True,
    )

    emergency_contact_phone: Mapped[str | None] = mapped_column(
        String(20),
        nullable=True,
    )

    dietary_preferences: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    accessibility_requirements: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    bio: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    profile_image_url: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    user = relationship(
        "User",
        back_populates="profile",
    )

    def __repr__(self) -> str:
        return f"UserProfile(user_id={self.user_id})"
