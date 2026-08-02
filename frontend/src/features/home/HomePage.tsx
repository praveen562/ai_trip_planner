import { Hero } from './sections/Hero';
import { RouteMap } from './sections/RouteMap';
import { AIPlannerPreview } from './sections/AIPlannerPreview';
import { Features } from './sections/Features';
import { Destinations } from './sections/Destinations';
import { AIWorkflow } from './sections/AIWorkflow';
import { WhyChooseUs } from './sections/WhyChooseUs';
import { Testimonials } from './sections/Testimonials';
import { Pricing } from './sections/Pricing';
import { FAQ } from './sections/FAQ';
import { CTA } from './sections/CTA';

/**
 * The full Naviora landing page. Navbar and Footer are rendered
 * globally by App.tsx (Step 3), so this covers sections 2-12 from the
 * product brief.
 */
export function HomePage() {
  return (
    <div className="bg-page">
      <Hero />
      <RouteMap />
      <AIPlannerPreview />
      <Features />
      <Destinations />
      <AIWorkflow />
      <WhyChooseUs />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTA />
    </div>
  );
}
