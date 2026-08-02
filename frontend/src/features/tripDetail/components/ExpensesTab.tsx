import { Home, UtensilsCrossed, Car, Ticket, MoreHorizontal } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import type { Expense, ExpenseCategory } from '../../../types/tripDetail';

const CATEGORY_META: Record<ExpenseCategory, { label: string; icon: typeof Home }> = {
  lodging: { label: 'Lodging', icon: Home },
  food: { label: 'Food', icon: UtensilsCrossed },
  transport: { label: 'Transport', icon: Car },
  activities: { label: 'Activities', icon: Ticket },
  other: { label: 'Other', icon: MoreHorizontal }
};

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}

export function ExpensesTab({ expenses }: { expenses: Expense[] }) {
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
