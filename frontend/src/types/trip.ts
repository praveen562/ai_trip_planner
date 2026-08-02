export type TripStatus = 'upcoming' | 'active' | 'completed';

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
