import { useState } from 'react';
import { Check } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { cn } from '../../../utils/cn';
import type { PackingItem } from '../../../types/tripDetail';

export function PackingTab({ items: initialItems }: { items: PackingItem[] }) {
  const [items, setItems] = useState(initialItems);

  const togglePacked = (id: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, packed: !item.packed } : item)));
  };

  const packedCount = items.filter((i) => i.packed).length;
  const progress = items.length ? Math.round((packedCount / items.length) * 100) : 0;

  const grouped = items.reduce<Record<string, PackingItem[]>>((acc, item) => {
    (acc[item.category] ??= []).push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">
            {packedCount} of {items.length} packed
          </span>
          <span className="font-medium text-primary">{progress}%</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </Card>

      {Object.entries(grouped).map(([category, categoryItems]) => (
        <div key={category}>
          <h3 className="mb-2 text-sm font-medium text-gray-500">{category}</h3>
          <Card padding="none" className="divide-y divide-gray-100">
            {categoryItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => togglePacked(item.id)}
                className="flex w-full items-center gap-3 px-5 py-3 text-left transition-colors hover:bg-gray-50"
              >
                <span
                  className={cn(
                    'flex size-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors',
                    item.packed ? 'border-primary bg-primary text-white' : 'border-gray-300'
                  )}
                >
                  {item.packed && <Check className="size-3.5" />}
                </span>
                <span className={cn('text-sm', item.packed ? 'text-gray-400 line-through' : 'text-dark')}>
                  {item.label}
                </span>
              </button>
            ))}
          </Card>
        </div>
      ))}
    </div>
  );
}
