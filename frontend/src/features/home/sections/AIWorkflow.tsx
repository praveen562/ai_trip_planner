import { motion } from 'framer-motion';
import { SectionTitle } from '../../../components/ui/SectionTitle';
import { WORKFLOW_STEPS } from '../../../constants/workflow';

export function AIWorkflow() {
  return (
    <section id="how-it-works" className="bg-gray-50/60 py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="How it works"
          title="Idea to itinerary, four steps"
        />

        <div className="relative mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Connecting line on desktop */}
          <div className="absolute left-0 right-0 top-6 hidden h-px bg-gray-200 lg:block" aria-hidden="true" />

          {WORKFLOW_STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <span className="relative z-10 flex size-12 items-center justify-center rounded-full bg-primary text-white shadow-md">
                <step.icon className="size-5" />
              </span>
              <p className="mt-4 font-mono text-xs uppercase tracking-wide text-primary">{step.label}</p>
              <h3 className="mt-1 font-display text-lg font-semibold text-dark">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
