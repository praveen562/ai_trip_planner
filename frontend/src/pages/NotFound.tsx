import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { PageLayout } from '../components/layout/PageLayout';
import { Button } from '../components/ui/Button';

export default function NotFound() {
  return (
    <PageLayout>
      <div className="mx-auto flex max-w-md flex-col items-center py-16 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Compass className="size-6" />
        </span>
        <h1 className="mt-6 text-3xl font-semibold text-dark">Page not found</h1>
        <p className="mt-2 text-gray-500">
          The page you're looking for doesn't exist, or may have moved.
        </p>
        <Link to="/" className="mt-6">
          <Button>Back to home</Button>
        </Link>
      </div>
    </PageLayout>
  );
}
