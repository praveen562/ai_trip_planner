from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.exceptions import AuthenticationException
from app.db.session import get_db
from app.integrations.gemini_client import GeminiClient
from app.integrations.opentripmap_client import OpenTripMapClient
from app.integrations.osrm_client import OSRMClient
from app.integrations.unsplash_client import BaseImageClient, UnsplashClient
from app.integrations.weather_client import WeatherClient
from app.models.user import User
from app.repositories.expense_repository import ExpenseRepository
from app.repositories.itinerary_repository import ItineraryRepository
from app.repositories.journal_repository import JournalRepository
from app.repositories.packing_repository import PackingRepository
from app.repositories.trip_place_repository import TripPlaceRepository
from app.repositories.trip_repository import TripRepository
from app.repositories.user_profile_repository import UserProfileRepository
from app.repositories.user_repository import UserRepository
from app.services.auth_service import AuthService
from app.services.expense_service import ExpenseService
from app.services.itinerary_service import ItineraryService
from app.services.journal_service import JournalService
from app.services.packing_service import PackingService
from app.services.places_service import PlacesService
from app.services.route_service import RouteService
from app.services.trip_place_service import TripPlaceService
from app.services.trip_service import TripService
from app.services.user_profile_service import UserProfileService
from app.services.weather_service import WeatherService

# Use settings.API_V1_STR to dynamically format prefix
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/token")


def get_user_repository(
    db: AsyncSession = Depends(get_db),
) -> UserRepository:
    """
    Return a UserRepository instance.
    """
    return UserRepository(db)


def get_auth_service(
    repository: UserRepository = Depends(get_user_repository),
) -> AuthService:
    """
    Return an AuthService instance.
    """
    return AuthService(repository)


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    service: AuthService = Depends(get_auth_service),
) -> User:
    """
    Resolve JWT token from authorization header and return current user.
    """
    try:
        return await service.get_current_user(token)
    except ValueError as exc:
        raise AuthenticationException(message=str(exc)) from exc


def get_trip_repository(
    db: AsyncSession = Depends(get_db),
) -> TripRepository:
    """
    Return a TripRepository instance.
    """
    return TripRepository(db)


def get_trip_service(
    repository: TripRepository = Depends(get_trip_repository),
) -> TripService:
    """
    Return a TripService instance.
    """
    return TripService(repository)


def get_user_profile_repository(
    db: AsyncSession = Depends(get_db),
) -> UserProfileRepository:
    """
    Return a UserProfileRepository instance.
    """
    return UserProfileRepository(db)


def get_user_profile_service(
    repository: UserProfileRepository = Depends(get_user_profile_repository),
) -> UserProfileService:
    """
    Return a UserProfileService instance.
    """
    return UserProfileService(repository)


def get_expense_repository(
    db: AsyncSession = Depends(get_db),
) -> ExpenseRepository:
    """
    Return an ExpenseRepository instance.
    """
    return ExpenseRepository(db)


def get_expense_service(
    repository: ExpenseRepository = Depends(get_expense_repository),
    trip_repository: TripRepository = Depends(get_trip_repository),
    profile_repository: UserProfileRepository = Depends(get_user_profile_repository),
) -> ExpenseService:
    """
    Return an ExpenseService instance.
    """
    return ExpenseService(repository, trip_repository, profile_repository)


def get_journal_repository(
    db: AsyncSession = Depends(get_db),
) -> JournalRepository:
    """
    Return a JournalRepository instance.
    """
    return JournalRepository(db)


def get_journal_service(
    repository: JournalRepository = Depends(get_journal_repository),
    trip_repository: TripRepository = Depends(get_trip_repository),
) -> JournalService:
    """
    Return a JournalService instance.
    """
    return JournalService(repository, trip_repository)


def get_packing_repository(
    db: AsyncSession = Depends(get_db),
) -> PackingRepository:
    """
    Return a PackingRepository instance.
    """
    return PackingRepository(db)


def get_packing_service(
    repository: PackingRepository = Depends(get_packing_repository),
    trip_repository: TripRepository = Depends(get_trip_repository),
) -> PackingService:
    """
    Return a PackingService instance.
    """
    return PackingService(repository, trip_repository)


def get_itinerary_repository(
    db: AsyncSession = Depends(get_db),
) -> ItineraryRepository:
    """
    Return an ItineraryRepository instance.
    """
    return ItineraryRepository(db)


def get_gemini_client() -> GeminiClient:
    """
    Return a GeminiClient instance.
    """
    return GeminiClient()


def get_itinerary_service(
    repository: ItineraryRepository = Depends(get_itinerary_repository),
    trip_repository: TripRepository = Depends(get_trip_repository),
    profile_repository: UserProfileRepository = Depends(get_user_profile_repository),
    expense_repository: ExpenseRepository = Depends(get_expense_repository),
    packing_repository: PackingRepository = Depends(get_packing_repository),
    journal_repository: JournalRepository = Depends(get_journal_repository),
    gemini_client: GeminiClient = Depends(get_gemini_client),
) -> ItineraryService:
    """
    Return an ItineraryService instance.
    """
    return ItineraryService(
        repository,
        trip_repository,
        profile_repository,
        expense_repository,
        packing_repository,
        journal_repository,
        gemini_client,
    )


def get_weather_client() -> WeatherClient:
    """
    Return a WeatherClient instance.
    """
    return WeatherClient()


def get_weather_service(
    trip_repository: TripRepository = Depends(get_trip_repository),
    weather_client: WeatherClient = Depends(get_weather_client),
) -> WeatherService:
    """
    Return a WeatherService instance.
    """
    return WeatherService(trip_repository, weather_client)


def get_opentripmap_client() -> OpenTripMapClient:
    """
    Return an OpenTripMapClient instance.
    """
    return OpenTripMapClient()


_unsplash_client_singleton: UnsplashClient | None = None


def get_unsplash_client() -> BaseImageClient:
    """
    Return a shared UnsplashClient instance. Kept as a singleton (not
    a fresh instance per request) so its in-memory image cache
    persists across requests -- repeated attraction lookups across
    trips/users to the same destination reuse cached results instead
    of re-querying Unsplash every time.
    """
    global _unsplash_client_singleton
    if _unsplash_client_singleton is None:
        _unsplash_client_singleton = UnsplashClient()
    return _unsplash_client_singleton


def get_places_service(
    trip_repository: TripRepository = Depends(get_trip_repository),
    client: OpenTripMapClient = Depends(get_opentripmap_client),
    image_client: BaseImageClient = Depends(get_unsplash_client),
) -> PlacesService:
    """
    Return a PlacesService instance.
    """
    return PlacesService(trip_repository, client, image_client)


def get_trip_place_repository(
    db: AsyncSession = Depends(get_db),
) -> TripPlaceRepository:
    """
    Return a TripPlaceRepository instance.
    """
    return TripPlaceRepository(db)


def get_trip_place_service(
    repository: TripPlaceRepository = Depends(get_trip_place_repository),
    trip_repository: TripRepository = Depends(get_trip_repository),
) -> TripPlaceService:
    """
    Return a TripPlaceService instance.
    """
    return TripPlaceService(repository, trip_repository)


def get_osrm_client() -> OSRMClient:
    """
    Return an OSRMClient instance.
    """
    return OSRMClient()


def get_route_service(
    trip_repository: TripRepository = Depends(get_trip_repository),
    trip_place_repository: TripPlaceRepository = Depends(get_trip_place_repository),
    osrm_client: OSRMClient = Depends(get_osrm_client),
) -> RouteService:
    """
    Return a RouteService instance.
    """
    return RouteService(trip_repository, trip_place_repository, osrm_client)
