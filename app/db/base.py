from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    """Base declarative class for all SQLAlchemy ORM models.

    All entity models inherit from this class so their metadata is
    registered automatically under Base.metadata for Alembic discovery.
    """

    pass


# Import all model schemas so they register on Base.metadata
from app.models import *  # noqa: F401, F403, E402
