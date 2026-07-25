from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import PackingCategory, PackingPriority


class PackingItemCreate(BaseModel):
    item_name: str = Field(..., min_length=1, max_length=150)
    category: PackingCategory
    quantity: int = Field(default=1, ge=1)
    priority: PackingPriority = PackingPriority.MEDIUM
    notes: str | None = None


class PackingItemUpdate(BaseModel):
    item_name: str | None = Field(default=None, min_length=1, max_length=150)
    category: PackingCategory | None = None
    quantity: int | None = Field(default=None, ge=1)
    is_packed: bool | None = None
    priority: PackingPriority | None = None
    notes: str | None = None


class PackingItemResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    trip_id: UUID
    item_name: str
    category: PackingCategory
    quantity: int
    is_packed: bool
    priority: PackingPriority
    notes: str | None


class PackingSummaryResponse(BaseModel):
    total_items: int
    packed_items: int
    remaining_items: int
    completion_percentage: float
    category_breakdown: dict[str, int]
