export interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  ctaLabel: string;
}

/**
 * Placeholder pricing — numbers are illustrative, pending an actual
 * business decision on tiers. Update freely; the Pricing section reads
 * straight from this file.
 */
export const PRICING_TIERS: PricingTier[] = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'For the occasional trip.',
    features: ['Up to 2 active trips', 'AI itinerary generation', 'Weather & places', 'Basic expense tracking'],
    ctaLabel: 'Start for free'
  },
  {
    name: 'Pro',
    price: '$9',
    period: '/ month',
    description: 'For people who travel often.',
    features: [
      'Unlimited trips',
      'Route optimization',
      'Full expense & journal tools',
      'Priority itinerary generation'
    ],
    highlighted: true,
    ctaLabel: 'Start free trial'
  },
  {
    name: 'Teams',
    price: '$24',
    period: '/ month',
    description: 'For planning trips together.',
    features: ['Everything in Pro', 'Shared trips & itineraries', 'Group expense splitting', 'Priority support'],
    ctaLabel: 'Talk to us'
  }
];
