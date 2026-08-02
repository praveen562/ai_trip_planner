import { useQuery } from '@tanstack/react-query';
import { getTripDetail } from './tripDetailService';

export function useTripDetail(tripId: string | undefined) {
  return useQuery({
    queryKey: ['trip', tripId],
    queryFn: () => getTripDetail(tripId as string),
    enabled: Boolean(tripId)
  });
}
