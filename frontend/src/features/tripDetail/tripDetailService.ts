import { isAxiosError } from 'axios';
import { apiClient } from '../../services/apiClient';
import { mapTripResponse } from '../../utils/mappers/trip';
import {
  mapJournalResponse,
  mapExpenseResponse,
  mapPackingItemResponse,
  mapTripPlaceResponse
} from '../../utils/mappers/tripDetail';
import { parseItineraryDays } from '../../utils/parseItineraryDays';
import type { Trip } from '../../types/trip';
import type { JournalEntry, Expense, PackingItem, SavedPlace } from '../../types/tripDetail';
import type { GeneratedItineraryDay } from '../../types/itinerary';
import type {
  TripResponseDto,
  JournalResponseDto,
  JournalCreateDto,
  ExpenseResponseDto,
  PackingItemResponseDto,
  TripPlaceListResponseDto,
  ItineraryResponseDto
} from '../../types/api/dto';

/**
 * Real per-resource calls, one per backend module (see project
 * handoff: Journal, Expenses, Packing, Saved Places, AI Itinerary).
 * Each tab fetches its own slice independently rather than one
 * combined trip-detail payload, since that's how the backend is
 * actually shaped — there's no single endpoint that returns all of
 * this together.
 */

export async function getTrip(tripId: string): Promise<Trip> {
  const { data } = await apiClient.get<TripResponseDto>(`/trips/${tripId}`);
  return mapTripResponse(data);
}

export async function getJournalEntries(tripId: string): Promise<JournalEntry[]> {
  const { data } = await apiClient.get<JournalResponseDto[]>(`/trips/${tripId}/journal`);
  return data.map(mapJournalResponse);
}

export async function addJournalEntry(
  tripId: string,
  entry: { title: string; note: string }
): Promise<JournalEntry> {
  const payload: JournalCreateDto = {
    title: entry.title,
    description: entry.note,
    journal_date: new Date().toISOString().slice(0, 10)
  };
  const { data } = await apiClient.post<JournalResponseDto>(`/trips/${tripId}/journal`, payload);
  return mapJournalResponse(data);
}

export async function getExpenses(tripId: string): Promise<Expense[]> {
  const { data } = await apiClient.get<ExpenseResponseDto[]>(`/trips/${tripId}/expenses`);
  return data.map(mapExpenseResponse);
}

export async function getPackingItems(tripId: string): Promise<PackingItem[]> {
  const { data } = await apiClient.get<PackingItemResponseDto[]>(`/trips/${tripId}/packing`);
  return data.map(mapPackingItemResponse);
}

export async function setPackingItemPacked(itemId: string, packed: boolean): Promise<PackingItem> {
  const { data } = await apiClient.patch<PackingItemResponseDto>(
    `/packing/${itemId}/${packed ? 'pack' : 'unpack'}`
  );
  return mapPackingItemResponse(data);
}

export async function getSavedPlaces(tripId: string): Promise<SavedPlace[]> {
  const { data } = await apiClient.get<TripPlaceListResponseDto>(`/trips/${tripId}/saved-places`);
  return data.places.map(mapTripPlaceResponse);
}

/**
 * A trip has no itinerary until the planner generates one, so a 404
 * here is a real, expected state (same pattern as profileService's
 * getProfile) — normalized to `null` rather than thrown.
 */
export async function getTripItinerary(tripId: string): Promise<GeneratedItineraryDay[] | null> {
  try {
    const { data } = await apiClient.get<ItineraryResponseDto>(`/trips/${tripId}/itinerary`);
    return parseItineraryDays(data.ai_response);
  } catch (err) {
    if (isAxiosError(err) && err.response?.status === 404) {
      return null;
    }
    throw err;
  }
}
