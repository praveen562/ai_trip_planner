from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.exceptions import AuthenticationException
from app.db.session import get_db
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.services.auth_service import AuthService

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
