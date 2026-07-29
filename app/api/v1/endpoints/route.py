from uuid import UUID

from fastapi import APIRouter, Depends, Query, status

from app.api.deps import get_current_user, get_route_service
from app.integrations.osrm_client import OSRMProfile
from app.models.user import User
from app.schemas.route import OptimizeRouteResponse, RouteResponse
from app.services.route_service import RouteService

router = APIRouter()


@router.get(
    "/{trip_id}/route",
    response_model=RouteResponse,
    status_code=status.HTTP_200_OK,
    summary="Generate a route through a trip's saved places",
)
async def get_trip_route(
    trip_id: UUID,
    profile: OSRMProfile = Query(
        default="driving", description="Travel mode: driving, cycling, or walking."
    ),
    current_user: User = Depends(get_current_user),
    service: RouteService = Depends(get_route_service),
):
    """
    Generate a route through a trip's saved places, visited in the
    order they were saved.

    Coordinates come entirely from the trip's persisted saved places
    (see the Saved Places module) -- no manual coordinate input is
    accepted. Requires at least two saved places.
    """
    return await service.get_route(current_user.id, trip_id, profile)


@router.get(
    "/{trip_id}/route/optimize",
    response_model=OptimizeRouteResponse,
    status_code=status.HTTP_200_OK,
    summary="Compute the most efficient visiting order for a trip's saved places",
)
async def optimize_trip_route(
    trip_id: UUID,
    profile: OSRMProfile = Query(
        default="driving", description="Travel mode: driving, cycling, or walking."
    ),
    current_user: User = Depends(get_current_user),
    service: RouteService = Depends(get_route_service),
):
    """
    Compute the most efficient visiting order for a trip's saved
    places (solves the underlying travelling-salesman problem via
    OSRM's /trip service), along with the resulting route's distance,
    duration, and geometry.

    Coordinates come entirely from the trip's persisted saved places
    -- no manual coordinate input is accepted. Requires at least two
    saved places.
    """
    return await service.optimize_route(current_user.id, trip_id, profile)
