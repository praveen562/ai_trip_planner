export type TripStatus = 'planning' | 'upcoming' | 'active' | 'completed' | 'cancelled';

export interface Trip {
  id: string;
  destination: string;
  country: string;
  startDate: string; // ISO date
  endDate: string; // ISO date
  totalDays: number;
  status: TripStatus;
  coverImageUrl?: string;
}
