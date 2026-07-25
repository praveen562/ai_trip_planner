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

    FOOD = "FOOD"
    HOTEL = "HOTEL"
    TRANSPORT = "TRANSPORT"
    SHOPPING = "SHOPPING"
    ENTERTAINMENT = "ENTERTAINMENT"
    ACTIVITIES = "ACTIVITIES"
    MEDICAL = "MEDICAL"
    MISCELLANEOUS = "MISCELLANEOUS"


class PaymentMethod(StrEnum):
    """Payment methods used to settle an expense."""

    CASH = "CASH"
    CARD = "CARD"
    UPI = "UPI"
    BANK_TRANSFER = "BANK_TRANSFER"
    OTHER = "OTHER"


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


class Mood(StrEnum):
    """Self-reported mood for a journal entry."""

    EXCITED = "EXCITED"
    HAPPY = "HAPPY"
    PEACEFUL = "PEACEFUL"
    TIRED = "TIRED"
    ADVENTUROUS = "ADVENTUROUS"
    STRESSED = "STRESSED"
    ROMANTIC = "ROMANTIC"
    GRATEFUL = "GRATEFUL"
    OTHER = "OTHER"


class Weather(StrEnum):
    """Weather condition logged for a journal entry."""

    SUNNY = "SUNNY"
    CLOUDY = "CLOUDY"
    RAINY = "RAINY"
    SNOWY = "SNOWY"
    WINDY = "WINDY"
    STORMY = "STORMY"
    FOGGY = "FOGGY"
    OTHER = "OTHER"


class PackingCategory(StrEnum):
    """Category grouping for a packing checklist item."""

    CLOTHING = "CLOTHING"
    FOOTWEAR = "FOOTWEAR"
    ELECTRONICS = "ELECTRONICS"
    DOCUMENTS = "DOCUMENTS"
    MEDICINE = "MEDICINE"
    TOILETRIES = "TOILETRIES"
    ACCESSORIES = "ACCESSORIES"
    FOOD = "FOOD"
    OTHER = "OTHER"


class PackingPriority(StrEnum):
    """Priority level for a packing checklist item."""

    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    ESSENTIAL = "ESSENTIAL"
