import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { PageLayout } from '../../components/layout/PageLayout';
import { Skeleton } from '../../components/ui/Loading';
import { TripHeader } from './components/TripHeader';
import { TabNav } from './components/TabNav';
import type { TripTab } from './components/TabNav';
import { ItineraryTab } from './components/ItineraryTab';
import { JournalTab } from './components/JournalTab';
import { ExpensesTab } from './components/ExpensesTab';
import { PackingTab } from './components/PackingTab';
import { PlacesTab } from './components/PlacesTab';
import { useTripDetail } from './useTripDetail';

function TripDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton variant="rect" height={288} className="rounded-3xl" />
      <Skeleton variant="rect" height={44} />
      <Skeleton variant="rect" height={200} />
    </div>
  );
}

export function TripDetailPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const { data: trip, isLoading, isError } = useTripDetail(tripId);
  const [activeTab, setActiveTab] = useState<TripTab>('itinerary');

  return (
    <PageLayout>
      {isLoading && <TripDetailSkeleton />}

      {isError && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-200 py-16 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-error/10 text-error">
            <AlertTriangle className="size-5" />
          </span>
          <p className="text-gray-500">We couldn't find that trip.</p>
          <Link to="/dashboard" className="text-sm font-medium text-primary hover:text-primary-dark">
            Back to dashboard
          </Link>
        </div>
      )}

      {trip && (
        <div className="space-y-6">
          <TripHeader trip={trip} />
          <TabNav active={activeTab} onChange={setActiveTab} />

          <div>
            {activeTab === 'itinerary' && <ItineraryTab days={trip.days} />}
            {activeTab === 'journal' && <JournalTab entries={trip.journal} />}
            {activeTab === 'expenses' && <ExpensesTab expenses={trip.expenses} />}
            {activeTab === 'packing' && <PackingTab items={trip.packing} />}
            {activeTab === 'places' && <PlacesTab places={trip.places} />}
          </div>
        </div>
      )}
    </PageLayout>
  );
}
