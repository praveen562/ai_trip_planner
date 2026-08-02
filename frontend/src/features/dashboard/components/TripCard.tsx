import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { formatDateRange } from '../../../utils/date';
import type { Trip } from '../../../types/trip';
import { cn } from '../../../utils/cn';

const STATUS_STYLES: Record<Trip['status'], string> = {
  upcoming: 'bg-primary/10 text-primary',
  active: 'bg-success/10 text-success',
  completed: 'bg-gray-100 text-gray-500'
};

const STATUS_LABELS: Record<Trip['status'], string> = {
  upcoming: 'Upcoming',
  active: 'In progress',
  completed: 'Completed'
};

export function TripCard({ trip }: { trip: Trip }) {
  const navigate = useNavigate();
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <Card
      interactive
      padding="none"
      className="cursor-pointer overflow-hidden"
      onClick={() => navigate('/trips')}
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
          <div className="size-full bg-gradient-to-br from-primary/40 via-secondary/30 to-accent/40" />
        )}

        <span
          className={cn(
            'absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs font-medium backdrop-blur',
            STATUS_STYLES[trip.status]
          )}
        >
          {STATUS_LABELS[trip.status]}
        </span>
      </div>

      <div className="p-5">
        <h3 className="font-display text-lg font-semibold text-dark">{trip.destination}</h3>
        <p className="mt-1 text-sm text-gray-500">
          {trip.country} · {formatDateRange(trip.startDate, trip.endDate)}
        </p>
        <p className="mt-1 font-mono text-xs text-gray-400">{trip.totalDays} days</p>
      </div>
    </Card>
  );
}
