import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Phone, Globe2, Wallet, ShieldAlert } from 'lucide-react';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { profileSchema, GENDER_OPTIONS } from '../schemas';
import type { ProfileFormValues } from '../schemas';

export interface ProfileFormProps {
  mode: 'create' | 'edit';
  defaultValues?: Partial<ProfileFormValues>;
  onSubmit: (values: ProfileFormValues) => void;
  onCancel?: () => void;
  isSaving?: boolean;
}

export function ProfileForm({ mode, defaultValues, onSubmit, onCancel, isSaving }: ProfileFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { preferredLanguage: 'English', preferredCurrency: 'USD', ...defaultValues }
  });

  const gender = watch('gender');

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">
      <section>
        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-dark">
          <User className="size-4 text-primary" />
          Basics
        </h3>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Input label="Full name" error={errors.fullName?.message} {...register('fullName')} />
          <Input label="Date of birth" type="date" {...register('dateOfBirth')} />
        </div>

        <div className="mt-5">
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Gender</label>
          <div className="grid grid-cols-3 gap-2">
            {GENDER_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setValue('gender', option, { shouldValidate: true })}
                className={`rounded-xl border px-3 py-2 text-sm font-medium capitalize transition-colors ${
                  gender === option
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
              >
                {option.toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <label htmlFor="bio" className="mb-1.5 block text-sm font-medium text-gray-700">
            Bio
          </label>
          <textarea
            id="bio"
            rows={3}
            placeholder="A little about you and how you like to travel..."
            className="w-full rounded-xl border border-gray-200 bg-surface px-4 py-3 text-base text-dark placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            {...register('bio')}
          />
          {errors.bio && <p className="mt-1.5 text-sm text-error">{errors.bio.message}</p>}
        </div>
      </section>

      <section>
        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-dark">
          <Phone className="size-4 text-primary" />
          Contact
        </h3>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Input label="Phone number" {...register('phoneNumber')} />
          <Input label="Nationality" {...register('nationality')} />
        </div>
      </section>

      <section>
        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-dark">
          <Globe2 className="size-4 text-primary" />
          Preferences
        </h3>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Input label="Preferred language" {...register('preferredLanguage')} />
          <Input
            label="Preferred currency"
            placeholder="USD, EUR, INR..."
            leftIcon={<Wallet className="size-4.5" />}
            {...register('preferredCurrency')}
          />
        </div>
        <div className="mt-5">
          <label htmlFor="dietary" className="mb-1.5 block text-sm font-medium text-gray-700">
            Dietary preferences
          </label>
          <textarea
            id="dietary"
            rows={2}
            placeholder="Vegetarian, gluten-free, no shellfish..."
            className="w-full rounded-xl border border-gray-200 bg-surface px-4 py-3 text-base text-dark placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            {...register('dietaryPreferences')}
          />
        </div>
        <div className="mt-5">
          <label htmlFor="accessibility" className="mb-1.5 block text-sm font-medium text-gray-700">
            Accessibility requirements
          </label>
          <textarea
            id="accessibility"
            rows={2}
            placeholder="Wheelchair access, step-free routes..."
            className="w-full rounded-xl border border-gray-200 bg-surface px-4 py-3 text-base text-dark placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            {...register('accessibilityRequirements')}
          />
        </div>
      </section>

      <section>
        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-dark">
          <ShieldAlert className="size-4 text-primary" />
          Emergency contact
        </h3>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Input label="Contact name" {...register('emergencyContactName')} />
          <Input label="Contact phone" {...register('emergencyContactPhone')} />
        </div>
      </section>

      <div className="flex gap-3 border-t border-gray-100 pt-6">
        <Button type="submit" isLoading={isSaving}>
          {mode === 'create' ? 'Create profile' : 'Save changes'}
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel} disabled={isSaving}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
