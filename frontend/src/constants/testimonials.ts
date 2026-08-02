export interface Testimonial {
  name: string;
  role: string;
  quote: string;
  initials: string;
}

/**
 * Placeholder voices for the pre-launch landing page — initials-based
 * avatars rather than stock photos of "customers" that don't exist yet.
 * Swap for real customer quotes (with photos, if they consent) once
 * Naviora has users to ask.
 */
export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Amara O.',
    role: 'Solo traveler',
    quote:
      'I gave it one sentence about a trip to Portugal and had a full itinerary before I finished my coffee. Rearranging days was just as fast.',
    initials: 'AO'
  },
  {
    name: 'Daniel K.',
    role: 'Plans for the whole family',
    quote:
      'The route optimization alone paid for itself — no more backtracking across a city because we saved places in a random order.',
    initials: 'DK'
  },
  {
    name: 'Priya N.',
    role: 'Frequent business traveler',
    quote:
      'Weather baked right into each day of the plan sounds small until you’re packing at 11pm and it just... already knows.',
    initials: 'PN'
  }
];
