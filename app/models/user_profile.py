from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.mixins import TimestampMixin, UUIDMixin


class UserProfile(UUIDMixin, TimestampMixin, Base):
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

    phone_number: Mapped[str | None] = mapped_column(
        String(20),
        nullable=True,
    )

    profile_picture: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    bio: Mapped[str | None] = mapped_column(
        String(500),
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

    timezone: Mapped[str | None] = mapped_column(
        String(100),
        default="Asia/Kolkata",
    )

    user = relationship(
        "User",
        back_populates="profile",
    )

    def __repr__(self) -> str:
        return f"UserProfile(user_id={self.user_id})"
