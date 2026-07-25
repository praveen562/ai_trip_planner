from sqlalchemy.ext.asyncio import AsyncEngine

from app.db.base import Base
from app.db.session import engine


async def init_db(engine: AsyncEngine = engine) -> None:
    """Create all database tables."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)