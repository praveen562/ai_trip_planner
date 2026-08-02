import { AlertTriangle } from 'lucide-react';
import { PageLayout } from '../../components/layout/PageLayout';
import { SkeletonCard, Skeleton } from '../../components/ui/Loading';
import { WelcomeHeader } from './components/WelcomeHeader';
import { UpcomingTripSpotlight } from './components/UpcomingTripSpotlight';
import { StatsPanel } from './components/StatsPanel';
import { TripsGrid } from './components/TripsGrid';
import { useDashboardData } from './useDashboardData';
import type { Trip } from '../../types/trip';

// Placeholder until Step 10 wires up real auth/session state.
const CURRENT_USER_NAME = 'Jordan Rivera';

function nextUpcomingTrip(trips: Trip[] | undefined): Trip | undefined {
  if (!trips) return undefined;
  return [...trips]
    .filter((t) => t.status === 'upcoming')
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())[0];
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton variant="text" width={220} height={28} className="mb-2" />
          <Skeleton variant="text" width={160} />
        </div>
        <Skeleton variant="rect" width={140} height={44} />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Skeleton variant="rect" height={160} className="lg:col-span-2" />
        <Skeleton variant="rect" height={160} />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
}

export function DashboardPage() {
  const { data, isLoading, isError } = useDashboardData();

  return (
    <PageLayout>
      {isLoading && <DashboardSkeleton />}

      {isError && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-200 py-16 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-error/10 text-error">
            <AlertTriangle className="size-5" />
          </span>
          <p className="text-gray-500">Couldn't load your dashboard. Please try again in a moment.</p>
        </div>
      )}

      {data && (
        <div className="space-y-8">
          <WelcomeHeader name={CURRENT_USER_NAME} />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <UpcomingTripSpotlight trip={nextUpcomingTrip(data.trips)} />
            </div>
            <StatsPanel stats={data.stats} />
          </div>

          <div>
            <h2 className="mb-4 font-display text-xl font-semibold text-dark">Your trips</h2>
            <TripsGrid trips={data.trips} />
          </div>
        </div>
      )}
    </PageLayout>
  );
}
