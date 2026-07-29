"""
Pydantic schemas for the Saved Places (TripPlace) module.
"""

from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class TripPlaceCreate(BaseModel):
    """
    Payload for saving a place (attraction/POI) to a trip.
    """

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "name": "Tokyo Tower",
                "latitude": 35.6586,
                "longitude": 139.7454,
                "kind": "towers",
                "image_url": "https://images.unsplash.com/photo-tokyo-tower-example",
                "address": "4 Chome-2-8 Shibakoen, Minato City, Tokyo",
                "description": "Tokyo Tower is a communications and observation tower.",
                "source": "OpenTripMap",
            }
        }
    )

    name: str = Field(..., min_length=1, max_length=255)
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    kind: str | None = Field(default=None, max_length=255)
    image_url: str | None = None
    address: str | None = None
    description: str | None = None
    source: str = Field(default="OpenTripMap", max_length=50)


class TripPlaceResponse(BaseModel):
    """
    A single saved place as returned by the API.
    """

    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                "trip_id": "3fa85f64-5717-4562-b3fc-2c963f66afa7",
                "name": "Tokyo Tower",
                "latitude": 35.6586,
                "longitude": 139.7454,
                "kind": "towers",
                "image_url": "https://images.unsplash.com/photo-tokyo-tower-example",
                "address": "4 Chome-2-8 Shibakoen, Minato City, Tokyo",
                "description": "Tokyo Tower is a communications and observation tower.",
                "source": "OpenTripMap",
            }
        },
    )

    id: UUID
    trip_id: UUID
    name: str
    latitude: float
    longitude: float
    kind: str | None
    image_url: str | None
    address: str | None
    description: str | None
    source: str


class TripPlaceListResponse(BaseModel):
    """
    A trip's full set of saved places, with a count for convenience
    (computed from the already-fetched list, avoiding a second query
    at the service layer).
    """

    trip_id: UUID
    count: int
    places: list[TripPlaceResponse]
