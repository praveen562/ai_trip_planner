from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.router import router as api_router
from app.core.config import settings
from app.core.exceptions import AppException
from app.core.logging import setup_logging
from app.core.middleware import RequestLoggingMiddleware
from contextlib import asynccontextmanager
from app.db.init_db import init_db

# Initialize structlog configurations
setup_logging()

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.APP_VERSION,
    lifespan=lifespan,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure CORS Middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict to specific domains in production settings
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Attach request-tracking and structured logs middleware
app.add_middleware(RequestLoggingMiddleware)


# Global Exception Handler: Custom application-level exception classes
@app.exception_handler(AppException)
async def app_exception_handler(request: Request, exc: AppException) -> JSONResponse:
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "status": "error",
            "error": {
                "status_code": exc.status_code,
                "error": exc.__class__.__name__,
                "message": exc.message,
                "details": exc.details,
            },
        },
    )


# Global Exception Handler: Pydantic parsing and route validation errors
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(
    request: Request, exc: RequestValidationError
) -> JSONResponse:
    return JSONResponse(
        status_code=422,
        content={
            "status": "error",
            "error": {
                "status_code": 422,
                "error": "UnprocessableEntity",
                "message": "Validation failed for request parameters or payload.",
                "details": exc.errors(),
            },
        },
    )


# Global Exception Handler: Fallback unhandled exceptions
@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    error_message = (
        str(exc) if settings.APP_ENV != "prod" else "An unexpected error occurred."
    )
    return JSONResponse(
        status_code=500,
        content={
            "status": "error",
            "error": {
                "status_code": 500,
                "error": "InternalServerError",
                "message": error_message,
                "details": None,
            },
        },
    )


@app.get("/")
async def root() -> dict[str, str | dict[str, str]]:
    """Root landing endpoint serving greeting metadata."""
    return {
        "status": "success",
        "data": {
            "message": (
                f"Welcome to {settings.PROJECT_NAME} API. "
                "Navigate to /docs for the interactive API documentation."
            ),
            "version": settings.APP_VERSION,
            "environment": settings.APP_ENV,
        },
    }


# Register versioned API router namespace
app.include_router(api_router)
