import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MapPin, CloudSun, Route as RouteIcon, Check } from 'lucide-react';
import { Card } from '../../../components/ui/Card';

const STEPS = [
  { icon: Sparkles, label: 'Reading your preferences' },
  { icon: MapPin, label: 'Drafting your day-by-day plan' },
  { icon: CloudSun, label: 'Layering in the weather' },
  { icon: RouteIcon, label: 'Optimizing your route' }
];

/**
 * Advances through STEPS on its own timer — a rough approximation of
 * the real generation call's progress, not literal per-stage feedback
 * from the backend (that would require streaming, out of scope here).
 */
export function GeneratingState() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((step) => Math.min(step + 1, STEPS.length - 1));
    }, 550);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card variant="elevated" className="mx-auto max-w-md text-center">
      <motion.span
        animate={{ rotate: 360 }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
        className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary"
      >
        <Sparkles className="size-6" />
      </motion.span>

      <h2 className="mt-4 font-display text-lg font-semibold text-dark">Building your itinerary</h2>
      <p className="mt-1 text-sm text-gray-500">This usually takes a few seconds.</p>

      <div className="mt-6 space-y-3 text-left">
        {STEPS.map((step, i) => {
          const isDone = i < activeStep;
          const isActive = i === activeStep;

          return (
            <div key={step.label} className="flex items-center gap-3">
              <span
                className={`flex size-7 shrink-0 items-center justify-center rounded-full transition-colors ${
                  isDone ? 'bg-success/10 text-success' : isActive ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-300'
                }`}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isDone ? (
                    <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      <Check className="size-3.5" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="icon"
                      animate={isActive ? { scale: [1, 1.15, 1] } : {}}
                      transition={{ duration: 0.8, repeat: isActive ? Infinity : 0 }}
                    >
                      <step.icon className="size-3.5" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
              <span className={`text-sm ${isDone || isActive ? 'text-dark' : 'text-gray-400'}`}>{step.label}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
