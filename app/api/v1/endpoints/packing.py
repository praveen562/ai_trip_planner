from uuid import UUID

from fastapi import APIRouter, Depends, status

from app.api.deps import get_current_user, get_packing_service
from app.models.user import User
from app.schemas.packing_item import (
    PackingItemCreate,
    PackingItemResponse,
    PackingItemUpdate,
    PackingSummaryResponse,
)
from app.services.packing_service import PackingService

router = APIRouter()


@router.post(
    "/trips/{trip_id}/packing",
    response_model=PackingItemResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_packing_item(
    trip_id: UUID,
    item: PackingItemCreate,
    current_user: User = Depends(get_current_user),
    service: PackingService = Depends(get_packing_service),
):
    """
    Create a new packing item for a trip owned by the currently logged-in user.
    """
    return await service.create_item(current_user.id, trip_id, item)


@router.get(
    "/trips/{trip_id}/packing",
    response_model=list[PackingItemResponse],
    status_code=status.HTTP_200_OK,
)
async def list_packing_items(
    trip_id: UUID,
    current_user: User = Depends(get_current_user),
    service: PackingService = Depends(get_packing_service),
):
    """
    List all packing items for a trip owned by the currently logged-in user.
    """
    return await service.list_items(current_user.id, trip_id)


@router.get(
    "/trips/{trip_id}/packing/summary",
    response_model=PackingSummaryResponse,
    status_code=status.HTTP_200_OK,
)
async def get_packing_summary(
    trip_id: UUID,
    current_user: User = Depends(get_current_user),
    service: PackingService = Depends(get_packing_service),
):
    """
    Get packing completion stats and category breakdown for a trip
    owned by the currently logged-in user.
    """
    return await service.get_summary(current_user.id, trip_id)


@router.get(
    "/packing/{packing_item_id}",
    response_model=PackingItemResponse,
    status_code=status.HTTP_200_OK,
)
async def get_packing_item(
    packing_item_id: UUID,
    current_user: User = Depends(get_current_user),
    service: PackingService = Depends(get_packing_service),
):
    """
    Get a single packing item owned by the currently logged-in user (via its trip).
    """
    return await service.get_item(current_user.id, packing_item_id)


@router.patch(
    "/packing/{packing_item_id}",
    response_model=PackingItemResponse,
    status_code=status.HTTP_200_OK,
)
async def update_packing_item(
    packing_item_id: UUID,
    item: PackingItemUpdate,
    current_user: User = Depends(get_current_user),
    service: PackingService = Depends(get_packing_service),
):
    """
    Update a packing item owned by the currently logged-in user (via its trip).
    """
    return await service.update_item(current_user.id, packing_item_id, item)


@router.delete(
    "/packing/{packing_item_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_packing_item(
    packing_item_id: UUID,
    current_user: User = Depends(get_current_user),
    service: PackingService = Depends(get_packing_service),
):
    """
    Soft-delete a packing item owned by the currently logged-in user (via its trip).
    """
    await service.delete_item(current_user.id, packing_item_id)


@router.patch(
    "/packing/{packing_item_id}/pack",
    response_model=PackingItemResponse,
    status_code=status.HTTP_200_OK,
)
async def pack_item(
    packing_item_id: UUID,
    current_user: User = Depends(get_current_user),
    service: PackingService = Depends(get_packing_service),
):
    """
    Mark a packing item as packed.
    """
    return await service.mark_as_packed(current_user.id, packing_item_id)


@router.patch(
    "/packing/{packing_item_id}/unpack",
    response_model=PackingItemResponse,
    status_code=status.HTTP_200_OK,
)
async def unpack_item(
    packing_item_id: UUID,
    current_user: User = Depends(get_current_user),
    service: PackingService = Depends(get_packing_service),
):
    """
    Mark a packing item as not packed.
    """
    return await service.mark_as_unpacked(current_user.id, packing_item_id)
