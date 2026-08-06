import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getTrip,
  getJournalEntries,
  addJournalEntry,
  getExpenses,
  getPackingItems,
  setPackingItemPacked,
  getSavedPlaces,
  getTripItinerary
} from './tripDetailService';

/** Trip header data — fetched immediately, independent of the active tab. */
export function useTripDetail(tripId: string | undefined) {
  return useQuery({
    queryKey: ['trip', tripId],
    queryFn: () => getTrip(tripId as string),
    enabled: Boolean(tripId)
  });
}

export function useJournalEntries(tripId: string) {
  return useQuery({
    queryKey: ['trip', tripId, 'journal'],
    queryFn: () => getJournalEntries(tripId),
    enabled: Boolean(tripId)
  });
}

export function useAddJournalEntry(tripId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (entry: { title: string; note: string }) => addJournalEntry(tripId, entry),
    onSuccess: (entry) => {
      queryClient.setQueryData(['trip', tripId, 'journal'], (prev: unknown) =>
        Array.isArray(prev) ? [entry, ...prev] : [entry]
      );
    }
  });
}

export function useExpenses(tripId: string) {
  return useQuery({
    queryKey: ['trip', tripId, 'expenses'],
    queryFn: () => getExpenses(tripId),
    enabled: Boolean(tripId)
  });
}

export function usePackingItems(tripId: string) {
  return useQuery({
    queryKey: ['trip', tripId, 'packing'],
    queryFn: () => getPackingItems(tripId),
    enabled: Boolean(tripId)
  });
}

export function useTogglePackingItem(tripId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, packed }: { id: string; packed: boolean }) => setPackingItemPacked(id, packed),
    onSuccess: (item) => {
      queryClient.setQueryData(['trip', tripId, 'packing'], (prev: unknown) =>
        Array.isArray(prev) ? prev.map((p) => (p.id === item.id ? item : p)) : prev
      );
    }
  });
}

export function useSavedPlaces(tripId: string) {
  return useQuery({
    queryKey: ['trip', tripId, 'places'],
    queryFn: () => getSavedPlaces(tripId),
    enabled: Boolean(tripId)
  });
}

export function useTripItinerary(tripId: string) {
  return useQuery({
    queryKey: ['trip', tripId, 'itinerary'],
    queryFn: () => getTripItinerary(tripId),
    enabled: Boolean(tripId)
  });
}
