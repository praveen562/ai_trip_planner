import asyncio

import structlog
from google import genai

from app.core.config import settings
from app.core.exceptions import ExternalAPIException

logger = structlog.get_logger()

GEMINI_MODEL_NAME = "gemini-2.0-flash"
GEMINI_REQUEST_TIMEOUT_SECONDS = 45


class GeminiClient:
    """
    Thin client responsible for all direct communication with the
    Gemini API. Initializes the client, sends prompts, applies a
    timeout, and translates any provider-side failure into the
    application's exception hierarchy.

    Services must never call the Gemini SDK directly; they depend on
    this client instead.
    """

    def __init__(self) -> None:
        self.api_key = settings.GEMINI_API_KEY
        self._client: genai.Client | None = None

    def _get_client(self) -> genai.Client:
        """
        Lazily initialize the Gemini SDK client on first use.
        """
        if self._client is not None:
            return self._client

        if not self.api_key:
            raise ExternalAPIException(
                "The AI service is not configured. Please set GEMINI_API_KEY."
            )

        self._client = genai.Client(api_key=self.api_key)
        return self._client

    async def generate_content(self, prompt: str) -> str:
        """
        Send a prompt to Gemini and return the raw text response.

        Raises ExternalAPIException on timeout, provider failure, or
        an empty response. Never leaks the API key or raw provider
        error details to the caller.
        """
        client = self._get_client()

        try:
            response = await asyncio.wait_for(
                client.aio.models.generate_content(
                    model=GEMINI_MODEL_NAME,
                    contents=prompt,
                ),
                timeout=GEMINI_REQUEST_TIMEOUT_SECONDS,
            )
        except TimeoutError as exc:
            logger.error("Gemini request timed out")
            raise ExternalAPIException(
                "The AI service took too long to respond. Please try again."
            ) from exc
        except ExternalAPIException:
            raise
        except Exception as exc:
            logger.error("Gemini request failed", error=str(exc))
            raise ExternalAPIException(
                "The AI service is currently unavailable. Please try again later."
            ) from exc

        text = getattr(response, "text", None)

        if not text:
            logger.error("Gemini returned an empty response")
            raise ExternalAPIException("The AI service returned an empty response.")

        return text
