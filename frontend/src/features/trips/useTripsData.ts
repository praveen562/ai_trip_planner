import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { listTrips, deleteTrip } from './tripsService';

export function useTripsData() {
  return useQuery({
    queryKey: ['trips'],
    queryFn: listTrips
  });
}

export function useDeleteTrip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTrip,
    onSuccess: () => {
      // Dashboard reads from the same /trips list, so both caches need
      // to reflect the deletion rather than just this page's.
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    }
  });
}
