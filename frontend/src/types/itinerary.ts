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
