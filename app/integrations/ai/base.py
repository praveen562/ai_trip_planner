from abc import ABC, abstractmethod
from typing import Any


class BaseAIProvider(ABC):
    """Abstract base provider interface for AI trip planning services."""

    @abstractmethod
    async def generate_itinerary(
        self,
        destination: str,
        duration_days: int,
        travel_style: list[str],
        budget_tier: str,
        additional_context: dict[str, Any] | None = None,
    ) -> dict[str, Any]:
        """
        Generate a structured day-by-day
        itinerary matching user constraints.
        """
        pass

    @abstractmethod
    async def regenerate_day(
        self,
        day_number: int,
        current_activities: list[dict[str, Any]],
        custom_instruction: str,
    ) -> list[dict[str, Any]]:
        """Re-plans a specific day's timeline using custom client instructions."""
        pass

    @abstractmethod
    async def chat_interaction(
        self,
        conversation_history: list[dict[str, str]],
        user_message: str,
        trip_context: dict[str, Any] | None = None,
    ) -> dict[str, Any]:
        """
        Handle AI chat interactions
        using conversation history.
        """
        pass
