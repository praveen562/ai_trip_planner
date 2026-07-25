from uuid import UUID

from jose import JWTError

from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
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

    async def refresh_access_token(self, refresh_token: str) -> TokenResponse:
        """
        Validate refresh token and issue new access & refresh token pair.
        """
        try:
            payload = decode_token(refresh_token)
            if payload.get("type") != "refresh":
                raise ValueError("Invalid token type.")
            user_id_str = payload.get("sub")
            if not user_id_str:
                raise ValueError("Token payload missing subject.")
        except JWTError as exc:
            raise ValueError("Invalid or expired refresh token.") from exc

        try:
            user_id = UUID(user_id_str)
        except ValueError as exc:
            raise ValueError("Invalid user ID in token.") from exc

        user = await self.repository.get_by_id(user_id)
        if not user:
            raise ValueError("User not found.")
        if not user.is_active:
            raise ValueError("User is inactive.")

        access_token = create_access_token(str(user.id))
        new_refresh_token = create_refresh_token(str(user.id))

        return TokenResponse(
            access_token=access_token,
            refresh_token=new_refresh_token,
        )

    async def get_current_user(self, token: str) -> User:
        """
        Retrieve user identified by the given access token.
        """
        try:
            payload = decode_token(token)
            if payload.get("type") != "access":
                raise ValueError("Invalid token type.")
            user_id_str = payload.get("sub")
            if not user_id_str:
                raise ValueError("Token payload missing subject.")
        except JWTError as exc:
            raise ValueError("Invalid or expired access token.") from exc

        try:
            user_id = UUID(user_id_str)
        except ValueError as exc:
            raise ValueError("Invalid user ID in token.") from exc

        user = await self.repository.get_by_id(user_id)
        if not user:
            raise ValueError("User not found.")
        if not user.is_active:
            raise ValueError("User is inactive.")

        return user
