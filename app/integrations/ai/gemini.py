from typing import Any

import structlog

from app.core.config import settings
from app.core.exceptions import ExternalAPIException
from app.integrations.ai.base import BaseAIProvider

logger = structlog.get_logger()


class GeminiAIProvider(BaseAIProvider):
    """Gemini API implementation of the BaseAIProvider interface."""

    def __init__(self) -> None:
        self.api_key = settings.GEMINI_API_KEY
        if not self.api_key and settings.APP_ENV == "prod":
            raise ExternalAPIException(
                "Gemini API credentials missing. " "Please set GEMINI_API_KEY."
            )

    async def generate_itinerary(
        self,
        destination: str,
        duration_days: int,
        travel_style: list[str],
        budget_tier: str,
        additional_context: dict[str, Any] | None = None,
    ) -> dict[str, Any]:
        logger.info(
            "Gemini generating itinerary",
            destination=destination,
            days=duration_days,
            style=travel_style,
            budget=budget_tier,
        )

        # Stub response matching standard database structures for plan validation
        return {
            "destination": destination,
            "pricing_tier": budget_tier,
            "estimated_total_cost": (
                150.00 * duration_days
                if budget_tier == "BUDGET"
                else 500.00 * duration_days
            ),
            "days": [
                {
                    "day_number": i + 1,
                    "summary": f"Day {i + 1} exploring central {destination}",
                    "activities": [
                        {
                            "title": f"Activity {i + 1}.1: Sightseeing walk",
                            "description": "A scenic walking tour.",
                            "category": "SIGHTSEEING",
                            "start_time": "09:00:00",
                            "end_time": "12:00:00",
                            "latitude": 0.0,
                            "longitude": 0.0,
                            "estimated_cost": 0.0,
                        }
                    ],
                }
                for i in range(duration_days)
            ],
        }

    async def regenerate_day(
        self,
        day_number: int,
        current_activities: list[dict[str, Any]],
        custom_instruction: str,
    ) -> list[dict[str, Any]]:
        logger.info(
            "Gemini regenerating day plan",
            day_number=day_number,
            instruction=custom_instruction,
        )

        # Return updated activities list mock
        return [
            {
                "title": f"Regenerated Activity for Day {day_number}",
                "description": f"Updated activity complying with: {custom_instruction}",
                "category": "CULTURE",
                "start_time": "10:00:00",
                "end_time": "13:00:00",
                "latitude": 0.0,
                "longitude": 0.0,
                "estimated_cost": 15.00,
            }
        ]

    async def chat_interaction(
        self,
        conversation_history: list[dict[str, str]],
        user_message: str,
        trip_context: dict[str, Any] | None = None,
    ) -> dict[str, Any]:
        logger.info("Gemini processing chat conversation", message=user_message)

        return {
            "content": f"This is a structured mock reply to: '{user_message}'",
            "metadata": {"engine": "gemini-1.5-pro", "has_recommendations": False},
        }
