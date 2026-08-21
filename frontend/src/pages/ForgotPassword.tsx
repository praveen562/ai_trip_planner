import { Link } from 'react-router-dom';
import { MailQuestion } from 'lucide-react';
import { AuthLayout } from '../features/auth/components/AuthLayout';

/**
 * The backend has no password-reset flow yet (no /auth/forgot-password
 * or /auth/reset-password endpoints), so rather than build a form that
 * pretends to send a reset email, this page is honest about the gap
 * and points people to a working alternative.
 */
export default function ForgotPassword() {
  return (
    <AuthLayout
      title="Forgot your password?"
      subtitle="Password reset isn't available yet."
      footer={
        <>
          Remembered it after all?{' '}
          <Link to="/login" className="font-medium text-primary hover:text-primary-dark">
            Back to login
          </Link>
        </>
      }
    >
      <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/60 px-5 py-6 text-center">
        <MailQuestion className="mx-auto mb-3 size-8 text-gray-400" />
        <p className="text-sm text-gray-600">
          Self-serve password reset isn&apos;t built yet — there&apos;s no email-sending flow behind this page.
        </p>
        <p className="mt-3 text-sm text-gray-500">
          If you're locked out, create a new account with a different email for now, or reach out directly for help
          recovering the old one.
        </p>
      </div>
    </AuthLayout>
  );
}
