import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PageLayout } from '../../components/layout/PageLayout';
import { PlannerForm } from './components/PlannerForm';
import { GeneratingState } from './components/GeneratingState';
import { ItineraryResult } from './components/ItineraryResult';
import { createTripAndGenerateItinerary, regenerateItinerary } from './plannerService';
import type { PlannerFormValues } from './schemas';
import type { GeneratedItinerary } from '../../types/itinerary';

type PlannerStep = 'form' | 'generating' | 'result' | 'error';

export function PlannerPage() {
  const [step, setStep] = useState<PlannerStep>('form');
  const [itinerary, setItinerary] = useState<GeneratedItinerary | null>(null);
  const [lastValues, setLastValues] = useState<PlannerFormValues | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const runGeneration = async (values: PlannerFormValues) => {
    setLastValues(values);
    setStep('generating');
    try {
      const result = await createTripAndGenerateItinerary(values);
      setItinerary(result);
      setStep('result');
    } catch (err) {
      setErrorMessage(
        err instanceof Error && err.message.includes('Network')
          ? "Couldn't reach the server. Is the backend running?"
          : 'Something went wrong generating your itinerary.'
      );
      setStep('error');
    }
  };

  const handleRegenerate = async () => {
    if (!itinerary || !lastValues) return;
    setIsRegenerating(true);
    try {
      const result = await regenerateItinerary(itinerary.itineraryId, itinerary.tripId, lastValues);
      setItinerary(result);
    } catch {
      setErrorMessage('Something went wrong regenerating your itinerary.');
      setStep('error');
    } finally {
      setIsRegenerating(false);
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
            <ItineraryResult itinerary={itinerary} onRegenerate={handleRegenerate} isRegenerating={isRegenerating} />
          </motion.div>
        )}

        {step === 'error' && (
          <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="mx-auto max-w-md rounded-2xl border border-dashed border-gray-200 px-6 py-10 text-center">
              <p className="text-gray-500">{errorMessage ?? 'Something went wrong. Please try again.'}</p>
              <button
                type="button"
                onClick={() => setStep(itinerary ? 'result' : 'form')}
                className="mt-4 text-sm font-medium text-primary hover:text-primary-dark"
              >
                {itinerary ? 'Back to itinerary' : 'Back to the form'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageLayout>
  );
}
