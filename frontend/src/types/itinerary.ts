export interface ItineraryActivity {
  time: string;
  title: string;
  note?: string;
}

export interface ItineraryDay {
  dayNumber: number;
  date: string; // ISO date
  title: string;
  weatherSummary: string;
  activities: ItineraryActivity[];
}

export interface Itinerary {
  destination: string;
  country: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  travelers: number;
  budget: 'budget' | 'mid-range' | 'luxury';
  days: ItineraryDay[];
}

/**
 * Shape of what the real backend actually returns (see
 * app/schemas/itinerary.py's ItineraryResponse): the AI's output is
 * stored as one prose string, not structured day/activity objects like
 * the `Itinerary` type above (which remains in use by TripDetail's
 * still-mocked itinerary tab). GeneratedItineraryDay is a lightweight,
 * best-effort split of that prose into per-day sections for display —
 * not a guarantee the model's formatting is perfectly regular.
 */
export interface GeneratedItineraryDay {
  label: string; // e.g. "Day 1" — whatever heading the model used
  content: string; // raw prose for that day, line breaks preserved
}

export interface GeneratedItinerary {
  itineraryId: string;
  tripId: string;
  title: string;
  destination: string;
  sourceLocation: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  isRegenerated: boolean;
  rawResponse: string;
  days: GeneratedItineraryDay[];
}
