import type { TripDetail } from '../../types/tripDetail';
import type { Trip } from '../../types/trip';

/**
 * Mocked, same pattern as authService/dashboardService/plannerService.
 * Every section here (itinerary, journal, expenses, packing, places)
 * has a real, already-built backend module behind it — see the
 * project handoff. Step 10 replaces this with real per-trip fetches;
 * TripDetailPage and its tabs don't change shape.
 */
function mockDelay<T>(value: T, ms = 500): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

const BASE_TRIPS: Record<string, Trip> = {
  'trip-1': {
    id: 'trip-1',
    destination: 'Kyoto',
    country: 'Japan',
    startDate: '2026-10-12',
    endDate: '2026-10-19',
    totalDays: 7,
    status: 'upcoming',
    coverImageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&q=80'
  },
  'trip-2': {
    id: 'trip-2',
    destination: 'Lisbon',
    country: 'Portugal',
    startDate: '2026-06-02',
    endDate: '2026-06-05',
    totalDays: 3,
    status: 'completed',
    coverImageUrl: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=1200&q=80'
  },
  'trip-3': {
    id: 'trip-3',
    destination: 'Ubud',
    country: 'Indonesia',
    startDate: '2025-12-20',
    endDate: '2025-12-28',
    totalDays: 8,
    status: 'completed',
    coverImageUrl: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=1200&q=80'
  }
};

function buildItinerary(trip: Trip) {
  const start = new Date(trip.startDate);
  return Array.from({ length: trip.totalDays }, (_, i) => {
    const date = new Date(start);
    date.setDate(date.getDate() + i);
    return {
      dayNumber: i + 1,
      date: date.toISOString().slice(0, 10),
      title:
        i === 0
          ? `Arrive in ${trip.destination}`
          : i === trip.totalDays - 1
            ? `Last day in ${trip.destination}`
            : `Exploring ${trip.destination}`,
      weatherSummary: ['Sunny, 24°C', 'Partly cloudy, 21°C', 'Clear skies, 26°C'][i % 3],
      activities: [
        { time: '9:00 AM', title: 'Explore the historic center', note: 'Start early to beat the crowds.' },
        { time: '12:30 PM', title: 'Lunch at a local favorite' },
        { time: '3:00 PM', title: 'Visit a landmark or museum' },
        { time: '7:00 PM', title: 'Dinner and an evening walk' }
      ]
    };
  });
}

function buildDetail(trip: Trip): TripDetail {
  return {
    ...trip,
    days: buildItinerary(trip),
    journal: [
      { id: 'j1', date: trip.startDate, title: 'Landed!', note: 'Long flight, but the first views did not disappoint.' },
      {
        id: 'j2',
        date: trip.startDate,
        title: 'First impressions',
        note: `${trip.destination} already feels different from photos — quieter, greener.`
      }
    ],
    expenses: [
      { id: 'e1', date: trip.startDate, category: 'lodging', label: 'Hotel (3 nights)', amount: 340, currency: 'USD' },
      { id: 'e2', date: trip.startDate, category: 'food', label: 'Dinner', amount: 42, currency: 'USD' },
      { id: 'e3', date: trip.startDate, category: 'transport', label: 'Airport transfer', amount: 28, currency: 'USD' },
      { id: 'e4', date: trip.startDate, category: 'activities', label: 'Guided walking tour', amount: 55, currency: 'USD' }
    ],
    packing: [
      { id: 'p1', label: 'Passport', category: 'Documents', packed: true },
      { id: 'p2', label: 'Travel adapter', category: 'Documents', packed: true },
      { id: 'p3', label: 'Rain jacket', category: 'Clothing', packed: false },
      { id: 'p4', label: 'Walking shoes', category: 'Clothing', packed: true },
      { id: 'p5', label: 'Phone charger', category: 'Electronics', packed: false },
      { id: 'p6', label: 'Camera', category: 'Electronics', packed: false }
    ],
    places: [
      {
        id: 'pl1',
        name: `${trip.destination} Old Town`,
        category: 'Landmark',
        imageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&q=80'
      },
      {
        id: 'pl2',
        name: 'Local Market',
        category: 'Food',
        imageUrl: 'https://images.unsplash.com/photo-1553603227-2358aabe821e?w=600&q=80'
      },
      { id: 'pl3', name: 'Riverside Walk', category: 'Nature' }
    ]
  };
}

export async function getTripDetail(tripId: string): Promise<TripDetail> {
  const trip = BASE_TRIPS[tripId];
  if (!trip) {
    throw new Error('Trip not found');
  }
  return mockDelay(buildDetail(trip));
}
