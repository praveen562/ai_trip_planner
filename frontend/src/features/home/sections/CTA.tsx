import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export function CTA() {
  const navigate = useNavigate();

  return (
    <section className="py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-3xl px-8 py-16 text-center sm:px-16"
          style={{ background: 'linear-gradient(135deg, #2563eb 0%, #0ea5e9 50%, #06b6d4 100%)' }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                'radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 70% 60%, white 1px, transparent 1px)',
              backgroundSize: '60px 60px'
            }}
          />

          <h2 className="relative font-display text-3xl font-bold text-white sm:text-4xl">
            Your next trip is one sentence away
          </h2>
          <p className="relative mx-auto mt-4 max-w-md text-white/85">
            Start free — no credit card required, and your first itinerary takes about as long as this sentence did.
          </p>

          <Button
            size="lg"
            className="relative mt-8"
            style={{ backgroundColor: 'white', color: 'var(--color-primary)' }}
            rightIcon={<ArrowRight className="size-5" />}
            onClick={() => navigate('/register')}
          >
            Start planning free
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
