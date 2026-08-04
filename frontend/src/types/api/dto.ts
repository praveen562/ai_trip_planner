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
