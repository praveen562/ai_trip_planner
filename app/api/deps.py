from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.repositories.user_repository import UserRepository
from app.services.auth_service import AuthService


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
