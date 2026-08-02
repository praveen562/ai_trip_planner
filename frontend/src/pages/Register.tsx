import { Link } from 'react-router-dom';
import { AuthLayout } from '../features/auth/components/AuthLayout';
import { RegisterForm } from '../features/auth/components/RegisterForm';

export default function Register() {
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start planning your next trip with AI, free."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary hover:text-primary-dark">
            Log in
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthLayout>
  );
}
