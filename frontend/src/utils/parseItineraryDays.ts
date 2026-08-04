import type { GeneratedItineraryDay } from '../types/itinerary';

/**
 * The backend's prompt (see itinerary_service.py's _build_prompt) asks
 * Gemini for "Day 1\nMorning\nAfternoon\nEvening\n\nDay 2\n...", but it's
 * still free-form text — this is a best-effort split on lines that look
 * like a day heading, not a guaranteed-correct parse. If no day
 * headings are found at all, the whole response comes back as one
 * section so nothing is silently dropped.
 */
const DAY_HEADING_PATTERN = /^\s*(day\s*\d+)\s*[:.-]?\s*(.*)$/i;

export function parseItineraryDays(rawResponse: string): GeneratedItineraryDay[] {
  const lines = rawResponse.split('\n');
  const days: GeneratedItineraryDay[] = [];
  let currentLabel: string | null = null;
  let currentLines: string[] = [];

  const flush = () => {
    if (currentLabel !== null) {
      days.push({ label: currentLabel, content: currentLines.join('\n').trim() });
    }
  };

  for (const line of lines) {
    const match = line.match(DAY_HEADING_PATTERN);
    if (match) {
      flush();
      currentLabel = match[1].replace(/\s+/g, ' ').trim();
      currentLines = match[2].trim() ? [match[2].trim()] : [];
    } else if (currentLabel !== null) {
      currentLines.push(line);
    }
  }
  flush();

  if (days.length === 0) {
    return [{ label: 'Itinerary', content: rawResponse.trim() }];
  }

  return days;
}
