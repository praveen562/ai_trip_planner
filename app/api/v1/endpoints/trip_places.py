from uuid import UUID

from fastapi import APIRouter, Depends, status

from app.api.deps import get_current_user, get_trip_place_service
from app.models.user import User
from app.schemas.trip_place import (
    TripPlaceCreate,
    TripPlaceListResponse,
    TripPlaceResponse,
)
from app.services.trip_place_service import TripPlaceService

router = APIRouter()


@router.post(
    "/trips/{trip_id}/saved-places",
    response_model=TripPlaceResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Save a place to a trip",
)
async def create_trip_place(
    trip_id: UUID,
    place: TripPlaceCreate,
    current_user: User = Depends(get_current_user),
    service: TripPlaceService = Depends(get_trip_place_service),
):
    """
    Save a place (attraction/POI) to a trip owned by the currently
    logged-in user. Rejects duplicates: a place at the same
    coordinates cannot be saved twice to the same trip.
    """
    return await service.create_place(current_user.id, trip_id, place)


@router.get(
    "/trips/{trip_id}/saved-places",
    response_model=TripPlaceListResponse,
    status_code=status.HTTP_200_OK,
    summary="List all places saved to a trip",
)
async def list_trip_places(
    trip_id: UUID,
    current_user: User = Depends(get_current_user),
    service: TripPlaceService = Depends(get_trip_place_service),
):
    """
    List all places saved to a trip owned by the currently
    logged-in user.

    This is distinct from `GET /trips/{trip_id}/places`, which
    performs a live OpenTripMap nearby-attractions search. This
    endpoint instead returns the trip's own persisted, user-curated
    saved places.
    """
    return await service.list_places(current_user.id, trip_id)


@router.delete(
    "/saved-places/{place_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Remove a saved place from a trip",
)
async def delete_trip_place(
    place_id: UUID,
    current_user: User = Depends(get_current_user),
    service: TripPlaceService = Depends(get_trip_place_service),
):
    """
    Soft-delete a saved place owned by the currently logged-in user
    (via its trip).
    """
    await service.delete_place(current_user.id, place_id)
