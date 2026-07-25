from uuid import UUID

from fastapi import APIRouter, Depends, status

from app.api.deps import get_current_user, get_journal_service
from app.models.user import User
from app.schemas.journal import JournalCreate, JournalResponse, JournalUpdate
from app.services.journal_service import JournalService

router = APIRouter()


@router.post(
    "/trips/{trip_id}/journal",
    response_model=JournalResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_journal_entry(
    trip_id: UUID,
    entry: JournalCreate,
    current_user: User = Depends(get_current_user),
    service: JournalService = Depends(get_journal_service),
):
    """
    Create a new journal entry for a trip owned by the currently logged-in user.
    """
    return await service.create_entry(current_user.id, trip_id, entry)


@router.get(
    "/trips/{trip_id}/journal",
    response_model=list[JournalResponse],
    status_code=status.HTTP_200_OK,
)
async def list_journal_entries(
    trip_id: UUID,
    current_user: User = Depends(get_current_user),
    service: JournalService = Depends(get_journal_service),
):
    """
    List all journal entries for a trip owned by the currently logged-in user.
    """
    return await service.list_entries(current_user.id, trip_id)


@router.get(
    "/trips/{trip_id}/journal/timeline",
    response_model=list[JournalResponse],
    status_code=status.HTTP_200_OK,
)
async def get_journal_timeline(
    trip_id: UUID,
    current_user: User = Depends(get_current_user),
    service: JournalService = Depends(get_journal_service),
):
    """
    Get journal entries for a trip owned by the currently logged-in user,
    ordered by journal_date ascending.
    """
    return await service.get_timeline(current_user.id, trip_id)


@router.get(
    "/journal/{journal_id}",
    response_model=JournalResponse,
    status_code=status.HTTP_200_OK,
)
async def get_journal_entry(
    journal_id: UUID,
    current_user: User = Depends(get_current_user),
    service: JournalService = Depends(get_journal_service),
):
    """
    Get a single journal entry owned by the currently logged-in user (via its trip).
    """
    return await service.get_entry(current_user.id, journal_id)


@router.patch(
    "/journal/{journal_id}",
    response_model=JournalResponse,
    status_code=status.HTTP_200_OK,
)
async def update_journal_entry(
    journal_id: UUID,
    entry: JournalUpdate,
    current_user: User = Depends(get_current_user),
    service: JournalService = Depends(get_journal_service),
):
    """
    Update a journal entry owned by the currently logged-in user (via its trip).
    """
    return await service.update_entry(current_user.id, journal_id, entry)


@router.delete(
    "/journal/{journal_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_journal_entry(
    journal_id: UUID,
    current_user: User = Depends(get_current_user),
    service: JournalService = Depends(get_journal_service),
):
    """
    Soft-delete a journal entry owned by the currently logged-in user (via its trip).
    """
    await service.delete_entry(current_user.id, journal_id)
