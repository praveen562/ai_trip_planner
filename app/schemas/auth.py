from pydantic import BaseModel, EmailStr, Field


class LoginRequest(BaseModel):
    """User login request."""

    email: EmailStr
    password: str = Field(..., min_length=8)


class TokenResponse(BaseModel):
    """JWT response."""

    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RefreshTokenRequest(BaseModel):
    """Refresh JWT."""

    refresh_token: str
