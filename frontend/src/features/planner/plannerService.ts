import type { Itinerary, ItineraryDay } from '../../types/itinerary';
import type { PlannerFormValues } from './schemas';

/**
 * Mocked for now — the real backend already generates itineraries via
 * Google Gemini (see project handoff's AI Itinerary module). Step 10
 * swaps this implementation for the real POST call; PlannerPage and
 * everything downstream of it doesn't change.
 */
function mockDelay<T>(value: T, ms: number): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

const ACTIVITY_TEMPLATES = [
  { time: '9:00 AM', title: 'Explore the historic center', note: 'Start early to beat the crowds.' },
  { time: '12:30 PM', title: 'Lunch at a local favorite', note: 'Ask your accommodation for a recommendation.' },
  { time: '3:00 PM', title: 'Visit a landmark or museum', note: undefined },
  { time: '7:00 PM', title: 'Dinner and an evening walk', note: 'Golden hour is worth timing for.' }
];

const WEATHER_ROTATION = ['Sunny, 24°C', 'Partly cloudy, 21°C', 'Light rain, 18°C', 'Clear skies, 26°C'];

function buildDays(destination: string, startDate: string, totalDays: number): ItineraryDay[] {
  const start = new Date(startDate);

  return Array.from({ length: totalDays }, (_, i) => {
    const date = new Date(start);
    date.setDate(date.getDate() + i);

    return {
      dayNumber: i + 1,
      date: date.toISOString().slice(0, 10),
      title: i === 0 ? `Arrive in ${destination}` : i === totalDays - 1 ? `Last day in ${destination}` : `Exploring ${destination}`,
      weatherSummary: WEATHER_ROTATION[i % WEATHER_ROTATION.length],
      activities: ACTIVITY_TEMPLATES.map((a) => ({ ...a }))
    };
  });
}

export async function generateItinerary(values: PlannerFormValues): Promise<Itinerary> {
  const start = new Date(values.startDate);
  const end = new Date(values.endDate);
  const totalDays = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);

  const itinerary: Itinerary = {
    destination: values.destination,
    country: '',
    startDate: values.startDate,
    endDate: values.endDate,
    totalDays,
    travelers: values.travelers,
    budget: values.budget,
    days: buildDays(values.destination, values.startDate, totalDays)
  };

  // A believable AI "thinking" delay, not an instant swap.
  return mockDelay(itinerary, 2200);
}
