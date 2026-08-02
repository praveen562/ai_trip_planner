import type { ItineraryDay } from './itinerary';
import type { Trip } from './trip';

export interface JournalEntry {
  id: string;
  date: string; // ISO date
  title: string;
  note: string;
}

export type ExpenseCategory = 'lodging' | 'food' | 'transport' | 'activities' | 'other';

export interface Expense {
  id: string;
  date: string;
  category: ExpenseCategory;
  label: string;
  amount: number;
  currency: string;
}

export interface PackingItem {
  id: string;
  label: string;
  category: string;
  packed: boolean;
}

export interface SavedPlace {
  id: string;
  name: string;
  category: string;
  imageUrl?: string;
}

export interface TripDetail extends Trip {
  days: ItineraryDay[];
  journal: JournalEntry[];
  expenses: Expense[];
  packing: PackingItem[];
  places: SavedPlace[];
}
