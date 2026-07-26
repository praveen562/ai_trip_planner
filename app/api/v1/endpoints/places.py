from uuid import UUID

from fastapi import APIRouter, Depends, Query, status

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
    category: str | None = Query(
        default=None,
        description=(
            "Filter results to a single OpenTripMap category tag "
            "(e.g. 'museums', 'view_points', 'temples')."
        ),
        examples=["museums", "view_points"],
    ),
    radius: int = Query(
        default=5000,
        gt=0,
        le=50000,
        description="Search radius in meters around the trip's destination.",
        examples=[3000, 5000, 10000],
    ),
    limit: int = Query(
        default=20,
        ge=1,
        le=50,
        description="Maximum number of places to return (1-50).",
        examples=[15, 20, 50],
    ),
    current_user: User = Depends(get_current_user),
    service: PlacesService = Depends(get_places_service),
):
    """
    Get nearby attractions for a trip owned by the currently
    logged-in user. Low-quality and duplicate results are filtered
    out, and tourist-relevant places are sorted first.
    """
    return await service.get_trip_places(
        current_user.id, trip_id, category=category, radius=radius, limit=limit
    )


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
    Get full details for a single place by its OpenTripMap XID,
    including description, preview image, and Wikipedia link when
    available.
    """
    return await service.get_place_details(xid)
