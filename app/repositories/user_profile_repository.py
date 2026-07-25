from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user_profile import UserProfile


class UserProfileRepository:
    """
    Repository for all UserProfile database operations.
    """

    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, profile: UserProfile) -> UserProfile:
        """
        Create a new user profile.
        """
        self.db.add(profile)
        await self.db.commit()
        await self.db.refresh(profile)
        return profile

    async def get_by_user_id(self, user_id: UUID) -> UserProfile | None:
        """
        Get a user profile by owning user ID, excluding soft-deleted records.
        """
        result = await self.db.execute(
            select(UserProfile).where(
                UserProfile.user_id == user_id,
                UserProfile.is_deleted.is_(False),
            )
        )
        return result.scalar_one_or_none()

    async def update(self, profile: UserProfile) -> UserProfile:
        """
        Save changes to an existing user profile.
        """
        await self.db.commit()
        await self.db.refresh(profile)
        return profile
