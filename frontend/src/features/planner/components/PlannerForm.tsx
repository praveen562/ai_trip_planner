import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MapPin, Users, Wand2 } from 'lucide-react';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { plannerSchema } from '../schemas';
import type { PlannerFormValues, PlannerFormInput } from '../schemas';

const BUDGET_OPTIONS: Array<{ value: PlannerFormValues['budget']; label: string }> = [
  { value: 'budget', label: 'Budget' },
  { value: 'mid-range', label: 'Mid-range' },
  { value: 'luxury', label: 'Luxury' }
];

export interface PlannerFormProps {
  onSubmit: (values: PlannerFormValues) => void;
  defaultValues?: Partial<PlannerFormValues>;
}

export function PlannerForm({ onSubmit, defaultValues }: PlannerFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<PlannerFormInput, unknown, PlannerFormValues>({
    resolver: zodResolver(plannerSchema),
    defaultValues: { budget: 'mid-range', travelers: 2, ...defaultValues }
  });

  const budget = watch('budget');

  return (
    <Card variant="elevated" className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center gap-2">
        <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Wand2 className="size-4.5" />
        </span>
        <h2 className="font-display text-xl font-semibold text-dark">Plan a new trip</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <Input
          label="Destination"
          placeholder="Kyoto, Japan"
          leftIcon={<MapPin className="size-4.5" />}
          error={errors.destination?.message}
          {...register('destination')}
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Input label="Start date" type="date" error={errors.startDate?.message} {...register('startDate')} />
          <Input label="End date" type="date" error={errors.endDate?.message} {...register('endDate')} />
        </div>

        <Input
          label="Travelers"
          type="number"
          min={1}
          max={20}
          leftIcon={<Users className="size-4.5" />}
          error={errors.travelers?.message}
          {...register('travelers')}
        />

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Budget</label>
          <div className="grid grid-cols-3 gap-2">
            {BUDGET_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setValue('budget', option.value, { shouldValidate: true })}
                className={`rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
                  budget === option.value
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="notes" className="mb-1.5 block text-sm font-medium text-gray-700">
            Anything else? <span className="font-normal text-gray-400">(optional)</span>
          </label>
          <textarea
            id="notes"
            rows={3}
            placeholder="Slow pace, love street food, traveling with a toddler..."
            className="w-full rounded-xl border border-gray-200 bg-surface px-4 py-3 text-base text-dark placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            {...register('notes')}
          />
          {errors.notes && <p className="mt-1.5 text-sm text-error">{errors.notes.message}</p>}
        </div>

        <Button type="submit" fullWidth size="lg" isLoading={isSubmitting} leftIcon={<Wand2 className="size-4.5" />}>
          Generate my itinerary
        </Button>
      </form>
    </Card>
  );
}
