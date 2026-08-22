import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export interface WelcomeHeaderProps {
  name: string;
}

export function WelcomeHeader({ name }: WelcomeHeaderProps) {
  const navigate = useNavigate();
  const firstName = name.split(' ')[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center"
    >
      <div>
        <h1 className="font-display text-3xl font-semibold text-dark">Welcome back, {firstName}</h1>
        <p className="mt-1 text-gray-500">Here's where your trips stand.</p>
      </div>

      <Button leftIcon={<Plus className="size-4.5" />} onClick={() => navigate('/trips/new')}>
        Plan a new trip
      </Button>
    </motion.div>
  );
}
