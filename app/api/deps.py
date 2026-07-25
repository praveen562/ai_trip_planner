from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.exceptions import AuthenticationException
from app.db.session import get_db
from app.models.user import User
from app.repositories.expense_repository import ExpenseRepository
from app.repositories.trip_repository import TripRepository
from app.repositories.user_profile_repository import UserProfileRepository
from app.repositories.user_repository import UserRepository
from app.services.auth_service import AuthService
from app.services.expense_service import ExpenseService
from app.services.trip_service import TripService
from app.services.user_profile_service import UserProfileService

# Use settings.API_V1_STR to dynamically format prefix
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/token")


def get_user_repository(
    db: AsyncSession = Depends(get_db),
) -> UserRepository:
    """
    Return a UserRepository instance.
    """
    return UserRepository(db)


def get_auth_service(
    repository: UserRepository = Depends(get_user_repository),
) -> AuthService:
    """
    Return an AuthService instance.
    """
    return AuthService(repository)


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    service: AuthService = Depends(get_auth_service),
) -> User:
    """
    Resolve JWT token from authorization header and return current user.
    """
    try:
        return await service.get_current_user(token)
    except ValueError as exc:
        raise AuthenticationException(message=str(exc)) from exc


def get_trip_repository(
    db: AsyncSession = Depends(get_db),
) -> TripRepository:
    """
    Return a TripRepository instance.
    """
    return TripRepository(db)


def get_trip_service(
    repository: TripRepository = Depends(get_trip_repository),
) -> TripService:
    """
    Return a TripService instance.
    """
    return TripService(repository)


def get_user_profile_repository(
    db: AsyncSession = Depends(get_db),
) -> UserProfileRepository:
    """
    Return a UserProfileRepository instance.
    """
    return UserProfileRepository(db)


def get_user_profile_service(
    repository: UserProfileRepository = Depends(get_user_profile_repository),
) -> UserProfileService:
    """
    Return a UserProfileService instance.
    """
    return UserProfileService(repository)


def get_expense_repository(
    db: AsyncSession = Depends(get_db),
) -> ExpenseRepository:
    """
    Return an ExpenseRepository instance.
    """
    return ExpenseRepository(db)


def get_expense_service(
    repository: ExpenseRepository = Depends(get_expense_repository),
    trip_repository: TripRepository = Depends(get_trip_repository),
    profile_repository: UserProfileRepository = Depends(get_user_profile_repository),
) -> ExpenseService:
    """
    Return an ExpenseService instance.
    """
    return ExpenseService(repository, trip_repository, profile_repository)
