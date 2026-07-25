from datetime import date
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import TravelStyle, TripStatus


class TripCreate(BaseModel):
    title: str = Field(..., max_length=150)
    source_location: str
    destination_location: str
    start_date: date
    end_date: date
    budget: Decimal
    travel_style: TravelStyle = TravelStyle.BALANCED
    notes: str | None = None


class TripUpdate(BaseModel):
    title: str | None = None
    source_location: str | None = None
    destination_location: str | None = None
    start_date: date | None = None
    end_date: date | None = None
    budget: Decimal | None = None
    notes: str | None = None
    status: TripStatus | None = None


class TripResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    title: str
    source_location: str
    destination_location: str
    start_date: date
    end_date: date
    budget: Decimal
    travel_style: TravelStyle
    status: TripStatus
