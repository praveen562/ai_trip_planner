from app.core.security import (
    create_access_token,
    create_refresh_token,
    hash_password,
    verify_password,
)

from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.auth import TokenResponse
from app.schemas.user import UserCreate


class AuthService:
    """
    Handles user authentication and registration.
    """

    def __init__(self, repository: UserRepository):
        self.repository = repository

    async def register(self, user_data: UserCreate) -> User:
        """
        Register a new user.
        """

        existing_user = await self.repository.get_by_email(user_data.email)

        if existing_user:
            raise ValueError("Email already registered.")

        user = User(
            full_name=user_data.full_name,
            email=user_data.email,
            password_hash=hash_password(user_data.password),
        )

        return await self.repository.create(user)

    async def login(
        self,
        email: str,
        password: str,
    ) -> TokenResponse:
        """
        Authenticate a user.
        """

        user = await self.repository.get_by_email(email)

        if user is None:
            raise ValueError("Invalid email or password.")

        if not verify_password(password, user.password_hash):
            raise ValueError("Invalid email or password.")

        access_token = create_access_token(str(user.id))

        refresh_token = create_refresh_token(str(user.id))

        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
        )
