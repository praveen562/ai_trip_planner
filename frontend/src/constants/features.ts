import type { LucideIcon } from 'lucide-react';
import { Sparkles, CloudSun, MapPinned, Wallet, BookOpen, Route, ListChecks, FolderHeart } from 'lucide-react';

export interface FeatureItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

/**
 * Pulled directly from the backend modules that already exist
 * (see project handoff) rather than invented marketing filler —
 * every feature below has a real endpoint behind it once Step 10
 * connects the frontend to the API.
 */
export const FEATURES: FeatureItem[] = [
  {
    icon: Sparkles,
    title: 'AI itinerary generation',
    description: 'Describe your trip in a sentence — Naviora drafts a full day-by-day plan in seconds.'
  },
  {
    icon: CloudSun,
    title: 'Live weather, built in',
    description: 'Every itinerary day carries a real forecast, so packing and pacing decisions write themselves.'
  },
  {
    icon: MapPinned,
    title: 'Nearby places, curated',
    description: 'Discover spots near each stop, complete with photos, without leaving your itinerary.'
  },
  {
    icon: Route,
    title: 'Smart route optimization',
    description: 'Naviora orders your saved places into the most efficient route — driving, cycling, or on foot.'
  },
  {
    icon: Wallet,
    title: 'Expense tracking',
    description: 'Log spending per trip and see a running summary in your currency, automatically.'
  },
  {
    icon: BookOpen,
    title: 'Trip journal',
    description: 'A date-ordered timeline for the moments a spreadsheet can’t hold.'
  },
  {
    icon: ListChecks,
    title: 'Packing checklist',
    description: 'Pack, unpack, and track completion — per trip, so nothing gets left behind.'
  },
  {
    icon: FolderHeart,
    title: 'Save & organize trips',
    description: 'Every trip, every place, every plan — kept together and easy to find again.'
  }
];
