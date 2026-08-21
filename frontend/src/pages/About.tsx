import { Link } from 'react-router-dom';
import { Compass, Sparkles, Palette, Map, WifiOff } from 'lucide-react';
import { PageLayout } from '../components/layout/PageLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { SectionTitle } from '../components/ui/SectionTitle';

const DIFFERENTIATORS = [
  {
    icon: Sparkles,
    title: 'AI-powered personalization',
    description: 'Naviora drafts a day-by-day itinerary from a single sentence, tuned to how you actually like to travel.'
  },
  {
    icon: Palette,
    title: 'Thoughtful design',
    description: 'Every screen is built with the same care as the trips it helps you plan.'
  },
  {
    icon: Map,
    title: 'Comprehensive coverage',
    description: 'From nearby places and weather to packing lists and expenses, all in one trip.'
  },
  {
    icon: WifiOff,
    title: 'Built for real trips',
    description: 'Journal entries, packing checklists, and expenses stay with the trip, not scattered across apps.'
  }
];

export default function About() {
  return (
    <PageLayout>
      <div className="mx-auto max-w-3xl text-center">
        <span className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-primary text-white">
          <Compass className="size-6" />
        </span>
        <SectionTitle
          eyebrow="About Naviora"
          title="Trip planning, without the planning headache"
          description="Naviora is revolutionizing the way people plan their journeys — we believe travel should be about experiences, not spreadsheets and browser tabs."
        />
      </div>

      <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2">
        <Card>
          <h3 className="font-display text-xl font-semibold text-dark">Our mission</h3>
          <p className="mt-3 text-gray-500">
            To make travel planning effortless, personalized, and enjoyable for everyone — from a rough idea to a
            full itinerary in minutes.
          </p>
        </Card>
        <Card>
          <h3 className="font-display text-xl font-semibold text-dark">Our story</h3>
          <p className="mt-3 text-gray-500">
            Founded by travel enthusiasts frustrated with complicated planning tools, we set out to build something
            that puts the joy back into getting ready for a trip.
          </p>
        </Card>
      </div>

      <Card className="mx-auto mt-6 max-w-4xl" padding="lg">
        <h3 className="font-display text-xl font-semibold text-dark">What makes us different</h3>
        <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {DIFFERENTIATORS.map(({ icon: Icon, title, description }) => (
            <li key={title} className="flex gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-5" />
              </span>
              <div>
                <p className="font-medium text-dark">{title}</p>
                <p className="mt-1 text-sm text-gray-500">{description}</p>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <div className="mt-12 text-center">
        <Link to="/">
          <Button>Back to home</Button>
        </Link>
      </div>
    </PageLayout>
  );
}
