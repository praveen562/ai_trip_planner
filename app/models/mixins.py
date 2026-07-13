import uuid
from datetime import datetime

from sqlalchemy import DateTime, func
from sqlalchemy.orm import Mapped, mapped_column


class UUIDMixin:
    """Mixin to automatically inject a UUIDv4 primary key."""

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True, default=uuid.uuid4, index=True
    )


class TimestampMixin:
    """Mixin to inject timezone-aware creation and update audit columns."""

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )


class SoftDeleteMixin:
    """Optional mixin supporting soft deletion auditing for data retention."""

    is_deleted: Mapped[bool] = mapped_column(default=False, nullable=False)
    deleted_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), default=None, nullable=True
    )

    def soft_delete(self) -> None:
        """Triggers flag changes on entity deletion requests."""
        self.is_deleted = True
        self.deleted_at = func.now()

    def restore(self) -> None:
        """Restores soft-deleted entity states."""
        self.is_deleted = False
        self.deleted_at = None
