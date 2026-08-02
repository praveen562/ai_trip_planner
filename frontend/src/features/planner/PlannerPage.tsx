import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PageLayout } from '../../components/layout/PageLayout';
import { PlannerForm } from './components/PlannerForm';
import { GeneratingState } from './components/GeneratingState';
import { ItineraryResult } from './components/ItineraryResult';
import { generateItinerary } from './plannerService';
import type { PlannerFormValues } from './schemas';
import type { Itinerary } from '../../types/itinerary';

type PlannerStep = 'form' | 'generating' | 'result' | 'error';

export function PlannerPage() {
  const [step, setStep] = useState<PlannerStep>('form');
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [lastValues, setLastValues] = useState<PlannerFormValues | null>(null);

  const runGeneration = async (values: PlannerFormValues) => {
    setLastValues(values);
    setStep('generating');
    try {
      const result = await generateItinerary(values);
      setItinerary(result);
      setStep('result');
    } catch {
      setStep('error');
    }
  };

  return (
    <PageLayout>
      <div className="mb-10 text-center">
        <h1 className="font-display text-3xl font-semibold text-dark">AI Trip Planner</h1>
        <p className="mt-2 text-gray-500">Describe the trip. Naviora drafts the plan.</p>
      </div>

      <AnimatePresence mode="wait">
        {step === 'form' && (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <PlannerForm onSubmit={runGeneration} defaultValues={lastValues ?? undefined} />
          </motion.div>
        )}

        {step === 'generating' && (
          <motion.div key="generating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <GeneratingState />
          </motion.div>
        )}

        {step === 'result' && itinerary && (
          <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ItineraryResult itinerary={itinerary} onRegenerate={() => lastValues && runGeneration(lastValues)} />
          </motion.div>
        )}

        {step === 'error' && (
          <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="mx-auto max-w-md rounded-2xl border border-dashed border-gray-200 px-6 py-10 text-center">
              <p className="text-gray-500">Something went wrong generating your itinerary. Please try again.</p>
              <button
                type="button"
                onClick={() => setStep('form')}
                className="mt-4 text-sm font-medium text-primary hover:text-primary-dark"
              >
                Back to the form
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageLayout>
  );
}
