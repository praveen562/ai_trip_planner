from datetime import date as date_type
from datetime import datetime
from typing import Any
from uuid import UUID

from app.core.exceptions import (
    AuthorizationException,
    ExternalAPIException,
    NotFoundException,
)
from app.integrations.weather_client import WeatherClient
from app.models.trip import Trip
from app.repositories.trip_repository import TripRepository
from app.schemas.weather import (
    DailyWeather,
    ForecastSummary,
    WeatherForecast,
    WeatherResponse,
)

RAINY_DAY_PROBABILITY_THRESHOLD = 50.0


class WeatherService:
    """
    Handles weather forecast retrieval for a trip's destination.
    Ownership is enforced identically to ExpenseService: every
    operation verifies the trip belongs to the requesting user before
    calling out to the weather provider.
    """

    def __init__(
        self,
        trip_repository: TripRepository,
        weather_client: WeatherClient,
    ):
        self.trip_repository = trip_repository
        self.weather_client = weather_client

    async def _get_owned_trip(self, user_id: UUID, trip_id: UUID) -> Trip:
        """
        Retrieve a trip, enforcing ownership.
        """
        trip = await self.trip_repository.get_by_id(trip_id)

        if trip is None:
            raise NotFoundException("Trip not found.")

        if trip.user_id != user_id:
            raise AuthorizationException("You do not have access to this trip.")

        return trip

    @staticmethod
    def _parse_astro_time(day_date: date_type, time_str: str | None) -> datetime | None:
        """
        Combine a WeatherAPI-style 12-hour time string (e.g. "06:15 AM")
        with the forecast day's date into a full datetime.
        """
        if not time_str:
            return None
        try:
            parsed_time = datetime.strptime(time_str, "%I:%M %p").time()
        except ValueError:
            return None
        return datetime.combine(day_date, parsed_time)

    @staticmethod
    def _parse_daily_forecasts(raw: dict[str, Any]) -> tuple[str, list[DailyWeather]]:
        """
        Parse a WeatherAPI.com forecast.json payload into a location
        name and one DailyWeather entry per forecast day.
        """
        location_name = raw.get("location", {}).get("name", "")
        forecast_days = raw.get("forecast", {}).get("forecastday", [])

        daily_forecasts: list[DailyWeather] = []
        for forecast_day in forecast_days:
            day_date = date_type.fromisoformat(forecast_day["date"])
            day = forecast_day.get("day", {})
            astro = forecast_day.get("astro", {})
            condition = day.get("condition", {})

            daily_forecasts.append(
                DailyWeather(
                    date=day_date,
                    temperature_min=day.get("mintemp_c", 0.0),
                    temperature_max=day.get("maxtemp_c", 0.0),
                    # WeatherAPI.com has no daily "feels like" field;
                    # avgtemp_c is used as the closest available proxy.
                    feels_like=day.get("avgtemp_c", 0.0),
                    humidity=round(day.get("avghumidity", 0.0)),
                    wind_speed=day.get("maxwind_kph", 0.0),
                    weather=condition.get("text", "Unknown"),
                    weather_description=condition.get("text", ""),
                    icon=condition.get("icon", ""),
                    rain_probability=float(day.get("daily_chance_of_rain", 0.0)),
                    sunrise=WeatherService._parse_astro_time(
                        day_date, astro.get("sunrise")
                    ),
                    sunset=WeatherService._parse_astro_time(
                        day_date, astro.get("sunset")
                    ),
                )
            )

        return location_name, daily_forecasts

    async def _fetch_daily_forecasts(
        self, trip: Trip
    ) -> tuple[str, list[DailyWeather]]:
        """
        Call the weather client for a trip's destination and parse
        the response into a location name and per-day forecasts.
        """
        raw = await self.weather_client.get_forecast(trip.destination_location)
        return self._parse_daily_forecasts(raw)

    async def get_forecast(self, user_id: UUID, trip_id: UUID) -> list[DailyWeather]:
        """
        Retrieve the parsed daily forecast list for a trip owned by
        the given user.
        """
        trip = await self._get_owned_trip(user_id, trip_id)
        _, days = await self._fetch_daily_forecasts(trip)
        return days

    async def get_trip_weather(self, user_id: UUID, trip_id: UUID) -> WeatherForecast:
        """
        Retrieve the complete weather forecast for a trip owned by
        the given user.
        """
        trip = await self._get_owned_trip(user_id, trip_id)
        location_name, days = await self._fetch_daily_forecasts(trip)
        return WeatherForecast(
            destination=location_name or trip.destination_location, days=days
        )

    async def get_today_weather(self, user_id: UUID, trip_id: UUID) -> WeatherResponse:
        """
        Retrieve only today's weather for a trip owned by the given
        user.
        """
        trip = await self._get_owned_trip(user_id, trip_id)
        location_name, days = await self._fetch_daily_forecasts(trip)

        if not days:
            raise ExternalAPIException(
                "No weather data available for this destination."
            )

        return WeatherResponse(
            destination=location_name or trip.destination_location, today=days[0]
        )

    async def get_weather_summary(
        self, user_id: UUID, trip_id: UUID
    ) -> ForecastSummary:
        """
        Retrieve a simplified forecast summary (best/worst day,
        average temperature, rainy day count) for a trip owned by
        the given user.
        """
        trip = await self._get_owned_trip(user_id, trip_id)
        location_name, days = await self._fetch_daily_forecasts(trip)

        if not days:
            raise ExternalAPIException(
                "No weather data available for this destination."
            )

        average_temperature = sum(
            (day.temperature_min + day.temperature_max) / 2 for day in days
        ) / len(days)
        rainy_days = sum(
            1 for day in days if day.rain_probability >= RAINY_DAY_PROBABILITY_THRESHOLD
        )

        best_day = min(days, key=lambda day: day.rain_probability)
        worst_day = max(days, key=lambda day: day.rain_probability)

        return ForecastSummary(
            destination=location_name or trip.destination_location,
            best_day=f"Day {days.index(best_day) + 1}",
            worst_day=f"Day {days.index(worst_day) + 1}",
            average_temperature=round(average_temperature, 1),
            rainy_days=rainy_days,
        )
