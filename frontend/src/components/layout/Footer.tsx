import { Link } from 'react-router-dom';
import { Plane } from 'lucide-react';

interface FooterLink {
  label: string;
  /** Omitted when no real page/anchor exists yet — renders as plain text instead of a dead "#" link. */
  href?: string;
}

const FOOTER_COLUMNS: { heading: string; links: FooterLink[] }[] = [
  {
    heading: 'Product',
    links: [
      { label: 'Features', href: '/#features' },
      { label: 'Pricing', href: '/#pricing' },
      { label: 'AI Planner', href: '/trips/new' },
      { label: 'Destinations', href: '/#destinations' }
    ]
  },
  {
    heading: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      // No Careers/Press/Contact pages exist yet — left as plain text
      // rather than wired to a page that doesn't exist.
      { label: 'Careers' },
      { label: 'Press' },
      { label: 'Contact' }
    ]
  },
  {
    heading: 'Legal',
    links: [
      // No legal pages exist yet either — same reasoning as above.
      { label: 'Privacy Policy' },
      { label: 'Terms of Service' },
      { label: 'Cookie Policy' }
    ]
  }
];

/**
 * Global footer. Product links point at real landing-page anchors or
 * routes. Company/Legal links without a real destination yet (Careers,
 * Press, Contact, Privacy, Terms, Cookies) render as plain text rather
 * than dead "#" links — inventing those pages is out of scope for now.
 */
export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-dark text-gray-300">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-blue-700 text-white">
                <Plane className="size-4.5" />
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
                  <li key={link.label}>
                    {link.href ? (
                      link.href.startsWith('/#') ? (
                        <a href={link.href} className="text-sm text-gray-400 transition-colors hover:text-white">
                          {link.label}
                        </a>
                      ) : (
                        <Link to={link.href} className="text-sm text-gray-400 transition-colors hover:text-white">
                          {link.label}
                        </Link>
                      )
                    ) : (
                      <span className="text-sm text-gray-600" title="Coming soon">
                        {link.label}
                      </span>
                    )}
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
