import type { LucideIcon } from 'lucide-react';
import { MessageSquareText, Wand2, MapPin, Rocket } from 'lucide-react';

export interface WorkflowStep {
  icon: LucideIcon;
  label: string;
  title: string;
  description: string;
}

export const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    icon: MessageSquareText,
    label: 'Step 1',
    title: 'Describe your trip',
    description: 'Destination, length, budget, pace — a sentence is enough to get started.'
  },
  {
    icon: Wand2,
    label: 'Step 2',
    title: 'AI drafts your itinerary',
    description: 'A full day-by-day plan appears in seconds, built around what you told it.'
  },
  {
    icon: MapPin,
    label: 'Step 3',
    title: 'Layer in the details',
    description: 'Weather, nearby places, and an optimized route attach to each day automatically.'
  },
  {
    icon: Rocket,
    label: 'Step 4',
    title: 'Save it and go',
    description: 'Adjust anything, then keep it all — trip, journal, expenses — in one place.'
  }
];
