from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.core.config import settings

# Create asynchronous engine for PostgreSQL connection pooling
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=False,  # Set to True to log raw SQL queries
    future=True,
    pool_size=20,
    max_overflow=10,
)

# Async session factory
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False,
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Dependency injection generator to yield session instances per API request."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
