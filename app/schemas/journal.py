from datetime import date
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import Mood, Weather


class JournalCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=150)
    description: str = Field(..., min_length=1)
    location: str | None = Field(default=None, max_length=150)
    mood: Mood | None = None
    weather: Weather | None = None
    journal_date: date


class JournalUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=150)
    description: str | None = Field(default=None, min_length=1)
    location: str | None = Field(default=None, max_length=150)
    mood: Mood | None = None
    weather: Weather | None = None
    journal_date: date | None = None


class JournalResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    trip_id: UUID
    title: str
    description: str
    location: str | None
    mood: Mood | None
    weather: Weather | None
    journal_date: date
