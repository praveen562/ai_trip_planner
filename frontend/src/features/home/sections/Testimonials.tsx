import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { SectionTitle } from '../../../components/ui/SectionTitle';
import { Card } from '../../../components/ui/Card';
import { TESTIMONIALS } from '../../../constants/testimonials';

const AVATAR_TINTS = ['bg-primary', 'bg-secondary', 'bg-accent'];

export function Testimonials() {
  return (
    <section className="bg-gray-50/60 py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="Early feedback" title="What people are saying" />

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <Card className="h-full">
                <Quote className="size-6 text-primary/30" />
                <p className="mt-4 text-sm leading-relaxed text-gray-600">"{t.quote}"</p>
                <div className="mt-6 flex items-center gap-3">
                  <span
                    className={`flex size-10 items-center justify-center rounded-full text-sm font-semibold text-white ${AVATAR_TINTS[i % AVATAR_TINTS.length]}`}
                  >
                    {t.initials}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-dark">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
