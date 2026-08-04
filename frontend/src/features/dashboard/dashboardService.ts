import { apiClient } from '../../services/apiClient';
import { mapTripResponse } from '../../utils/mappers/trip';
import type { TripResponseDto } from '../../types/api/dto';
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

export async function getDashboardData(): Promise<DashboardData> {
  const { data } = await apiClient.get<TripResponseDto[]>('/trips');
  const trips = data.map(mapTripResponse);

  return {
    trips,
    stats: {
      activeTrips: trips.filter((t) => t.status === 'upcoming' || t.status === 'active').length,
      totalTrips: trips.length,
      // The backend doesn't track country separately from destination
      // (see mapTripResponse), so there's nothing reliable to count
      // distinct countries from yet — shown as trip count instead.
      countriesVisited: new Set(trips.map((t) => t.destination)).size
    }
  };
}
