import logging
import sys

import structlog

from app.core.config import settings


def setup_logging() -> None:
    """Configures structured logging using structlog."""

    # Configure processors based on environment
    processors = [
        structlog.contextvars.merge_contextvars,
        structlog.processors.add_log_level,
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
    ]

    if settings.APP_ENV == "dev":
        # Human-readable colorized logging in local dev
        processors.append(structlog.dev.ConsoleRenderer(colors=True))
    else:
        # Production JSON logging for ingestion systems
        processors.append(structlog.processors.JSONRenderer())

    structlog.configure(
        processors=processors,
        logger_factory=structlog.PrintLoggerFactory(),
        wrapper_class=structlog.make_filtering_bound_logger(logging.INFO),
        cache_logger_on_first_use=True,
    )

    # Intercept standard library logging and forward to structlog
    logging.basicConfig(
        format="%(message)s",
        stream=sys.stdout,
        level=logging.INFO,
    )


# Root structured logger instance
logger = structlog.get_logger()
