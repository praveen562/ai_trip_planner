import { motion } from 'framer-motion';
import { Zap, GitMerge, LayoutGrid } from 'lucide-react';
import { SectionTitle } from '../../../components/ui/SectionTitle';

const REASONS = [
  {
    icon: Zap,
    title: 'Minutes, not evenings',
    description:
      'What used to be a dozen open tabs — flights, weather, "things to do near X" — collapses into one prompt.'
  },
  {
    icon: GitMerge,
    title: 'It stays current',
    description:
      'Weather and route data attach to your itinerary live, so the plan you check the morning of is still accurate.'
  },
  {
    icon: LayoutGrid,
    title: 'One app, whole trip',
    description: 'Itinerary, expenses, journal, and packing list — no more piecing a trip together across five apps.'
  }
];

export function WhyChooseUs() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
          <SectionTitle
            eyebrow="Why Naviora"
            title="Planning a trip shouldn't feel like a second job"
            description="Most planning tools give you a blank page and a search bar. Naviora gives you a starting plan you can actually use."
            align="left"
            className="mx-0"
          />

          <div className="space-y-8">
            {REASONS.map((reason, i) => (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.4, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="flex gap-4"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <reason.icon className="size-5" />
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold text-dark">{reason.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-gray-500">{reason.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
