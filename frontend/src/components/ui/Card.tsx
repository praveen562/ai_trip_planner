import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export type CardVariant = 'default' | 'elevated' | 'glass' | 'outline';

export interface CardProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    'ref' | 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart'
  > {
  variant?: CardVariant;
  interactive?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const variantStyles: Record<CardVariant, string> = {
  default: 'bg-surface border border-gray-100 shadow-sm',
  elevated: 'bg-surface shadow-lg',
  outline: 'bg-transparent border border-gray-200',
  // Use sparingly — glassmorphism only where it earns its place
  // (floating hero cards, overlays on imagery), per the design brief.
  glass: 'bg-white/60 backdrop-blur-xl border border-white/40 shadow-lg'
};

const paddingStyles: Record<NonNullable<CardProps['padding']>, string> = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8'
};

/**
 * Base surface used throughout Naviora — feature tiles, itinerary
 * entries, floating hero elements. `interactive` adds a gentle lift on
 * hover so cards never feel static in a product about motion (trips).
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', interactive = false, padding = 'md', className, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        whileHover={
          interactive ? { y: -4, boxShadow: '0 20px 40px hsl(222deg 47% 11% / 0.10)' } : undefined
        }
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          'rounded-2xl',
          variantStyles[variant],
          paddingStyles[padding],
          interactive && 'cursor-pointer',
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';
