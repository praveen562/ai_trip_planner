import { apiClient } from '../../services/apiClient';
import { mapTripResponse } from '../../utils/mappers/trip';
import type { TripResponseDto } from '../../types/api/dto';
import type { Trip } from '../../types/trip';

export async function listTrips(): Promise<Trip[]> {
  const { data } = await apiClient.get<TripResponseDto[]>('/trips');
  return data.map(mapTripResponse);
}

/** Backend soft-deletes the trip (see trips.py's delete_trip). */
export async function deleteTrip(tripId: string): Promise<void> {
  await apiClient.delete(`/trips/${tripId}`);
}
