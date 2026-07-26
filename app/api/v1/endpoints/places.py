from uuid import UUID

from fastapi import APIRouter, Depends, status

from app.api.deps import get_current_user, get_places_service
from app.models.user import User
from app.schemas.places import NearbyPlacesResponse, PlaceResponse
from app.services.places_service import PlacesService

router = APIRouter()


@router.get(
    "/trips/{trip_id}/places",
    response_model=NearbyPlacesResponse,
    status_code=status.HTTP_200_OK,
)
async def get_trip_places(
    trip_id: UUID,
    current_user: User = Depends(get_current_user),
    service: PlacesService = Depends(get_places_service),
):
    """
    Get nearby attractions for a trip owned by the currently
    logged-in user.
    """
    return await service.get_trip_places(current_user.id, trip_id)


@router.get(
    "/places/{xid}",
    response_model=PlaceResponse,
    status_code=status.HTTP_200_OK,
)
async def get_place_details(
    xid: str,
    current_user: User = Depends(get_current_user),
    service: PlacesService = Depends(get_places_service),
):
    """
    Get full details for a single place by its OpenTripMap XID.
    """
    return await service.get_place_details(xid)
