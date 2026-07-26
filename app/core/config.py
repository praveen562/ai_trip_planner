import os
from typing import Literal

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class GlobalSettings(BaseSettings):
    """Shared settings configuration."""

    PROJECT_NAME: str = "AI Smart Trip Planner"
    API_V1_STR: str = "/api/v1"
    APP_VERSION: str = "1.0.0"

    JWT_SECRET: str = "supersecretjwtsecretkeychangeinproduction123!"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30

    GEMINI_API_KEY: str | None = None
    GOOGLE_MAPS_API_KEY: str | None = None
    OPENWEATHER_API_KEY: str | None = None
    WEATHER_API_KEY: str | None = None
    WEATHER_BASE_URL: str = "https://api.weatherapi.com/v1"

    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", extra="ignore"
    )


class DevelopmentSettings(GlobalSettings):
    """Development settings."""

    APP_ENV: Literal["dev"] = "dev"
    DATABASE_URL: str = (
        "postgresql+asyncpg://postgres:postgrespassword@localhost:5432/trip_planner"
    )


class TestingSettings(GlobalSettings):
    """Testing settings."""

    APP_ENV: Literal["test"] = "test"
    DATABASE_URL: str = (
        "postgresql+asyncpg://postgres:postgrespassword@localhost:5432/trip_planner_test"
    )


class ProductionSettings(GlobalSettings):
    """Production settings."""

    APP_ENV: Literal["prod"] = "prod"
    DATABASE_URL: str = Field(..., env="DATABASE_URL")

    # Enforce API keys in production
    GEMINI_API_KEY: str
    GOOGLE_MAPS_API_KEY: str
    OPENWEATHER_API_KEY: str
    WEATHER_API_KEY: str


def get_settings() -> GlobalSettings:
    """Factory to retrieve settings based on environment."""
    env = os.getenv("APP_ENV", "dev").lower()
    if env == "prod":
        return ProductionSettings()
    elif env == "test":
        return TestingSettings()
    return DevelopmentSettings()


settings = get_settings()
