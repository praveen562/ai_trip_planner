export interface JournalEntry {
  id: string;
  date: string; // ISO date
  title: string;
  note: string;
  location?: string;
}

/**
 * Mirrors the backend's ExpenseCategory enum (app/models/enums.py),
 * lowercased to match this codebase's domain-type convention (see
 * TripStatus). "lodging" is kept as an alias label for the backend's
 * HOTEL for friendlier display copy.
 */
export type ExpenseCategory =
  | 'food'
  | 'hotel'
  | 'transport'
  | 'shopping'
  | 'entertainment'
  | 'activities'
  | 'medical'
  | 'miscellaneous';

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
