import { NotebookPen, Wallet, ListChecks, MapPinned, CalendarDays } from 'lucide-react';
import { cn } from '../../../utils/cn';

export type TripTab = 'itinerary' | 'journal' | 'expenses' | 'packing' | 'places';

const TABS: Array<{ id: TripTab; label: string; icon: typeof CalendarDays }> = [
  { id: 'itinerary', label: 'Itinerary', icon: CalendarDays },
  { id: 'journal', label: 'Journal', icon: NotebookPen },
  { id: 'expenses', label: 'Expenses', icon: Wallet },
  { id: 'packing', label: 'Packing', icon: ListChecks },
  { id: 'places', label: 'Places', icon: MapPinned }
];

export function TabNav({ active, onChange }: { active: TripTab; onChange: (tab: TripTab) => void }) {
  return (
    <div className="flex gap-1 overflow-x-auto border-b border-gray-100">
      {TABS.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              'flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors',
              isActive ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-dark'
            )}
          >
            <tab.icon className="size-4" />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
