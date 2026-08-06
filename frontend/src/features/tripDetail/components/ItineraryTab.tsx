import { motion } from 'framer-motion';
import { CalendarDays, AlertTriangle } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { SkeletonText } from '../../../components/ui/Loading';
import { useTripItinerary } from '../useTripDetail';

/**
 * The real backend stores the AI's output as one prose string (see
 * app/schemas/itinerary.py), not structured day/activity objects —
 * this renders the same best-effort day split (parseItineraryDays)
 * and card layout the AI Planner's result screen uses, rather than
 * the old mocked structured-itinerary shape.
 */
export function ItineraryTab({ tripId }: { tripId: string }) {
  const { data: days, isLoading, isError } = useTripItinerary(tripId);

  if (isLoading) {
    return (
      <Card className="space-y-3">
        <SkeletonText lines={5} />
      </Card>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-200 py-16 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-error/10 text-error">
          <AlertTriangle className="size-5" />
        </span>
        <p className="text-gray-500">Couldn't load the itinerary for this trip.</p>
      </div>
    );
  }

  if (!days) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-gray-200 py-16 text-center">
        <CalendarDays className="size-6 text-gray-300" />
        <p className="text-sm text-gray-400">No itinerary generated for this trip yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {days.map((day, i) => (
        <motion.div
          key={day.label + i}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
        >
          <Card padding="none" className="overflow-hidden">
            <div className="border-b border-gray-100 bg-page px-5 py-3">
              <p className="font-mono text-xs text-gray-400">{day.label}</p>
            </div>
            <div className="whitespace-pre-line px-5 py-4 text-sm leading-relaxed text-gray-700">
              {day.content}
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
