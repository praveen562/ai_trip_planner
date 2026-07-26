from datetime import date, datetime

from pydantic import BaseModel


class DailyWeather(BaseModel):
    date: date
    temperature_min: float
    temperature_max: float
    feels_like: float
    humidity: int
    wind_speed: float
    weather: str
    weather_description: str
    icon: str
    rain_probability: float
    sunrise: datetime | None
    sunset: datetime | None


class WeatherForecast(BaseModel):
    destination: str
    days: list[DailyWeather]


class WeatherResponse(BaseModel):
    destination: str
    today: DailyWeather


class ForecastSummary(BaseModel):
    destination: str
    best_day: str
    worst_day: str
    average_temperature: float
    rainy_days: int
