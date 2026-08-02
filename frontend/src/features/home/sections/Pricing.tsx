import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SectionTitle } from '../../../components/ui/SectionTitle';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { PRICING_TIERS } from '../../../constants/pricing';
import { cn } from '../../../utils/cn';

export function Pricing() {
  const navigate = useNavigate();

  return (
    <section id="pricing" className="py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Simple pricing"
          title="Start free, upgrade when it's worth it"
          description="No hidden fees. Cancel anytime."
        />

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {PRICING_TIERS.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <Card
                variant={tier.highlighted ? 'elevated' : 'default'}
                className={cn('flex h-full flex-col', tier.highlighted && 'ring-2 ring-primary')}
              >
                {tier.highlighted && (
                  <span className="mb-4 inline-block w-fit rounded-full bg-primary px-3 py-1 text-xs font-medium text-white">
                    Most popular
                  </span>
                )}

                <h3 className="font-display text-xl font-semibold text-dark">{tier.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{tier.description}</p>

                <div className="mt-5 flex items-baseline gap-1">
                  <span className="font-display text-4xl font-bold text-dark">{tier.price}</span>
                  <span className="text-sm text-gray-400">{tier.period}</span>
                </div>

                <ul className="mt-6 flex-1 space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-gray-600">
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  variant={tier.highlighted ? 'primary' : 'outline'}
                  fullWidth
                  className="mt-8"
                  onClick={() => navigate('/register')}
                >
                  {tier.ctaLabel}
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
