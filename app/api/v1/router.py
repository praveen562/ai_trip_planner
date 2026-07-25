from fastapi import APIRouter

from app.api.v1.endpoints import (
    ai,
    auth,
    expenses,
    health,
    journals,
    packing,
    profile,
    trips,
    users,
)

api_router = APIRouter()

api_router.include_router(
    health.router,
    tags=["Health"],
)

api_router.include_router(
    auth.router,
    prefix="/auth",
    tags=["Authentication"],
)

api_router.include_router(
    users.router,
    prefix="/users",
    tags=["Users"],
)

api_router.include_router(
    trips.router,
    prefix="/trips",
    tags=["Trips"],
)

api_router.include_router(
    profile.router,
    prefix="/profile",
    tags=["Profile"],
)

api_router.include_router(
    ai.router,
    prefix="/ai",
    tags=["AI"],
)

api_router.include_router(
    expenses.router,
    prefix="/expenses",
    tags=["Expenses"],
)

api_router.include_router(
    journals.router,
    prefix="/journals",
    tags=["Journal"],
)

api_router.include_router(
    packing.router,
    prefix="/packing",
    tags=["Packing"],
)
