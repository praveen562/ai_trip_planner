from pydantic import BaseModel


class PlaceCoordinates(BaseModel):
    latitude: float
    longitude: float


class PlaceResponse(BaseModel):
    xid: str
    name: str
    category: str | None
    coordinates: PlaceCoordinates
    image: str | None
    wikipedia: str | None
    description: str | None


class NearbyPlacesResponse(BaseModel):
    destination: str
    places: list[PlaceResponse]
