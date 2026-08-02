import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CalendarClock, ArrowRight, MapPin } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { formatDateRange, daysUntil } from '../../../utils/date';
import type { Trip } from '../../../types/trip';

export interface UpcomingTripSpotlightProps {
  trip: Trip | undefined;
}

export function UpcomingTripSpotlight({ trip }: UpcomingTripSpotlightProps) {
  const navigate = useNavigate();

  if (!trip) {
    return (
      <Card variant="elevated" className="flex h-full flex-col items-start justify-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <MapPin className="size-5" />
        </span>
        <h3 className="font-display text-lg font-semibold text-dark">No upcoming trips yet</h3>
        <p className="text-sm text-gray-500">Describe a trip in a sentence and Naviora will draft the plan.</p>
        <Button size="sm" onClick={() => navigate('/trips')}>
          Plan a trip
        </Button>
      </Card>
    );
  }

  const countdown = daysUntil(trip.startDate);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="h-full"
    >
      <Card variant="elevated" padding="none" className="h-full overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto]">
          <div className="p-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
              <CalendarClock className="size-3.5" />
              Up next
            </span>

            <h3 className="mt-3 font-display text-2xl font-semibold text-dark">{trip.destination}</h3>
            <p className="text-sm text-gray-500">
              {trip.country} · {formatDateRange(trip.startDate, trip.endDate)} · {trip.totalDays} days
            </p>

            <Button size="sm" className="mt-5" rightIcon={<ArrowRight className="size-4" />} onClick={() => navigate(`/trips/${trip.id}`)}>
              View itinerary
            </Button>
          </div>

          <div className="flex flex-col items-center justify-center gap-1 border-t border-gray-100 bg-page px-8 py-6 sm:border-l sm:border-t-0">
            <span className="font-display text-4xl font-bold text-primary">{Math.max(countdown, 0)}</span>
            <span className="text-xs uppercase tracking-wide text-gray-400">
              {countdown <= 0 ? 'Underway' : countdown === 1 ? 'day to go' : 'days to go'}
            </span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
