import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export interface PageLayoutProps {
  children: ReactNode;
  className?: string;
  /** Set false for full-bleed pages (e.g. the landing page) that manage their own width per-section. */
  contained?: boolean;
  /** Vertical padding around the content — most inner pages want some, landing sections manage their own. */
  padded?: boolean;
}

/**
 * Every page previously hand-rolled its own `motion.div` fade-in wrapper
 * (see handoff notes) — that's consolidated here. Route-level pages
 * should wrap their content in this once, instead of repeating the
 * animation config.
 */
export function PageLayout({ children, className, contained = true, padded = true }: PageLayoutProps) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn('min-h-screen bg-page', padded && 'py-12', className)}
    >
      <div className={cn(contained && 'container mx-auto px-4 sm:px-6 lg:px-8')}>{children}</div>
    </motion.main>
  );
}
