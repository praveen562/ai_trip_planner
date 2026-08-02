import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export interface SectionTitleProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
}

/**
 * Heading block reused across every landing-page section (Features,
 * Destinations, Testimonials, Pricing, FAQ...) so headline treatment
 * — the eyebrow label, Clash Display heading, and scroll-reveal motion
 * — stays identical everywhere instead of being re-implemented per page.
 */
export function SectionTitle({ eyebrow, title, description, align = 'center', className }: SectionTitleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn('max-w-2xl', align === 'center' && 'mx-auto text-center', className)}
    >
      {eyebrow && (
        <span className="mb-3 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-primary">
          {eyebrow}
        </span>
      )}
      <h2 className="font-display text-3xl font-semibold tracking-tight text-dark sm:text-4xl">
        {title}
      </h2>
      {description && <p className="mt-4 text-base text-gray-500 sm:text-lg">{description}</p>}
    </motion.div>
  );
}
