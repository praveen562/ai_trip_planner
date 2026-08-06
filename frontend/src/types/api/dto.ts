/**
 * Types mirroring the backend's Pydantic response schemas verbatim
 * (see app/schemas/*.py) — kept separate from the frontend's own
 * Trip/Itinerary types so a backend field rename only breaks the
 * mapper functions in utils/mappers/, not every component.
 */

export type BackendTripStatus = 'PLANNING' | 'UPCOMING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
export type BackendTravelStyle = 'BUDGET' | 'BALANCED' | 'PREMIUM';

export interface TripResponseDto {
  id: string;
  title: string;
  source_location: string;
  destination_location: string;
  start_date: string;
  end_date: string;
  budget: string; // Decimal, serialized as a string by FastAPI/Pydantic
  travel_style: BackendTravelStyle;
  status: BackendTripStatus;
}

export interface TripCreateDto {
  title: string;
  source_location: string;
  destination_location: string;
  start_date: string;
  end_date: string;
  budget: number;
  travel_style: BackendTravelStyle;
  notes?: string;
}

export interface ItineraryGenerateRequestDto {
  travel_style?: BackendTravelStyle;
  interests?: string[];
  budget_preference?: string;
  pace?: string;
  additional_notes?: string;
}

export interface ItineraryResponseDto {
  id: string;
  trip_id: string;
  title: string;
  ai_prompt: string;
  ai_response: string;
  total_days: number;
  is_regenerated: boolean;
  created_at: string;
  updated_at: string;
}

export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export interface UserProfileResponseDto {
  id: string;
  user_id: string;
  full_name: string;
  phone_number: string | null;
  date_of_birth: string | null;
  gender: Gender | null;
  nationality: string | null;
  preferred_language: string | null;
  preferred_currency: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  dietary_preferences: string | null;
  accessibility_requirements: string | null;
  bio: string | null;
  profile_image_url: string | null;
}

export interface UserProfileWriteDto {
  full_name?: string;
  phone_number?: string;
  date_of_birth?: string;
  gender?: Gender;
  nationality?: string;
  preferred_language?: string;
  preferred_currency?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  dietary_preferences?: string;
  accessibility_requirements?: string;
  bio?: string;
  profile_image_url?: string;
}

export interface UserResponseDto {
  id: string;
  full_name: string;
  email: string;
  role: 'USER' | 'ADMIN' | 'SUPERUSER';
  is_active: boolean;
  is_verified: boolean;
}

export interface TokenResponseDto {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

/* ---------------------------- Trip detail sub-resources ---------------------------- */

export type BackendMood =
  | 'EXCITED'
  | 'HAPPY'
  | 'PEACEFUL'
  | 'TIRED'
  | 'ADVENTUROUS'
  | 'STRESSED'
  | 'ROMANTIC'
  | 'GRATEFUL'
  | 'OTHER';

export type BackendWeather = 'SUNNY' | 'CLOUDY' | 'RAINY' | 'SNOWY' | 'WINDY' | 'STORMY' | 'FOGGY' | 'OTHER';

export interface JournalResponseDto {
  id: string;
  trip_id: string;
  title: string;
  description: string;
  location: string | null;
  mood: BackendMood | null;
  weather: BackendWeather | null;
  journal_date: string;
}

export interface JournalCreateDto {
  title: string;
  description: string;
  location?: string;
  mood?: BackendMood;
  weather?: BackendWeather;
  journal_date: string;
}

export type BackendExpenseCategory =
  | 'FOOD'
  | 'HOTEL'
  | 'TRANSPORT'
  | 'SHOPPING'
  | 'ENTERTAINMENT'
  | 'ACTIVITIES'
  | 'MEDICAL'
  | 'MISCELLANEOUS';

export type BackendPaymentMethod = 'CASH' | 'CARD' | 'UPI' | 'BANK_TRANSFER' | 'OTHER';

export interface ExpenseResponseDto {
  id: string;
  trip_id: string;
  title: string;
  category: BackendExpenseCategory;
  amount: string; // Decimal, serialized as a string
  currency: string;
  expense_date: string;
  payment_method: BackendPaymentMethod | null;
  notes: string | null;
}

export interface ExpenseSummaryResponseDto {
  total_expenses: string;
  expense_count: number;
  category_breakdown: Record<string, string>;
}

export type BackendPackingCategory =
  | 'CLOTHING'
  | 'FOOTWEAR'
  | 'ELECTRONICS'
  | 'DOCUMENTS'
  | 'MEDICINE'
  | 'TOILETRIES'
  | 'ACCESSORIES'
  | 'FOOD'
  | 'OTHER';

export type BackendPackingPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'ESSENTIAL';

export interface PackingItemResponseDto {
  id: string;
  trip_id: string;
  item_name: string;
  category: BackendPackingCategory;
  quantity: number;
  is_packed: boolean;
  priority: BackendPackingPriority;
  notes: string | null;
}

export interface TripPlaceResponseDto {
  id: string;
  trip_id: string;
  name: string;
  latitude: number;
  longitude: number;
  kind: string | null;
  image_url: string | null;
  address: string | null;
  description: string | null;
  source: string;
}

export interface TripPlaceListResponseDto {
  trip_id: string;
  count: number;
  places: TripPlaceResponseDto[];
}
