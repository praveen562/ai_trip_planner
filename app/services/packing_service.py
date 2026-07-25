from uuid import UUID

from app.core.exceptions import AuthorizationException, NotFoundException
from app.models.packing_item import PackingItem
from app.models.trip import Trip
from app.repositories.packing_repository import PackingRepository
from app.repositories.trip_repository import TripRepository
from app.schemas.packing_item import (
    PackingItemCreate,
    PackingItemUpdate,
    PackingSummaryResponse,
)


class PackingService:
    """
    Handles packing checklist item creation, retrieval, and lifecycle
    management.

    Packing items belong to a trip, which belongs to a user, so every
    operation verifies ownership by walking PackingItem -> Trip -> User.
    """

    def __init__(
        self,
        repository: PackingRepository,
        trip_repository: TripRepository,
    ):
        self.repository = repository
        self.trip_repository = trip_repository

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

    async def _get_owned_item(self, user_id: UUID, item_id: UUID) -> PackingItem:
        """
        Retrieve a packing item, enforcing ownership via its trip.
        """
        item = await self.repository.get_by_id(item_id)

        if item is None:
            raise NotFoundException("Packing item not found.")

        await self._get_owned_trip(user_id, item.trip_id)

        return item

    async def create_item(
        self, user_id: UUID, trip_id: UUID, item_data: PackingItemCreate
    ) -> PackingItem:
        """
        Create a new packing item for a trip owned by the given user.
        """
        await self._get_owned_trip(user_id, trip_id)

        item = PackingItem(
            trip_id=trip_id,
            item_name=item_data.item_name,
            category=item_data.category,
            quantity=item_data.quantity,
            priority=item_data.priority,
            notes=item_data.notes,
        )

        return await self.repository.create(item)

    async def list_items(self, user_id: UUID, trip_id: UUID) -> list[PackingItem]:
        """
        List all packing items belonging to a trip owned by the given user.
        """
        await self._get_owned_trip(user_id, trip_id)
        return await self.repository.get_all_for_trip(trip_id)

    async def get_item(self, user_id: UUID, item_id: UUID) -> PackingItem:
        """
        Retrieve a single packing item, enforcing ownership via its trip.
        """
        return await self._get_owned_item(user_id, item_id)

    async def update_item(
        self, user_id: UUID, item_id: UUID, item_data: PackingItemUpdate
    ) -> PackingItem:
        """
        Update an existing packing item, enforcing ownership via its trip.
        """
        item = await self._get_owned_item(user_id, item_id)

        update_fields = item_data.model_dump(exclude_unset=True)
        for field, value in update_fields.items():
            setattr(item, field, value)

        return await self.repository.update(item)

    async def delete_item(self, user_id: UUID, item_id: UUID) -> None:
        """
        Soft-delete a packing item, enforcing ownership via its trip.
        """
        item = await self._get_owned_item(user_id, item_id)
        await self.repository.delete(item)

    async def mark_as_packed(self, user_id: UUID, item_id: UUID) -> PackingItem:
        """
        Mark a packing item as packed.
        """
        item = await self._get_owned_item(user_id, item_id)
        item.is_packed = True
        return await self.repository.update(item)

    async def mark_as_unpacked(self, user_id: UUID, item_id: UUID) -> PackingItem:
        """
        Mark a packing item as not packed.
        """
        item = await self._get_owned_item(user_id, item_id)
        item.is_packed = False
        return await self.repository.update(item)

    async def get_summary(self, user_id: UUID, trip_id: UUID) -> PackingSummaryResponse:
        """
        Compute total, packed, remaining item counts, completion
        percentage, and per-category breakdown for a trip owned by the
        given user.
        """
        await self._get_owned_trip(user_id, trip_id)
        items = await self.repository.get_all_for_trip(trip_id)

        total_items = len(items)
        packed_items = sum(1 for item in items if item.is_packed)
        remaining_items = total_items - packed_items
        completion_percentage = (
            round((packed_items / total_items) * 100, 1) if total_items > 0 else 0.0
        )

        category_breakdown: dict[str, int] = {}
        for item in items:
            category_label = item.category.value.title()
            category_breakdown[category_label] = (
                category_breakdown.get(category_label, 0) + 1
            )

        return PackingSummaryResponse(
            total_items=total_items,
            packed_items=packed_items,
            remaining_items=remaining_items,
            completion_percentage=completion_percentage,
            category_breakdown=category_breakdown,
        )
