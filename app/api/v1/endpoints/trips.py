from uuid import UUID

from fastapi import APIRouter, Depends, status

from app.api.deps import get_current_user, get_trip_service
from app.models.user import User
from app.schemas.trip import TripCreate, TripResponse, TripUpdate
from app.services.trip_service import TripService

router = APIRouter()


@router.post(
    "",
    response_model=TripResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_trip(
    trip: TripCreate,
    current_user: User = Depends(get_current_user),
    service: TripService = Depends(get_trip_service),
):
    """
    Create a new trip for the currently logged-in user.
    """
    return await service.create_trip(current_user.id, trip)


@router.get(
    "",
    response_model=list[TripResponse],
    status_code=status.HTTP_200_OK,
)
async def list_trips(
    current_user: User = Depends(get_current_user),
    service: TripService = Depends(get_trip_service),
):
    """
    List all trips belonging to the currently logged-in user.
    """
    return await service.list_trips(current_user.id)


@router.get(
    "/{trip_id}",
    response_model=TripResponse,
    status_code=status.HTTP_200_OK,
)
async def get_trip(
    trip_id: UUID,
    current_user: User = Depends(get_current_user),
    service: TripService = Depends(get_trip_service),
):
    """
    Get a single trip owned by the currently logged-in user.
    """
    return await service.get_trip(current_user.id, trip_id)


@router.patch(
    "/{trip_id}",
    response_model=TripResponse,
    status_code=status.HTTP_200_OK,
)
async def update_trip(
    trip_id: UUID,
    trip: TripUpdate,
    current_user: User = Depends(get_current_user),
    service: TripService = Depends(get_trip_service),
):
    """
    Update a trip owned by the currently logged-in user.
    """
    return await service.update_trip(current_user.id, trip_id, trip)


@router.delete(
    "/{trip_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_trip(
    trip_id: UUID,
    current_user: User = Depends(get_current_user),
    service: TripService = Depends(get_trip_service),
):
    """
    Soft-delete a trip owned by the currently logged-in user.
    """
    await service.delete_trip(current_user.id, trip_id)
