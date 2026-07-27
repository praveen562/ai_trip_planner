from pydantic import BaseModel, ConfigDict


class PlaceCoordinates(BaseModel):
    latitude: float
    longitude: float


class PlaceResponse(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "xid": "Q243",
                "name": "Tokyo Tower",
                "category": "towers",
                "categories": ["towers", "view_points", "interesting_places"],
                "coordinates": {"latitude": 35.6586, "longitude": 139.7454},
                "image": None,
                "wikipedia": "https://en.wikipedia.org/wiki/Tokyo_Tower",
                "description": "Tokyo Tower is a communications and observation tower.",
                "image_url": "https://images.unsplash.com/photo-tokyo-tower-example",
            }
        }
    )

    xid: str
    name: str
    category: str | None
    categories: list[str]
    coordinates: PlaceCoordinates
    image: str | None
    wikipedia: str | None
    description: str | None
    image_url: str | None = None


class NearbyPlacesResponse(BaseModel):
    destination: str
    radius: int
    count: int
    places: list[PlaceResponse]
