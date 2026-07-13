from typing import Any, Generic, TypeVar

from pydantic import BaseModel

T = TypeVar("T")


class SuccessResponse(BaseModel, Generic[T]):
    """Standard success API response envelope."""

    status: str = "success"
    data: T


class ErrorDetails(BaseModel):
    """Inner error payload detail schema."""

    status_code: int
    error: str
    message: str
    details: Any = None


class ErrorResponse(BaseModel):
    """Standard error API response envelope."""

    status: str = "error"
    error: ErrorDetails
