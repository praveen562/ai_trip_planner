import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import type { TargetAndTransition } from 'framer-motion';
import { Search, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';

/**
 * A stylized boarding-pass / ticket stub — the recurring signature
 * device for "this is your itinerary" moments across the product
 * (see typography.ts's routeCode style). The dashed divider and
 * perforation dots are built from CSS, no image asset needed.
 */
function ItineraryTicket({ className, tone = 'elevated' }: { className?: string; tone?: 'elevated' | 'glass' }) {
  return (
    <Card variant={tone} padding="none" className={className}>
      <div className="flex items-center justify-between px-5 pt-5">
        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
          AI generated
        </span>
        <Sparkles className="size-4 text-primary" />
      </div>

      <div className="px-5 pb-3 pt-4">
        <p className="font-mono text-xs tracking-wide text-gray-400">NVR · 014</p>
        <p className="font-display text-lg font-semibold text-dark">Kyoto ⇄ Osaka</p>
        <p className="mt-0.5 font-mono text-xs text-gray-500">5 days · Mid-range · 2 travelers</p>
      </div>

      {/* Perforated divider */}
      <div className="relative my-1 flex items-center">
        <div className="absolute -left-2.5 size-5 rounded-full bg-page" />
        <div className="mx-2.5 h-px w-full border-t border-dashed border-gray-200" />
        <div className="absolute -right-2.5 size-5 rounded-full bg-page" />
      </div>

      <div className="space-y-2.5 px-5 pb-5 pt-3">
        {[
          ['Day 1', 'Fushimi Inari · Nishiki Market'],
          ['Day 2', 'Arashiyama Bamboo Grove'],
          ['Day 3', 'Dotonbori · Osaka Castle']
        ].map(([day, plan]) => (
          <div key={day} className="flex items-center justify-between text-sm">
            <span className="font-mono text-xs text-gray-400">{day}</span>
            <span className="text-right text-gray-700">{plan}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function Hero() {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const [destination, setDestination] = useState('');

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    navigate('/register');
  };

  const floatAnimation: TargetAndTransition | undefined = shouldReduceMotion
    ? undefined
    : { y: [0, -10, 0], transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' } };

  return (
    <section className="relative overflow-hidden pb-24 pt-20 sm:pt-28">
      {/* Soft gradient backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(60% 50% at 80% 10%, rgba(37,99,235,0.10), transparent), radial-gradient(45% 40% at 10% 30%, rgba(6,182,212,0.08), transparent)'
        }}
      />

      <div className="container mx-auto grid grid-cols-1 items-center gap-16 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        {/* Left column — headline, copy, search */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="size-3.5" />
            AI-powered trip planning
          </span>

          <h1 className="font-display text-4xl font-bold leading-[1.1] tracking-tight text-dark sm:text-5xl lg:text-6xl">
            Your next trip, planned before your coffee gets cold.
          </h1>

          <p className="mt-6 max-w-lg text-lg text-gray-500">
            Tell Naviora where you're going. It drafts a full day-by-day itinerary — weather,
            nearby places, and an optimized route included — in seconds.
          </p>

          <form onSubmit={handleSearch} className="mt-8 flex max-w-lg flex-col gap-3 sm:flex-row">
            <Input
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Where do you want to go?"
              leftIcon={<Search className="size-4.5" />}
              className="sm:flex-1"
            />
            <Button type="submit" size="md" rightIcon={<ArrowRight className="size-4.5" />}>
              Plan my trip
            </Button>
          </form>

          <p className="mt-4 text-sm text-gray-400">No credit card required · Free plan available</p>
        </motion.div>

        {/* Right column — floating itinerary tickets */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto w-full max-w-sm lg:max-w-none"
        >
          <motion.div animate={floatAnimation} className="relative z-10">
            <ItineraryTicket />
          </motion.div>

          <motion.div
            animate={
              shouldReduceMotion
                ? undefined
                : ({
                    y: [0, 8, 0],
                    transition: { duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }
                  } satisfies TargetAndTransition)
            }
            className="absolute -bottom-8 -right-6 w-56 rotate-6 opacity-90 sm:w-64"
          >
            <ItineraryTicket tone="glass" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
