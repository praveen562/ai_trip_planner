import { Home, UtensilsCrossed, Car, ShoppingBag, Clapperboard, Ticket, HeartPulse, MoreHorizontal, AlertTriangle } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { SkeletonText } from '../../../components/ui/Loading';
import { useExpenses } from '../useTripDetail';
import type { ExpenseCategory } from '../../../types/tripDetail';

const CATEGORY_META: Record<ExpenseCategory, { label: string; icon: typeof Home }> = {
  food: { label: 'Food', icon: UtensilsCrossed },
  hotel: { label: 'Lodging', icon: Home },
  transport: { label: 'Transport', icon: Car },
  shopping: { label: 'Shopping', icon: ShoppingBag },
  entertainment: { label: 'Entertainment', icon: Clapperboard },
  activities: { label: 'Activities', icon: Ticket },
  medical: { label: 'Medical', icon: HeartPulse },
  miscellaneous: { label: 'Other', icon: MoreHorizontal }
};

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}

export function ExpensesTab({ tripId }: { tripId: string }) {
  const { data: expenses, isLoading, isError } = useExpenses(tripId);

  if (isLoading) {
    return (
      <Card className="space-y-3">
        <SkeletonText lines={4} />
      </Card>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-200 py-16 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-error/10 text-error">
          <AlertTriangle className="size-5" />
        </span>
        <p className="text-gray-500">Couldn't load expenses for this trip.</p>
      </div>
    );
  }

  if (!expenses || expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-gray-200 py-16 text-center">
        <p className="text-sm text-gray-400">No expenses logged yet.</p>
      </div>
    );
  }

  const currency = expenses[0]?.currency ?? 'USD';
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  const byCategory = expenses.reduce<Record<string, number>>((acc, e) => {
    acc[e.category] = (acc[e.category] ?? 0) + e.amount;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <Card variant="elevated" className="flex flex-wrap items-center justify-between gap-6">
        <div>
          <p className="text-sm text-gray-500">Total spent</p>
          <p className="font-display text-3xl font-bold text-dark">{formatCurrency(total, currency)}</p>
        </div>

        <div className="flex flex-wrap gap-5">
          {Object.entries(byCategory).map(([category, amount]) => {
            const meta = CATEGORY_META[category as ExpenseCategory];
            return (
              <div key={category} className="flex items-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <meta.icon className="size-4" />
                </span>
                <div>
                  <p className="text-xs text-gray-400">{meta.label}</p>
                  <p className="text-sm font-medium text-dark">{formatCurrency(amount, currency)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card padding="none" className="divide-y divide-gray-100">
        {expenses.map((expense) => {
          const meta = CATEGORY_META[expense.category];
          return (
            <div key={expense.id} className="flex items-center gap-3 px-6 py-4">
              <span className="flex size-9 items-center justify-center rounded-lg bg-gray-50 text-gray-500">
                <meta.icon className="size-4" />
              </span>
              <div className="flex-1">
                <p className="text-sm font-medium text-dark">{expense.label}</p>
                <p className="text-xs text-gray-400">{meta.label}</p>
              </div>
              <span className="font-mono text-sm text-dark">{formatCurrency(expense.amount, expense.currency)}</span>
            </div>
          );
        })}
      </Card>
    </div>
  );
}
