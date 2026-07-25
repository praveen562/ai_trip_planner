from datetime import date, datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import Gender


class UserProfileCreate(BaseModel):
    full_name: str = Field(..., min_length=1, max_length=150)
    phone_number: str | None = Field(default=None, max_length=20)
    date_of_birth: date | None = None
    gender: Gender | None = None
    nationality: str | None = Field(default=None, max_length=100)
    preferred_language: str | None = Field(default="English", max_length=50)
    preferred_currency: str | None = Field(default="INR", max_length=10)
    emergency_contact_name: str | None = Field(default=None, max_length=150)
    emergency_contact_phone: str | None = Field(default=None, max_length=20)
    dietary_preferences: str | None = None
    accessibility_requirements: str | None = None
    bio: str | None = Field(default=None, max_length=500)
    profile_image_url: str | None = Field(default=None, max_length=500)


class UserProfileUpdate(BaseModel):
    full_name: str | None = Field(default=None, min_length=1, max_length=150)
    phone_number: str | None = Field(default=None, max_length=20)
    date_of_birth: date | None = None
    gender: Gender | None = None
    nationality: str | None = Field(default=None, max_length=100)
    preferred_language: str | None = Field(default=None, max_length=50)
    preferred_currency: str | None = Field(default=None, max_length=10)
    emergency_contact_name: str | None = Field(default=None, max_length=150)
    emergency_contact_phone: str | None = Field(default=None, max_length=20)
    dietary_preferences: str | None = None
    accessibility_requirements: str | None = None
    bio: str | None = Field(default=None, max_length=500)
    profile_image_url: str | None = Field(default=None, max_length=500)


class UserProfileResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    full_name: str
    phone_number: str | None
    date_of_birth: date | None
    gender: Gender | None
    nationality: str | None
    preferred_language: str | None
    preferred_currency: str | None
    emergency_contact_name: str | None
    emergency_contact_phone: str | None
    dietary_preferences: str | None
    accessibility_requirements: str | None
    bio: str | None
    profile_image_url: str | None
    created_at: datetime
    updated_at: datetime
