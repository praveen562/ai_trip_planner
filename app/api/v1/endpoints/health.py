import time

from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.logging import logger
from app.db.session import get_db

router = APIRouter()

START_TIME = time.time()


@router.get("/health")
async def health_check(db: AsyncSession = Depends(get_db)):
    db_status = "connected"

    try:
        await db.execute(text("SELECT 1"))
    except Exception as e:
        logger.error("Database connection check failed", error=str(e))
        db_status = "disconnected"

    uptime_seconds = time.time() - START_TIME
    hours, rem = divmod(uptime_seconds, 3600)
    minutes, seconds = divmod(rem, 60)

    return {
        "status": "success",
        "data": {
            "status": "healthy" if db_status == "connected" else "unhealthy",
            "environment": settings.APP_ENV,
            "version": settings.APP_VERSION,
            "database": db_status,
            "uptime": f"{int(hours)}h {int(minutes)}m {seconds:.2f}s",
        },
    }
