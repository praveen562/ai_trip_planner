from datetime import datetime

from sqlalchemy import Boolean, DateTime, Enum, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.enums import UserRole
from app.models.mixins import SoftDeleteMixin, TimestampMixin, UUIDMixin


class User(UUIDMixin, TimestampMixin, SoftDeleteMixin, Base):
    """
    Represents an application user.

    A user owns trips, journals, chat sessions,
    notifications, and analytics.
    """

    __tablename__ = "users"

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        index=True,
        nullable=False,
    )

    password_hash: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    full_name: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )

    role: Mapped[UserRole] = mapped_column(
        Enum(UserRole),
        default=UserRole.USER,
        nullable=False,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    is_verified: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    last_login: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    # Relationships
    profile = relationship(
    "UserProfile",
    back_populates="user",
    uselist=False,
    cascade="all, delete-orphan",
    lazy="selectin",
    )

    trips = relationship(
        "Trip",
        back_populates="user",
        cascade="all, delete-orphan",
        lazy="selectin",
    )

    #chat_sessions = relationship(
     #   "ChatSession",
     #   back_populates="user",
     #   cascade="all, delete-orphan",
    #    lazy="selectin",
    #)

    #notifications = relationship(
    #    "Notification",
      #  back_populates="user",
      #  cascade="all, delete-orphan",
       # lazy="selectin",
    #)

    #analytics = relationship(
     #   "UserAnalytics",
      #  back_populates="user",
       # uselist=False,
       # lazy="selectin",
    #)

    def __repr__(self) -> str:
        return f"User(id={self.id}, " f"email='{self.email}', " f"role='{self.role}')"
