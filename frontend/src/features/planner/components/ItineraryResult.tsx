import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { RotateCcw, Save, Sparkles } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { formatDateRange } from '../../../utils/date';
import type { GeneratedItinerary } from '../../../types/itinerary';

export interface ItineraryResultProps {
  itinerary: GeneratedItinerary;
  onRegenerate: () => void;
  isRegenerating?: boolean;
}

export function ItineraryResult({ itinerary, onRegenerate, isRegenerating }: ItineraryResultProps) {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-2xl">
      {/* Header ticket, matching the Hero/AIPlannerPreview motif */}
      <Card variant="elevated" padding="none" className="overflow-hidden">
        <div className="flex items-center justify-between px-6 pt-6">
          <span className="flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
            <Sparkles className="size-3.5" />
            {itinerary.isRegenerated ? 'AI regenerated' : 'AI generated'}
          </span>
          <span className="font-mono text-xs text-gray-400">{itinerary.sourceLocation} → {itinerary.destination}</span>
        </div>

        <div className="px-6 pb-4 pt-3">
          <h2 className="font-display text-2xl font-semibold text-dark">{itinerary.title}</h2>
          <p className="mt-1 font-mono text-sm text-gray-500">
            {formatDateRange(itinerary.startDate, itinerary.endDate)} · {itinerary.totalDays} days
          </p>
        </div>

        <div className="relative my-1 flex items-center">
          <div className="absolute -left-2.5 size-5 rounded-full bg-page" />
          <div className="mx-2.5 h-px w-full border-t border-dashed border-gray-200" />
          <div className="absolute -right-2.5 size-5 rounded-full bg-page" />
        </div>

        <div className="flex gap-3 px-6 py-4">
          <Button
            size="sm"
            variant="outline"
            leftIcon={<RotateCcw className="size-4" />}
            onClick={onRegenerate}
            isLoading={isRegenerating}
          >
            Regenerate
          </Button>
          <Button size="sm" leftIcon={<Save className="size-4" />} onClick={() => navigate('/dashboard')}>
            Save trip
          </Button>
        </div>
      </Card>

      {/* Day-by-day breakdown — a best-effort split of the model's raw
          text response (see utils/parseItineraryDays), not structured
          data, so this renders as formatted prose rather than a timed
          activity table. */}
      <div className="mt-8 space-y-5">
        {itinerary.days.map((day, i) => (
          <motion.div
            key={day.label + i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
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
    </div>
  );
}
