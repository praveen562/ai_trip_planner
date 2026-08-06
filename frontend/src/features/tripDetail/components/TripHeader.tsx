import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { formatDateRange } from '../../../utils/date';
import type { Trip } from '../../../types/trip';

export function TripHeader({ trip }: { trip: Trip }) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <div className="overflow-hidden rounded-3xl">
      <div className="relative h-56 w-full sm:h-72">
        {trip.coverImageUrl && !imageFailed ? (
          <img
            src={trip.coverImageUrl}
            alt={trip.destination}
            onError={() => setImageFailed(true)}
            className="size-full object-cover"
          />
        ) : (
          <div className="size-full bg-gradient-to-br from-primary/50 via-secondary/40 to-accent/50" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/20 to-transparent" />

        <Link
          to="/dashboard"
          className="absolute left-5 top-5 flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-sm text-white backdrop-blur transition-colors hover:bg-white/25"
        >
          <ArrowLeft className="size-4" />
          Dashboard
        </Link>

        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
          <p className="font-mono text-xs text-white/70">
            {trip.country} · {formatDateRange(trip.startDate, trip.endDate)}
          </p>
          <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">{trip.destination}</h1>
          <p className="mt-1 text-sm text-white/70">{trip.totalDays} days</p>
        </div>
      </div>
    </div>
  );
}
