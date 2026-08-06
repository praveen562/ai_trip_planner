from uuid import UUID

from fastapi import APIRouter, Depends, status

from app.api.deps import get_current_user, get_itinerary_service
from app.models.user import User
from app.schemas.itinerary import ItineraryGenerateRequest, ItineraryResponse
from app.services.itinerary_service import ItineraryService

router = APIRouter()


@router.post(
    "/trips/{trip_id}/itinerary/generate",
    response_model=ItineraryResponse,
    status_code=status.HTTP_201_CREATED,
)
async def generate_itinerary(
    trip_id: UUID,
    request_data: ItineraryGenerateRequest,
    current_user: User = Depends(get_current_user),
    service: ItineraryService = Depends(get_itinerary_service),
):
    """
    Generate an AI-powered itinerary for a trip owned by the currently
    logged-in user. A trip may only have one active itinerary; use
    the regenerate endpoint to update an existing one.
    """
    return await service.generate_itinerary(current_user.id, trip_id, request_data)


@router.post(
    "/itinerary/{itinerary_id}/regenerate",
    response_model=ItineraryResponse,
    status_code=status.HTTP_200_OK,
)
async def regenerate_itinerary(
    itinerary_id: UUID,
    request_data: ItineraryGenerateRequest,
    current_user: User = Depends(get_current_user),
    service: ItineraryService = Depends(get_itinerary_service),
):
    """
    Regenerate an existing itinerary owned by the currently logged-in
    user (via its trip). Updates the itinerary in place.
    """
    return await service.regenerate_itinerary(
        current_user.id, itinerary_id, request_data
    )


@router.get(
    "/trips/{trip_id}/itinerary",
    response_model=ItineraryResponse,
    status_code=status.HTTP_200_OK,
)
async def get_trip_itinerary(
    trip_id: UUID,
    current_user: User = Depends(get_current_user),
    service: ItineraryService = Depends(get_itinerary_service),
):
    """
    Get the active itinerary for a trip owned by the currently
    logged-in user. 404s if the trip has no itinerary yet.
    """
    return await service.get_itinerary_for_trip(current_user.id, trip_id)


@router.get(
    "/itinerary/{itinerary_id}",
    response_model=ItineraryResponse,
    status_code=status.HTTP_200_OK,
)
async def get_itinerary(
    itinerary_id: UUID,
    current_user: User = Depends(get_current_user),
    service: ItineraryService = Depends(get_itinerary_service),
):
    """
    Get a single itinerary owned by the currently logged-in user (via its trip).
    """
    return await service.get_itinerary(current_user.id, itinerary_id)


@router.delete(
    "/itinerary/{itinerary_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_itinerary(
    itinerary_id: UUID,
    current_user: User = Depends(get_current_user),
    service: ItineraryService = Depends(get_itinerary_service),
):
    """
    Soft-delete an itinerary owned by the currently logged-in user (via its trip).
    """
    await service.delete_itinerary(current_user.id, itinerary_id)
