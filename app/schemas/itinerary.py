from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import TravelStyle


class ItineraryGenerateRequest(BaseModel):
    travel_style: TravelStyle | None = None
    interests: list[str] = Field(default_factory=list)
    budget_preference: str | None = Field(default=None, max_length=100)
    pace: str | None = Field(default=None, max_length=50)
    additional_notes: str | None = None


class ItineraryUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=150)
    ai_response: str | None = None
    total_days: int | None = Field(default=None, ge=1)
    is_regenerated: bool | None = None


class ItineraryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    trip_id: UUID
    title: str
    ai_prompt: str
    ai_response: str
    total_days: int
    is_regenerated: bool
    created_at: datetime
    updated_at: datetime
