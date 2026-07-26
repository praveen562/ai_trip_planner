from uuid import UUID

from fastapi import APIRouter, Depends, status

from app.api.deps import get_current_user, get_weather_service
from app.models.user import User
from app.schemas.weather import ForecastSummary, WeatherForecast, WeatherResponse
from app.services.weather_service import WeatherService

router = APIRouter()


@router.get(
    "/{trip_id}/weather",
    response_model=WeatherForecast,
    status_code=status.HTTP_200_OK,
)
async def get_trip_weather(
    trip_id: UUID,
    current_user: User = Depends(get_current_user),
    service: WeatherService = Depends(get_weather_service),
):
    """
    Get the complete weather forecast for a trip owned by the
    currently logged-in user.
    """
    return await service.get_trip_weather(current_user.id, trip_id)


@router.get(
    "/{trip_id}/weather/today",
    response_model=WeatherResponse,
    status_code=status.HTTP_200_OK,
)
async def get_today_weather(
    trip_id: UUID,
    current_user: User = Depends(get_current_user),
    service: WeatherService = Depends(get_weather_service),
):
    """
    Get today's weather for a trip owned by the currently logged-in user.
    """
    return await service.get_today_weather(current_user.id, trip_id)


@router.get(
    "/{trip_id}/weather/summary",
    response_model=ForecastSummary,
    status_code=status.HTTP_200_OK,
)
async def get_weather_summary(
    trip_id: UUID,
    current_user: User = Depends(get_current_user),
    service: WeatherService = Depends(get_weather_service),
):
    """
    Get a simplified weather forecast summary for a trip owned by the
    currently logged-in user.
    """
    return await service.get_weather_summary(current_user.id, trip_id)
