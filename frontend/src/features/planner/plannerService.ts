import { apiClient } from '../../services/apiClient';
import { parseItineraryDays } from '../../utils/parseItineraryDays';
import type { PlannerFormValues } from './schemas';
import type { GeneratedItinerary } from '../../types/itinerary';
import type { TripCreateDto, TripResponseDto, ItineraryResponseDto } from '../../types/api/dto';

function toGeneratedItinerary(trip: TripResponseDto, itinerary: ItineraryResponseDto): GeneratedItinerary {
  return {
    itineraryId: itinerary.id,
    tripId: trip.id,
    title: itinerary.title,
    destination: trip.destination_location,
    sourceLocation: trip.source_location,
    startDate: trip.start_date,
    endDate: trip.end_date,
    totalDays: itinerary.total_days,
    isRegenerated: itinerary.is_regenerated,
    rawResponse: itinerary.ai_response,
    days: parseItineraryDays(itinerary.ai_response)
  };
}

/**
 * Two real calls, matching the backend exactly: a trip must exist
 * before an itinerary can be generated for it (see itinerary.py's
 * POST /trips/{trip_id}/itinerary/generate). The Gemini call itself
 * can take a while — no artificial delay needed here the way the
 * mocked version had one.
 */
export async function createTripAndGenerateItinerary(values: PlannerFormValues): Promise<GeneratedItinerary> {
  const tripPayload: TripCreateDto = {
    title: values.title,
    source_location: values.sourceLocation,
    destination_location: values.destination,
    start_date: values.startDate,
    end_date: values.endDate,
    budget: values.budget,
    travel_style: values.travelStyle,
    notes: values.notes
  };

  const { data: trip } = await apiClient.post<TripResponseDto>('/trips', tripPayload);

  const { data: itinerary } = await apiClient.post<ItineraryResponseDto>(
    `/trips/${trip.id}/itinerary/generate`,
    {
      travel_style: values.travelStyle,
      additional_notes: values.notes
    }
  );

  return toGeneratedItinerary(trip, itinerary);
}

export async function regenerateItinerary(
  itineraryId: string,
  tripId: string,
  values: PlannerFormValues
): Promise<GeneratedItinerary> {
  const { data: trip } = await apiClient.get<TripResponseDto>(`/trips/${tripId}`);

  const { data: itinerary } = await apiClient.post<ItineraryResponseDto>(
    `/itinerary/${itineraryId}/regenerate`,
    {
      travel_style: values.travelStyle,
      additional_notes: values.notes
    }
  );

  return toGeneratedItinerary(trip, itinerary);
}
