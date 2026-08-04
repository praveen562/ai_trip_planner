import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { loginSchema } from '../schemas';
import type { LoginFormValues } from '../schemas';
import { login } from '../authService';
import { useAuth } from '../AuthContext';

export function LoginForm() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);
    try {
      const user = await login(values);
      setUser(user);
      navigate('/dashboard');
    } catch {
      setServerError('Could not sign you in — check your credentials, or that the server is reachable.');
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
        autoComplete="current-password"
        placeholder="••••••••"
        leftIcon={<Lock className="size-4.5" />}
        error={errors.password?.message}
        {...register('password')}
      />

      <div className="flex justify-end">
        <a href="#" className="text-sm font-medium text-primary hover:text-primary-dark">
          Forgot password?
        </a>
      </div>

      <Button type="submit" fullWidth isLoading={isSubmitting} rightIcon={<ArrowRight className="size-4.5" />}>
        Log in
      </Button>
    </form>
  );
}
