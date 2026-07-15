from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.models.enums import UserRole


class UserCreate(BaseModel):
    """Schema for user registration."""

    full_name: str = Field(..., min_length=3, max_length=150)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)


class UserUpdate(BaseModel):
    """Schema for updating user information."""

    full_name: str | None = Field(default=None, min_length=3, max_length=150)
    email: EmailStr | None = None


class UserResponse(BaseModel):
    """Schema returned to clients."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    full_name: str
    email: EmailStr
    role: UserRole
    is_active: bool
    is_verified: bool
