from enum import StrEnum


class UserRole(StrEnum):
    """User authorization roles."""

    USER = "USER"
    ADMIN = "ADMIN"
    SUPERUSER = "SUPERUSER"


class TripStatus(StrEnum):
    """Current state lifecycle of a trip."""

    PLANNING = "PLANNING"
    UPCOMING = "UPCOMING"
    ACTIVE = "ACTIVE"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"


class TravelStyle(StrEnum):
    """Travel pricing and quality tiers."""

    BUDGET = "BUDGET"
    BALANCED = "BALANCED"
    PREMIUM = "PREMIUM"


class ExpenseCategory(StrEnum):
    """Budget grouping categories."""

    ACCOMMODATION = "ACCOMMODATION"
    TRANSPORT = "TRANSPORT"
    FOOD = "FOOD"
    ACTIVITIES = "ACTIVITIES"
    SHOPPING = "SHOPPING"
    MISC = "MISC"


class AccommodationType(StrEnum):
    """Lodging types."""

    HOTEL = "HOTEL"
    HOSTEL = "HOSTEL"
    APARTMENT = "APARTMENT"
    RESORT = "RESORT"
    OTHER = "OTHER"


class TransportMode(StrEnum):
    """Transit modes between events."""

    FLIGHT = "FLIGHT"
    TRAIN = "TRAIN"
    BUS = "BUS"
    CAR = "CAR"
    WALKING = "WALKING"
    BICYCLE = "BICYCLE"
    TRANSIT = "TRANSIT"


class NotificationType(StrEnum):
    """Telemetry alert classifications."""

    TRIP_START = "TRIP_START"
    WEATHER_ALERT = "WEATHER_ALERT"
    EXPENSE_LIMIT = "EXPENSE_LIMIT"
    SYSTEM = "SYSTEM"


class ActivityCategory(StrEnum):
    """Daily itinerary activity classifications."""

    SIGHTSEEING = "SIGHTSEEING"
    ADVENTURE = "ADVENTURE"
    CULTURE = "CULTURE"
    RELAXATION = "RELAXATION"
    TRANSIT = "TRANSIT"
    SHOPPING = "SHOPPING"


class Gender(StrEnum):
    """Self-identified gender options for a user profile."""

    MALE = "MALE"
    FEMALE = "FEMALE"
    OTHER = "OTHER"
    PREFER_NOT_TO_SAY = "PREFER_NOT_TO_SAY"
