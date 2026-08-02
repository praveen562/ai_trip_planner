import { Link } from 'react-router-dom';
import { AuthLayout } from '../features/auth/components/AuthLayout';
import { LoginForm } from '../features/auth/components/LoginForm';

export default function Login() {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to keep planning your next trip."
      footer={
        <>
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-primary hover:text-primary-dark">
            Sign up
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthLayout>
  );
}
