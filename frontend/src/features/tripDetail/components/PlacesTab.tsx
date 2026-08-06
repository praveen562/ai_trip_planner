import { useState } from 'react';
import { MapPin, AlertTriangle } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { SkeletonCard } from '../../../components/ui/Loading';
import { useSavedPlaces } from '../useTripDetail';
import type { SavedPlace } from '../../../types/tripDetail';

function PlaceTile({ place }: { place: SavedPlace }) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = place.imageUrl && !imageFailed;

  return (
    <Card padding="none" interactive className="overflow-hidden">
      <div className="relative h-32 w-full">
        {showImage ? (
          <img
            src={place.imageUrl}
            alt={place.name}
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="size-full object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-gradient-to-br from-primary/30 via-secondary/20 to-accent/30">
            <MapPin className="size-6 text-primary/60" />
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-sm font-semibold text-dark">{place.name}</h3>
        <p className="text-xs text-gray-400">{place.category}</p>
      </div>
    </Card>
  );
}

export function PlacesTab({ tripId }: { tripId: string }) {
  const { data: places, isLoading, isError } = useSavedPlaces(tripId);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-200 py-16 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-error/10 text-error">
          <AlertTriangle className="size-5" />
        </span>
        <p className="text-gray-500">Couldn't load saved places for this trip.</p>
      </div>
    );
  }

  if (!places || places.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-gray-200 py-16 text-center">
        <MapPin className="size-6 text-gray-300" />
        <p className="text-sm text-gray-400">No saved places yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {places.map((place) => (
        <PlaceTile key={place.id} place={place} />
      ))}
    </div>
  );
}
