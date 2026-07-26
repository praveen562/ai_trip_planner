from decimal import Decimal
from uuid import UUID

from app.core.exceptions import (
    AuthorizationException,
    ConflictException,
    NotFoundException,
)
from app.integrations.gemini_client import GeminiClient
from app.models.itinerary import Itinerary
from app.models.trip import Trip
from app.repositories.expense_repository import ExpenseRepository
from app.repositories.itinerary_repository import ItineraryRepository
from app.repositories.journal_repository import JournalRepository
from app.repositories.packing_repository import PackingRepository
from app.repositories.trip_repository import TripRepository
from app.repositories.user_profile_repository import UserProfileRepository
from app.schemas.itinerary import ItineraryGenerateRequest


class ItineraryService:
    """
    Handles AI itinerary generation, retrieval, and lifecycle
    management. Ownership is enforced by walking
    Itinerary -> Trip -> User. Gemini is never called directly here;
    all provider communication goes through GeminiClient.
    """

    def __init__(
        self,
        repository: ItineraryRepository,
        trip_repository: TripRepository,
        profile_repository: UserProfileRepository,
        expense_repository: ExpenseRepository,
        packing_repository: PackingRepository,
        journal_repository: JournalRepository,
        gemini_client: GeminiClient,
    ):
        self.repository = repository
        self.trip_repository = trip_repository
        self.profile_repository = profile_repository
        self.expense_repository = expense_repository
        self.packing_repository = packing_repository
        self.journal_repository = journal_repository
        self.gemini_client = gemini_client

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

    async def _get_owned_itinerary(
        self, user_id: UUID, itinerary_id: UUID
    ) -> tuple[Itinerary, Trip]:
        """
        Retrieve an itinerary along with its trip, enforcing ownership
        via the parent trip.
        """
        itinerary = await self.repository.get_by_id(itinerary_id)

        if itinerary is None:
            raise NotFoundException("Itinerary not found.")

        trip = await self._get_owned_trip(user_id, itinerary.trip_id)

        return itinerary, trip

    async def _build_prompt(
        self, trip: Trip, user_id: UUID, request_data: ItineraryGenerateRequest
    ) -> str:
        """
        Gather trip context (profile, packing checklist, expenses,
        journal entries) and construct a structured day-by-day
        itinerary prompt for the AI provider.
        """
        profile = await self.profile_repository.get_by_user_id(user_id)
        packing_items = await self.packing_repository.get_all_for_trip(trip.id)
        expenses = await self.expense_repository.get_all_for_trip(trip.id)
        journal_entries = await self.journal_repository.get_all_for_trip(trip.id)

        lines: list[str] = []

        lines.append(
            "You are a travel planning assistant. Create a detailed, "
            "day-by-day itinerary based on the following information."
        )

        lines.append("\n## Trip Details")
        lines.append(f"- Destination: {trip.destination_location}")
        lines.append(f"- Traveling from: {trip.source_location}")
        lines.append(f"- Start date: {trip.start_date.isoformat()}")
        lines.append(f"- End date: {trip.end_date.isoformat()}")
        lines.append(f"- Duration: {trip.total_days} day(s)")
        lines.append(f"- Total budget: {trip.budget}")
        lines.append(f"- Trip travel style: {trip.travel_style.value}")

        lines.append("\n## Traveler Preferences")
        if request_data.travel_style:
            lines.append(f"- Preferred travel style: {request_data.travel_style.value}")
        if request_data.interests:
            lines.append(f"- Interests: {', '.join(request_data.interests)}")
        if request_data.budget_preference:
            lines.append(f"- Budget preference: {request_data.budget_preference}")
        if request_data.pace:
            lines.append(f"- Preferred pace: {request_data.pace}")
        if request_data.additional_notes:
            lines.append(f"- Additional notes: {request_data.additional_notes}")
        if profile is not None:
            if profile.dietary_preferences:
                lines.append(f"- Dietary preferences: {profile.dietary_preferences}")
            if profile.accessibility_requirements:
                lines.append(
                    "- Accessibility requirements: "
                    f"{profile.accessibility_requirements}"
                )
            if profile.preferred_currency:
                lines.append(f"- Preferred currency: {profile.preferred_currency}")

        if packing_items:
            lines.append("\n## Existing Packing Checklist")
            for item in packing_items:
                lines.append(
                    f"- {item.item_name} (x{item.quantity}, {item.category.value})"
                )

        if expenses:
            total_spent = sum((expense.amount for expense in expenses), Decimal("0"))
            lines.append("\n## Existing Expenses")
            lines.append(f"- Total spent so far: {total_spent}")
            for expense in expenses:
                lines.append(
                    f"- {expense.title}: {expense.amount} {expense.currency} "
                    f"({expense.category.value})"
                )

        if journal_entries:
            lines.append("\n## Previous Journal Notes")
            for entry in journal_entries:
                lines.append(f"- {entry.journal_date.isoformat()}: {entry.title}")

        lines.append("\n## Instructions")
        lines.append(
            "Produce a day-by-day itinerary covering all "
            f"{trip.total_days} day(s), formatted as:"
        )
        lines.append("Day 1\nMorning\nAfternoon\nEvening\n\nDay 2\n...")
        lines.append(
            "For each day, include: attractions, restaurant "
            "recommendations, estimated daily spending, transport "
            "suggestions, and local tips."
        )

        return "\n".join(lines)

    async def generate_itinerary(
        self, user_id: UUID, trip_id: UUID, request_data: ItineraryGenerateRequest
    ) -> Itinerary:
        """
        Generate a new itinerary for a trip owned by the given user.
        A trip may only have one active itinerary; use
        regenerate_itinerary to update an existing one.
        """
        trip = await self._get_owned_trip(user_id, trip_id)

        existing_itinerary = await self.repository.get_trip_itinerary(trip_id)
        if existing_itinerary is not None:
            raise ConflictException(
                "An itinerary already exists for this trip. "
                "Use the regenerate endpoint to update it instead."
            )

        prompt = await self._build_prompt(trip, user_id, request_data)
        ai_response = await self.gemini_client.generate_content(prompt)

        itinerary = Itinerary(
            trip_id=trip_id,
            title=f"Itinerary for {trip.title}",
            ai_prompt=prompt,
            ai_response=ai_response,
            total_days=trip.total_days,
            is_regenerated=False,
        )

        return await self.repository.create(itinerary)

    async def regenerate_itinerary(
        self,
        user_id: UUID,
        itinerary_id: UUID,
        request_data: ItineraryGenerateRequest,
    ) -> Itinerary:
        """
        Regenerate an existing itinerary in place (does not create a
        duplicate).
        """
        itinerary, trip = await self._get_owned_itinerary(user_id, itinerary_id)

        prompt = await self._build_prompt(trip, user_id, request_data)
        ai_response = await self.gemini_client.generate_content(prompt)

        itinerary.ai_prompt = prompt
        itinerary.ai_response = ai_response
        itinerary.total_days = trip.total_days
        itinerary.is_regenerated = True

        return await self.repository.update(itinerary)

    async def get_itinerary(self, user_id: UUID, itinerary_id: UUID) -> Itinerary:
        """
        Retrieve a single itinerary, enforcing ownership via its trip.
        """
        itinerary, _ = await self._get_owned_itinerary(user_id, itinerary_id)
        return itinerary

    async def delete_itinerary(self, user_id: UUID, itinerary_id: UUID) -> None:
        """
        Soft-delete an itinerary, enforcing ownership via its trip.
        """
        itinerary, _ = await self._get_owned_itinerary(user_id, itinerary_id)
        await self.repository.delete(itinerary)
