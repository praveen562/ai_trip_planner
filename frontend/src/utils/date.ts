const dateFormatter = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });
const dateFormatterWithYear = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export function formatDateRange(startIso: string, endIso: string): string {
  const start = new Date(startIso);
  const end = new Date(endIso);
  const sameYear = start.getFullYear() === end.getFullYear();
  return `${dateFormatter.format(start)} – ${sameYear ? dateFormatter.format(end) : dateFormatterWithYear.format(end)}`;
}

/** Whole days between now and a future ISO date; negative if the date has passed. */
export function daysUntil(iso: string): number {
  const now = new Date();
  const target = new Date(iso);
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.ceil((target.getTime() - now.getTime()) / msPerDay);
}
