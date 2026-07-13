from collections.abc import Sequence
from typing import Any, Generic, TypeVar

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.base import Base

ModelType = TypeVar("ModelType", bound=Base)


class BaseRepository(Generic[ModelType]):
    """
    Generic base repository defining
      standard CRUD query patterns for ORM entities.
    """

    def __init__(self, model: type[ModelType], db: AsyncSession):
        self.model = model
        self.db = db

    async def get(self, id: Any) -> ModelType | None:
        """Fetches a single entity matching the primary key id."""
        return await self.db.get(self.model, id)

    async def get_all(self, skip: int = 0, limit: int = 100) -> Sequence[ModelType]:
        """Fetches multiple records with pagination."""
        query = select(self.model).offset(skip).limit(limit)
        result = await self.db.execute(query)
        return result.scalars().all()

    async def create(self, obj_data: dict[str, Any]) -> ModelType:
        """Saves a new model object to the database."""
        db_obj = self.model(**obj_data)
        self.db.add(db_obj)
        await self.db.commit()
        await self.db.refresh(db_obj)
        return db_obj

    async def update(self, db_obj: ModelType, obj_data: dict[str, Any]) -> ModelType:
        """Updates and flushes attribute changes to an existing database object."""
        for field, value in obj_data.items():
            setattr(db_obj, field, value)
        self.db.add(db_obj)
        await self.db.commit()
        await self.db.refresh(db_obj)
        return db_obj

    async def delete(self, db_obj: ModelType) -> None:
        """Deletes a record from the database transaction."""
        await self.db.delete(db_obj)
        await self.db.commit()

    async def save(self, db_obj: ModelType) -> ModelType:
        """Persists a manually constructed model object to the session transaction."""
        self.db.add(db_obj)
        await self.db.commit()
        await self.db.refresh(db_obj)
        return db_obj

    async def commit(self) -> None:
        """Manually commits outstanding transaction units."""
        await self.db.commit()

    async def rollback(self) -> None:
        """Rolls back the current transaction state."""
        await self.db.rollback()

    async def refresh(self, db_obj: ModelType) -> None:
        """Refreshes the entity representation state from database."""
        await self.db.refresh(db_obj)
