import time
import uuid

import structlog
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

logger = structlog.get_logger()


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """Middleware for injecting Request IDs and structured logging of API requests."""

    async def dispatch(self, request: Request, call_next) -> Response:
        # Resolve request ID from header or generate a new UUID
        request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))

        # Bind Request ID context to all logs in this task context
        structlog.contextvars.clear_contextvars()
        structlog.contextvars.bind_contextvars(request_id=request_id)

        start_time = time.perf_counter()
        client_host = request.client.host if request.client else "unknown"

        logger.info(
            "HTTP Request Received",
            method=request.method,
            path=request.url.path,
            client_ip=client_host,
            query_params=str(request.query_params),
        )

        try:
            response = await call_next(request)
        except Exception as e:
            duration = (time.perf_counter() - start_time) * 1000
            logger.error(
                "HTTP Request Unhandled Exception",
                method=request.method,
                path=request.url.path,
                duration_ms=round(duration, 2),
                exception=str(e),
            )
            raise e

        duration = (time.perf_counter() - start_time) * 1000

        # Inject Request ID to the outgoing response headers for debugging
        response.headers["X-Request-ID"] = request_id

        logger.info(
            "HTTP Response Sent",
            method=request.method,
            path=request.url.path,
            status_code=response.status_code,
            duration_ms=round(duration, 2),
        )

        return response
