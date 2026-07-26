from collections import defaultdict
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
    def _parse_daily_forecasts(raw: dict[str, Any]) -> list[DailyWeather]:
        """
        Group the provider's 3-hour interval forecast entries into
        one DailyWeather summary per calendar day.
        """
        city_info = raw.get("city", {})
        sunrise_ts = city_info.get("sunrise")
        sunset_ts = city_info.get("sunset")
        sunrise = datetime.utcfromtimestamp(sunrise_ts) if sunrise_ts else None
        sunset = datetime.utcfromtimestamp(sunset_ts) if sunset_ts else None

        grouped: dict[date_type, list[dict[str, Any]]] = defaultdict(list)
        for entry in raw.get("list", []):
            entry_dt = datetime.utcfromtimestamp(entry["dt"])
            grouped[entry_dt.date()].append(entry)

        daily_forecasts: list[DailyWeather] = []
        for day, entries in sorted(grouped.items()):
            temps = [entry["main"]["temp"] for entry in entries]
            feels_like_values = [entry["main"]["feels_like"] for entry in entries]
            humidity_values = [entry["main"]["humidity"] for entry in entries]
            wind_speeds = [entry.get("wind", {}).get("speed", 0.0) for entry in entries]
            rain_probabilities = [entry.get("pop", 0.0) for entry in entries]

            # Use the entry closest to midday as the day's headline condition.
            representative = min(
                entries,
                key=lambda entry: abs(datetime.utcfromtimestamp(entry["dt"]).hour - 12),
            )
            weather_info = representative.get("weather", [{}])[0]

            daily_forecasts.append(
                DailyWeather(
                    date=day,
                    temperature_min=min(temps),
                    temperature_max=max(temps),
                    feels_like=sum(feels_like_values) / len(feels_like_values),
                    humidity=round(sum(humidity_values) / len(humidity_values)),
                    wind_speed=sum(wind_speeds) / len(wind_speeds),
                    weather=weather_info.get("main", "Unknown"),
                    weather_description=weather_info.get("description", ""),
                    icon=weather_info.get("icon", ""),
                    rain_probability=round(max(rain_probabilities) * 100, 1),
                    sunrise=sunrise,
                    sunset=sunset,
                )
            )

        return daily_forecasts

    async def _fetch_daily_forecasts(self, trip: Trip) -> list[DailyWeather]:
        """
        Call the weather client for a trip's destination and parse
        the response into per-day forecasts.
        """
        raw = await self.weather_client.get_forecast(trip.destination_location)
        return self._parse_daily_forecasts(raw)

    async def get_forecast(self, user_id: UUID, trip_id: UUID) -> list[DailyWeather]:
        """
        Retrieve the parsed daily forecast list for a trip owned by
        the given user.
        """
        trip = await self._get_owned_trip(user_id, trip_id)
        return await self._fetch_daily_forecasts(trip)

    async def get_trip_weather(self, user_id: UUID, trip_id: UUID) -> WeatherForecast:
        """
        Retrieve the complete weather forecast for a trip owned by
        the given user.
        """
        trip = await self._get_owned_trip(user_id, trip_id)
        days = await self._fetch_daily_forecasts(trip)
        return WeatherForecast(destination=trip.destination_location, days=days)

    async def get_today_weather(self, user_id: UUID, trip_id: UUID) -> WeatherResponse:
        """
        Retrieve only today's weather for a trip owned by the given
        user.
        """
        trip = await self._get_owned_trip(user_id, trip_id)
        days = await self._fetch_daily_forecasts(trip)

        if not days:
            raise ExternalAPIException(
                "No weather data available for this destination."
            )

        return WeatherResponse(destination=trip.destination_location, today=days[0])

    async def get_weather_summary(
        self, user_id: UUID, trip_id: UUID
    ) -> ForecastSummary:
        """
        Retrieve a simplified forecast summary (best/worst day,
        average temperature, rainy day count) for a trip owned by
        the given user.
        """
        trip = await self._get_owned_trip(user_id, trip_id)
        days = await self._fetch_daily_forecasts(trip)

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
            destination=trip.destination_location,
            best_day=f"Day {days.index(best_day) + 1}",
            worst_day=f"Day {days.index(worst_day) + 1}",
            average_temperature=round(average_temperature, 1),
            rainy_days=rainy_days,
        )
