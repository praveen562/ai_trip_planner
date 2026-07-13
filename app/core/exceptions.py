from typing import Any


class AppException(Exception):
    """Base application exception class."""

    def __init__(self, message: str, status_code: int = 400, details: Any = None):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.details = details


class NotFoundException(AppException):
    """Exception raised when a resource is not found."""

    def __init__(self, message: str = "Resource not found", details: Any = None):
        super().__init__(message=message, status_code=404, details=details)


class DatabaseException(AppException):
    """Exception raised for database-related connectivity or integrity errors."""

    def __init__(self, message: str = "Database operation failed", details: Any = None):
        super().__init__(message=message, status_code=500, details=details)


class AuthenticationException(AppException):
    """Exception raised for invalid credentials or authentication failures."""

    def __init__(
        self,
        message: str = "Invalid credentials or authorization status",
        details: Any = None,
    ):
        super().__init__(message=message, status_code=401, details=details)


class ExternalAPIException(AppException):
    """Exception raised when external integrations (Google, Weather, Gemini) fail."""

    def __init__(
        self, message: str = "External integration error occurred", details: Any = None
    ):
        super().__init__(message=message, status_code=502, details=details)
