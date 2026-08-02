import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus, Compass } from 'lucide-react';
import { TripCard } from './TripCard';
import { Button } from '../../../components/ui/Button';
import type { Trip } from '../../../types/trip';

export interface TripsGridProps {
  trips: Trip[];
}

function AddTripTile() {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      onClick={() => navigate('/trips')}
      className="flex min-h-[220px] flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400 transition-colors hover:border-primary hover:text-primary"
    >
      <Plus className="size-6" />
      <span className="text-sm font-medium">Plan a new trip</span>
    </button>
  );
}

function EmptyTrips() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 px-6 py-16 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Compass className="size-6" />
      </span>
      <h3 className="mt-4 font-display text-lg font-semibold text-dark">No trips yet</h3>
      <p className="mt-1.5 max-w-sm text-sm text-gray-500">
        Describe your next trip in a sentence and Naviora will draft a full itinerary for you.
      </p>
      <Button className="mt-5" onClick={() => navigate('/trips')}>
        Plan your first trip
      </Button>
    </div>
  );
}

export function TripsGrid({ trips }: TripsGridProps) {
  if (trips.length === 0) {
    return <EmptyTrips />;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {trips.map((trip, i) => (
        <motion.div
          key={trip.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: (i % 3) * 0.06, ease: [0.16, 1, 0.3, 1] }}
        >
          <TripCard trip={trip} />
        </motion.div>
      ))}
      <AddTripTile />
    </div>
  );
}
