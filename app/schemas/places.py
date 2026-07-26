from pydantic import BaseModel


class PlaceCoordinates(BaseModel):
    latitude: float
    longitude: float


class PlaceResponse(BaseModel):
    xid: str
    name: str
    category: str | None
    categories: list[str]
    coordinates: PlaceCoordinates
    image: str | None
    wikipedia: str | None
    description: str | None


class NearbyPlacesResponse(BaseModel):
    destination: str
    radius: int
    count: int
    places: list[PlaceResponse]
