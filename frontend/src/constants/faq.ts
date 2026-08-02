export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'How does the AI actually build an itinerary?',
    answer:
      'You describe your trip — destination, length, budget, pace — in plain language. Naviora turns that into a structured day-by-day plan, then layers in real weather and nearby places for each stop.'
  },
  {
    question: 'Can I edit what the AI generates?',
    answer:
      'Yes. The generated itinerary is a starting point, not a fixed plan — every day, stop, and note is editable, reorderable, and yours to change.'
  },
  {
    question: 'Does route optimization work for walking and cycling too?',
    answer: 'Yes — you can optimize a day’s route by driving, cycling, or walking profile, not just one.'
  },
  {
    question: 'Is my trip data private?',
    answer:
      'Your trips, journals, and expenses are tied to your account and never shown to other users. See our privacy policy for the full detail.'
  },
  {
    question: 'What does the free plan actually include?',
    answer:
      'Up to two active trips with full access to AI itinerary generation, weather, and nearby places — no credit card required.'
  }
];
