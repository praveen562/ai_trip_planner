import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { registerSchema } from '../schemas';
import type { RegisterFormValues } from '../schemas';
import { register as registerUser } from '../authService';
import { useAuth } from '../AuthContext';

export function RegisterForm() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (values: RegisterFormValues) => {
    setServerError(null);
    try {
      const user = await registerUser(values);
      setUser(user);
      navigate('/dashboard');
    } catch {
      setServerError('Something went wrong creating your account. That email may already be registered.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {serverError && (
        <p className="rounded-xl bg-error/10 px-4 py-3 text-sm text-error" role="alert">
          {serverError}
        </p>
      )}

      <Input
        label="Full name"
        autoComplete="name"
        placeholder="Jordan Rivera"
        leftIcon={<User className="size-4.5" />}
        error={errors.name?.message}
        {...register('name')}
      />

      <Input
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        leftIcon={<Mail className="size-4.5" />}
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        label="Password"
        type="password"
        autoComplete="new-password"
        placeholder="At least 8 characters"
        leftIcon={<Lock className="size-4.5" />}
        error={errors.password?.message}
        {...register('password')}
      />

      <Input
        label="Confirm password"
        type="password"
        autoComplete="new-password"
        placeholder="••••••••"
        leftIcon={<Lock className="size-4.5" />}
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />

      <div>
        <label className="flex items-start gap-2.5 text-sm text-gray-600">
          <input
            type="checkbox"
            className="mt-0.5 size-4 rounded border-gray-300 text-primary focus:ring-primary/40"
            {...register('agreeToTerms')}
          />
          I agree to the Terms of Service and Privacy Policy
        </label>
        {errors.agreeToTerms && <p className="mt-1.5 text-sm text-error">{errors.agreeToTerms.message}</p>}
      </div>

      <Button type="submit" fullWidth isLoading={isSubmitting} rightIcon={<ArrowRight className="size-4.5" />}>
        Create account
      </Button>
    </form>
  );
}
