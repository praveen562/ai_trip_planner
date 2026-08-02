import { CloudSun } from 'lucide-react';
import { Card } from '../ui/Card';
import type { ItineraryDay } from '../../types/itinerary';

/**
 * Renders a single itinerary day (weather chip + timed activities).
 * Used by both the planner's generated-result view and the trip
 * detail page's Itinerary tab, so the two never drift apart.
 */
export function ItineraryDayCard({ day }: { day: ItineraryDay }) {
  return (
    <Card padding="none" className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-gray-100 bg-page px-5 py-3">
        <div>
          <p className="font-mono text-xs text-gray-400">Day {day.dayNumber}</p>
          <h3 className="font-display text-base font-semibold text-dark">{day.title}</h3>
        </div>
        <span className="flex items-center gap-1.5 text-xs text-gray-500">
          <CloudSun className="size-3.5" />
          {day.weatherSummary}
        </span>
      </div>

      <div className="divide-y divide-gray-50 px-5">
        {day.activities.map((activity) => (
          <div key={activity.time + activity.title} className="flex gap-4 py-3">
            <span className="w-16 shrink-0 font-mono text-xs text-gray-400">{activity.time}</span>
            <div>
              <p className="text-sm text-dark">{activity.title}</p>
              {activity.note && <p className="mt-0.5 text-xs text-gray-400">{activity.note}</p>}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
