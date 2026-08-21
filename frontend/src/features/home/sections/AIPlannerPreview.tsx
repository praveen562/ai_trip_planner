import { motion } from 'framer-motion';
import { Sparkles, Send } from 'lucide-react';
import { SectionTitle } from '../../../components/ui/SectionTitle';
import { Card } from '../../../components/ui/Card';

const GENERATED_DAYS = [
  { day: 'Day 1', plan: 'Arrive · settle in near Alfama · sunset at Miradouro das Portas do Sol' },
  { day: 'Day 2', plan: 'Belém Tower · Jerónimos Monastery · pastéis de nata, obviously' },
  { day: 'Day 3', plan: 'Day trip to Sintra · Pena Palace · Quinta da Regaleira' }
];

/**
 * A mocked preview of the actual planner — not wired to the real
 * Gemini-backed endpoint yet (that's Step 10). The prompt and output
 * below are static, but the interaction shape matches what the real
 * feature will do.
 */
export function AIPlannerPreview() {
  return (
    <section id="ai-planner" className="bg-gray-50/60 py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="See it in action"
          title="From one sentence to a full itinerary"
          description="This is the same interaction you'll get inside Naviora — describe the trip, get a real plan back."
        />

        <Card variant="elevated" padding="none" className="mx-auto mt-14 max-w-2xl overflow-hidden">
          <div className="flex items-center gap-2 border-b border-gray-100 px-6 py-4">
            <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Sparkles className="size-4" />
            </span>
            <span className="text-sm font-medium text-dark">Naviora AI Planner</span>
            <span className="ml-auto rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-500">
              Powered by Gemini
            </span>
          </div>

          <div className="space-y-5 px-6 py-6">
            {/* User prompt bubble */}
            <div className="ml-auto flex max-w-[85%] items-center gap-2 rounded-2xl rounded-tr-sm bg-primary px-4 py-3 text-sm text-white">
              A 3-day trip to Lisbon, mid-range budget, two travelers.
            </div>

            {/* AI response */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-[90%] rounded-2xl rounded-tl-sm border border-gray-100 bg-page px-4 py-4"
            >
              <p className="mb-3 text-sm font-medium text-dark">Here's a 3-day Lisbon itinerary:</p>
              <div className="space-y-2">
                {GENERATED_DAYS.map((d) => (
                  <div key={d.day} className="flex gap-3 text-sm">
                    <span className="w-12 shrink-0 font-mono text-xs text-gray-400">{d.day}</span>
                    <span className="text-gray-600">{d.plan}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="flex items-center gap-3 border-t border-gray-100 px-6 py-4">
            <div className="flex-1 rounded-xl border border-gray-200 bg-surface px-4 py-2.5 text-sm text-gray-400">
              Describe your next trip...
            </div>
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-white">
              <Send className="size-4" />
            </span>
          </div>
        </Card>
      </div>
    </section>
  );
}
