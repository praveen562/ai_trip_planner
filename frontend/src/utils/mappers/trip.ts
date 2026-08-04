import type { Trip, TripStatus } from '../../types/trip';
import type { TripResponseDto } from '../../types/api/dto';

const STATUS_MAP: Record<TripResponseDto['status'], TripStatus> = {
  PLANNING: 'planning',
  UPCOMING: 'upcoming',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

function daysBetween(startIso: string, endIso: string): number {
  const ms = new Date(endIso).getTime() - new Date(startIso).getTime();
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)) + 1);
}

/**
 * The backend's Trip model has no `country` or cover-image field — the
 * former isn't collected (destination is one free-text field), and the
 * latter doesn't exist yet (only Places have Unsplash-enriched photos,
 * not the trip itself). Both are left blank/undefined here rather than
 * invented, and the UI already renders sensible fallbacks for both.
 */
export function mapTripResponse(dto: TripResponseDto): Trip {
  return {
    id: dto.id,
    destination: dto.destination_location,
    country: '',
    startDate: dto.start_date,
    endDate: dto.end_date,
    totalDays: daysBetween(dto.start_date, dto.end_date),
    status: STATUS_MAP[dto.status]
  };
}
