import type { Trip } from '../../types/trip';

export interface DashboardStats {
  activeTrips: number;
  totalTrips: number;
  countriesVisited: number;
}

export interface DashboardData {
  trips: Trip[];
  stats: DashboardStats;
}

/**
 * Mocked for now, same pattern as authService — the real Trips CRUD
 * and Expenses-summary endpoints already exist on the backend (see
 * project handoff), and Step 10 swaps this implementation for real
 * axios/react-query calls without touching any component that uses it.
 */
function mockDelay<T>(value: T, ms = 500): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

const MOCK_TRIPS: Trip[] = [
  {
    id: 'trip-1',
    destination: 'Kyoto',
    country: 'Japan',
    startDate: '2026-10-12',
    endDate: '2026-10-19',
    totalDays: 7,
    status: 'upcoming',
    coverImageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80'
  },
  {
    id: 'trip-2',
    destination: 'Lisbon',
    country: 'Portugal',
    startDate: '2026-06-02',
    endDate: '2026-06-05',
    totalDays: 3,
    status: 'completed',
    coverImageUrl: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&q=80'
  },
  {
    id: 'trip-3',
    destination: 'Ubud',
    country: 'Indonesia',
    startDate: '2025-12-20',
    endDate: '2025-12-28',
    totalDays: 8,
    status: 'completed',
    coverImageUrl: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80'
  }
];

export async function getDashboardData(): Promise<DashboardData> {
  return mockDelay({
    trips: MOCK_TRIPS,
    stats: {
      activeTrips: MOCK_TRIPS.filter((t) => t.status === 'upcoming').length,
      totalTrips: MOCK_TRIPS.length,
      countriesVisited: new Set(MOCK_TRIPS.map((t) => t.country)).size
    }
  });
}
