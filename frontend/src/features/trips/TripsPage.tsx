import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, Compass, Plus } from 'lucide-react';
import { PageLayout } from '../../components/layout/PageLayout';
import { Button } from '../../components/ui/Button';
import { Dialog } from '../../components/ui/Dialog';
import { SkeletonCard } from '../../components/ui/Loading';
import { TripCard } from '../dashboard/components/TripCard';
import { useTripsData, useDeleteTrip } from './useTripsData';
import type { Trip } from '../../types/trip';

function TripsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 px-6 py-16 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Compass className="size-6" />
      </span>
      <h3 className="mt-4 text-lg font-semibold text-dark">No trips yet</h3>
      <p className="mt-1.5 max-w-sm text-sm text-gray-500">
        Every trip you plan with Naviora will show up here — start with your first one.
      </p>
      <Button className="mt-5" onClick={onCreate}>
        Plan your first trip
      </Button>
    </div>
  );
}

export function TripsPage() {
  const navigate = useNavigate();
  const { data: trips, isLoading, isError } = useTripsData();
  const deleteTrip = useDeleteTrip();
  const [pendingDelete, setPendingDelete] = useState<Trip | null>(null);

  const handleConfirmDelete = () => {
    if (!pendingDelete) return;
    deleteTrip.mutate(pendingDelete.id, {
      onSettled: () => setPendingDelete(null)
    });
  };

  return (
    <PageLayout>
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-semibold text-dark">My Trips</h1>
          <p className="mt-1 text-gray-500">Every trip you've planned with Naviora, in one place.</p>
        </div>
        <Button leftIcon={<Plus className="size-4.5" />} onClick={() => navigate('/trips/new')}>
          New Trip
        </Button>
      </div>

      {isLoading && <TripsSkeleton />}

      {isError && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-200 py-16 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-error/10 text-error">
            <AlertTriangle className="size-5" />
          </span>
          <p className="text-gray-500">Couldn't load your trips. Please try again in a moment.</p>
        </div>
      )}

      {trips && trips.length === 0 && <EmptyState onCreate={() => navigate('/trips/new')} />}

      {trips && trips.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip, i) => (
            <motion.div
              key={trip.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: (i % 3) * 0.06, ease: [0.16, 1, 0.3, 1] }}
            >
              <TripCard trip={trip} onDelete={() => setPendingDelete(trip)} />
            </motion.div>
          ))}
        </div>
      )}

      <Dialog
        isOpen={pendingDelete !== null}
        onClose={() => setPendingDelete(null)}
        title="Delete this trip?"
        description={
          pendingDelete
            ? `This removes your trip to ${pendingDelete.destination} and its itinerary. This can't be undone.`
            : undefined
        }
        confirmLabel="Delete trip"
        tone="danger"
        isConfirming={deleteTrip.isPending}
        onConfirm={handleConfirmDelete}
      />
    </PageLayout>
  );
}
