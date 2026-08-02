import { Compass, MapPinned, Globe2 } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import type { DashboardStats } from '../dashboardService';

export interface StatsPanelProps {
  stats: DashboardStats;
}

const ROWS = (stats: DashboardStats) => [
  { icon: Compass, label: 'Active trips', value: stats.activeTrips },
  { icon: MapPinned, label: 'Trips planned', value: stats.totalTrips },
  { icon: Globe2, label: 'Countries visited', value: stats.countriesVisited }
];

export function StatsPanel({ stats }: StatsPanelProps) {
  return (
    <Card padding="none" className="h-full divide-y divide-gray-100">
      {ROWS(stats).map((row) => (
        <div key={row.label} className="flex items-center gap-3 px-6 py-4">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <row.icon className="size-4.5" />
          </span>
          <span className="flex-1 text-sm text-gray-500">{row.label}</span>
          <span className="font-display text-xl font-semibold text-dark">{row.value}</span>
        </div>
      ))}
    </Card>
  );
}
