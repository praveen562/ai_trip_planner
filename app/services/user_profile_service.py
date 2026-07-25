from uuid import UUID

from app.core.exceptions import ConflictException, NotFoundException
from app.models.user_profile import UserProfile
from app.repositories.user_profile_repository import UserProfileRepository
from app.schemas.user_profile import UserProfileCreate, UserProfileUpdate


class UserProfileService:
    """
    Handles user profile creation, retrieval, and updates.
    """

    def __init__(self, repository: UserProfileRepository):
        self.repository = repository

    async def create_profile(
        self, user_id: UUID, profile_data: UserProfileCreate
    ) -> UserProfile:
        """
        Create a profile for the given user. A user may only have one profile.
        """
        existing_profile = await self.repository.get_by_user_id(user_id)

        if existing_profile is not None:
            raise ConflictException("A profile already exists for this user.")

        profile = UserProfile(
            user_id=user_id,
            **profile_data.model_dump(),
        )

        return await self.repository.create(profile)

    async def get_profile(self, user_id: UUID) -> UserProfile:
        """
        Retrieve the profile belonging to the given user.
        """
        profile = await self.repository.get_by_user_id(user_id)

        if profile is None:
            raise NotFoundException("Profile not found.")

        return profile

    async def update_profile(
        self, user_id: UUID, profile_data: UserProfileUpdate
    ) -> UserProfile:
        """
        Partially update the profile belonging to the given user.
        """
        profile = await self.get_profile(user_id)

        update_fields = profile_data.model_dump(exclude_unset=True)
        for field, value in update_fields.items():
            setattr(profile, field, value)

        return await self.repository.update(profile)
