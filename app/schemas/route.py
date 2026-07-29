"""
Pydantic schemas for the Route Optimization (OSRM) module.
"""

from typing import Any
from uuid import UUID

from pydantic import BaseModel, Field


class Coordinate(BaseModel):
    """
    A single (latitude, longitude) point. Used internally when
    composing responses; not accepted as request input -- coordinates
    always come from a trip's persisted saved places.
    """

    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)


class RouteSummary(BaseModel):
    """
    Top-line totals for a computed route.
    """

    profile: str
    total_distance_km: float
    total_duration_minutes: float


class RouteLeg(BaseModel):
    """
    One leg of a route: the segment between two consecutive saved
    places, in visiting order.
    """

    from_place: str
    to_place: str
    distance_km: float
    duration_minutes: float


class RouteResponse(BaseModel):
    """
    A route through a trip's saved places, visited in the order they
    were saved.
    """

    trip_id: UUID
    summary: RouteSummary
    legs: list[RouteLeg]
    geometry: dict[str, Any]


class OptimizedWaypoint(BaseModel):
    """
    A single saved place positioned in OSRM's optimized visiting
    order.
    """

    place_id: UUID
    name: str
    latitude: float
    longitude: float
    order: int


class OptimizeRouteResponse(BaseModel):
    """
    The most efficient visiting order for a trip's saved places,
    along with the resulting route's totals and geometry.
    """

    trip_id: UUID
    summary: RouteSummary
    waypoints: list[OptimizedWaypoint]
    geometry: dict[str, Any]
