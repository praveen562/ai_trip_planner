import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { formatDateRange } from '../../../utils/date';
import type { Trip } from '../../../types/trip';
import { cn } from '../../../utils/cn';

const STATUS_STYLES: Record<Trip['status'], string> = {
  planning: 'bg-gray-100 text-gray-500',
  upcoming: 'bg-primary/10 text-primary',
  active: 'bg-success/10 text-success',
  completed: 'bg-gray-100 text-gray-500',
  cancelled: 'bg-error/10 text-error'
};

const STATUS_LABELS: Record<Trip['status'], string> = {
  planning: 'Planning',
  upcoming: 'Upcoming',
  active: 'In progress',
  completed: 'Completed',
  cancelled: 'Cancelled'
};

export interface TripCardProps {
  trip: Trip;
  /** When provided, shows a delete action on the card (used on the My Trips page). */
  onDelete?: (tripId: string) => void;
}

export function TripCard({ trip, onDelete }: TripCardProps) {
  const navigate = useNavigate();
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <Card
      interactive
      padding="none"
      className="cursor-pointer overflow-hidden"
      onClick={() => navigate(`/trips/${trip.id}`)}
    >
      <div className="relative h-36 w-full">
        {trip.coverImageUrl && !imageFailed ? (
          <img
            src={trip.coverImageUrl}
            alt={trip.destination}
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="size-full object-cover"
          />
        ) : (
          <div className="size-full bg-gradient-to-br from-sky-400/60 via-blue-500/40 to-cyan-400/50" />
        )}

        <span
          className={cn(
            'absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs font-medium backdrop-blur',
            STATUS_STYLES[trip.status]
          )}
        >
          {STATUS_LABELS[trip.status]}
        </span>

        {onDelete && (
          <button
            type="button"
            aria-label={`Delete trip to ${trip.destination}`}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(trip.id);
            }}
            className="absolute left-3 top-3 flex size-8 items-center justify-center rounded-full bg-white/80 text-gray-500 backdrop-blur transition-colors hover:bg-white hover:text-error"
          >
            <Trash2 className="size-4" />
          </button>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-lg font-semibold text-dark">{trip.destination}</h3>
        <p className="mt-1 text-sm text-gray-500">
          {trip.country ? `${trip.country} · ` : ''}
          {formatDateRange(trip.startDate, trip.endDate)}
        </p>
        <p className="mt-1 font-mono text-xs text-gray-400">{trip.totalDays} days</p>
      </div>
    </Card>
  );
}
