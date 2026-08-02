import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Compass, Menu, X } from 'lucide-react';
import { NavLink } from './NavLink';
import { MobileMenu } from './MobileMenu';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Trips', href: '/trips' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Profile', href: '/profile' }
  // Marketing anchors (Features/Destinations/Pricing/FAQ) join this list
  // once the real landing sections exist — see Step 4.
];

/**
 * Global navbar. Transparent and borderless at the top of the homepage
 * — matching the light hero background rather than assuming a dark one
 * — and becomes a solid, blurred bar with a shadow once the page is
 * scrolled, or on any route other than "/". Text stays dark throughout
 * so it never depends on what's rendered behind it.
 */
export function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isHome = pathname === '/';
  const isTransparent = isHome && !isScrolled;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 16);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close the mobile menu on route change.
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        'sticky top-0 z-[var(--z-index-fixed)] transition-[background-color,box-shadow,border-color] duration-300',
        isTransparent
          ? 'border-b border-transparent bg-transparent'
          : 'border-b border-gray-100 bg-surface/80 shadow-sm backdrop-blur-xl'
      )}
    >
      <nav className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-white">
            <Compass className="size-4.5" />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-dark">Naviora</span>
        </Link>

        <div className="hidden md:flex md:items-center md:gap-7">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.href} to={item.href}>
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden md:flex md:items-center md:gap-4">
          <Link to="/login" className="text-sm font-medium text-gray-600 transition-colors hover:text-dark">
            Log in
          </Link>
          <Button size="sm" onClick={() => navigate('/register')}>
            Get Started
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setIsMobileOpen((v) => !v)}
          aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileOpen}
          className="rounded-lg p-2 text-dark md:hidden"
        >
          {isMobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </nav>

      <MobileMenu isOpen={isMobileOpen} items={NAV_ITEMS} onNavigate={() => setIsMobileOpen(false)} />
    </header>
  );
}
