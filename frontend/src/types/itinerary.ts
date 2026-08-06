/**
 * Shape of what the real backend actually returns (see
 * app/schemas/itinerary.py's ItineraryResponse): the AI's output is
 * stored as one prose string, not structured day/activity objects.
 * GeneratedItineraryDay is a lightweight, best-effort split of that
 * prose into per-day sections for display — not a guarantee the
 * model's formatting is perfectly regular.
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
