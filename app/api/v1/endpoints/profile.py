from fastapi import APIRouter, Depends, status

from app.api.deps import get_current_user, get_user_profile_service
from app.models.user import User
from app.schemas.user_profile import (
    UserProfileCreate,
    UserProfileResponse,
    UserProfileUpdate,
)
from app.services.user_profile_service import UserProfileService

router = APIRouter()


@router.post(
    "",
    response_model=UserProfileResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_profile(
    profile: UserProfileCreate,
    current_user: User = Depends(get_current_user),
    service: UserProfileService = Depends(get_user_profile_service),
):
    """
    Create a profile for the currently logged-in user.
    """
    return await service.create_profile(current_user.id, profile)


@router.get(
    "",
    response_model=UserProfileResponse,
    status_code=status.HTTP_200_OK,
)
async def get_profile(
    current_user: User = Depends(get_current_user),
    service: UserProfileService = Depends(get_user_profile_service),
):
    """
    Get the profile of the currently logged-in user.
    """
    return await service.get_profile(current_user.id)


@router.patch(
    "",
    response_model=UserProfileResponse,
    status_code=status.HTTP_200_OK,
)
async def update_profile(
    profile: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    service: UserProfileService = Depends(get_user_profile_service),
):
    """
    Partially update the profile of the currently logged-in user.
    """
    return await service.update_profile(current_user.id, profile)
