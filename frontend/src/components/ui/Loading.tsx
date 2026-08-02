import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

/* ---------------------------------- Spinner ---------------------------------- */

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const spinnerSizes = { sm: 'size-4', md: 'size-6', lg: 'size-8' };

export function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <Loader2
      className={cn('animate-spin text-primary', spinnerSizes[size], className)}
      aria-label="Loading"
    />
  );
}

/* --------------------------------- Skeleton ---------------------------------- */

export interface SkeletonProps {
  variant?: 'text' | 'circle' | 'rect';
  width?: string | number;
  height?: string | number;
  className?: string;
}

/**
 * Shimmering placeholder shown while real content (itinerary cards,
 * profile data, images) is loading. Prefer this over spinners for any
 * content-shaped area — it previews layout and feels far less jarring
 * once the real content pops in.
 */
export function Skeleton({ variant = 'rect', width, height, className }: SkeletonProps) {
  const shapeStyles = {
    text: 'h-4 rounded-md',
    circle: 'rounded-full',
    rect: 'rounded-xl'
  };

  return (
    <div
      className={cn(
        'animate-pulse bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:200%_100%]',
        shapeStyles[variant],
        className
      )}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}

/** A few text lines of varying width — the most common skeleton shape. */
export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} variant="text" width={i === lines - 1 ? '60%' : '100%'} />
      ))}
    </div>
  );
}

/** Placeholder shaped like a Card, for grids of itinerary/place/trip tiles. */
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-2xl border border-gray-100 bg-surface p-6', className)}>
      <Skeleton variant="rect" height={160} className="mb-4" />
      <Skeleton variant="text" width="70%" className="mb-2" />
      <Skeleton variant="text" width="40%" />
    </div>
  );
}

/* -------------------------------- PageLoader ---------------------------------- */

/** Full-viewport loader for route-level suspense boundaries. */
export function PageLoader() {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}
