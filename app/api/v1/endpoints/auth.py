from fastapi import APIRouter, Depends, HTTPException, status

from app.api.deps import get_auth_service, get_current_user
from app.models.user import User
from app.schemas.auth import LoginRequest, RefreshTokenRequest, TokenResponse
from app.schemas.user import UserCreate, UserResponse
from app.services.auth_service import AuthService
from fastapi.security import OAuth2PasswordRequestForm
router = APIRouter()


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
async def register(
    user: UserCreate,
    service: AuthService = Depends(get_auth_service),
):
    """
    Register a new user.
    """
    try:
        return await service.register(user)
    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        ) from exc


@router.post(
    "/login",
    response_model=TokenResponse,
    status_code=status.HTTP_200_OK,
)
async def login(
    credentials: LoginRequest,
    service: AuthService = Depends(get_auth_service),
):
    """
    Log in a user and return access/refresh tokens.
    """
    try:
        return await service.login(credentials.email, credentials.password)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(exc),
        ) from exc

@router.post(
    "/token",
    response_model=TokenResponse,
    status_code=status.HTTP_200_OK,
)
async def token_login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    service: AuthService = Depends(get_auth_service),
):
    """
    OAuth2-compatible login endpoint for Swagger UI.
    Uses the email in the username field.
    """
    try:
        return await service.login(
            form_data.username,  # Email goes here
            form_data.password,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(exc),
        ) from exc

@router.post(
    "/refresh",
    response_model=TokenResponse,
    status_code=status.HTTP_200_OK,
)
async def refresh(
    body: RefreshTokenRequest,
    service: AuthService = Depends(get_auth_service),
):
    """
    Refresh JWT access tokens.
    """
    try:
        return await service.refresh_access_token(body.refresh_token)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(exc),
        ) from exc


@router.get(
    "/me",
    response_model=UserResponse,
    status_code=status.HTTP_200_OK,
)
async def me(
    current_user: User = Depends(get_current_user),
):
    """
    Get the profile of the currently logged-in user.
    """
    return current_user
