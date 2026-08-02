import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

const FOOTER_COLUMNS = [
  {
    heading: 'Product',
    links: ['Features', 'Pricing', 'AI Planner', 'Destinations']
  },
  {
    heading: 'Company',
    links: ['About Us', 'Careers', 'Press', 'Contact']
  },
  {
    heading: 'Legal',
    links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy']
  }
];

/**
 * Global footer. Content/columns get filled in with real destinations
 * as the corresponding pages/anchors are built (Step 4 onward) — this
 * pass is the branding + visual refresh so it matches the rest of the
 * chrome (Navbar, tokens) already updated.
 */
export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-dark text-gray-300">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-white">
                <Compass className="size-4.5" />
              </span>
              <span className="font-display text-lg font-semibold tracking-tight text-white">
                Naviora
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-gray-400">
              AI-powered trip planning — from a rough idea to a day-by-day itinerary, in minutes.
            </p>
          </div>

          {FOOTER_COLUMNS.map((col) => (
            <div key={col.heading}>
              <h4 className="mb-4 text-sm font-semibold text-white">{col.heading}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-gray-400 transition-colors hover:text-white">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center gap-4 border-t border-white/10 pt-6 text-sm text-gray-500 sm:flex-row sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Naviora. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="transition-colors hover:text-white">
              Twitter
            </a>
            <a href="#" className="transition-colors hover:text-white">
              Instagram
            </a>
            <a href="#" className="transition-colors hover:text-white">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
