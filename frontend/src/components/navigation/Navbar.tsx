import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Plane, Menu, X, LogOut } from 'lucide-react';
import { NavLink } from './NavLink';
import { MobileMenu } from './MobileMenu';
import { Button } from '../ui/Button';
import { useAuth } from '../../features/auth/AuthContext';

const MARKETING_NAV_ITEMS = [
  { label: 'Features', href: '/#features' },
  { label: 'Destinations', href: '/#destinations' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'FAQ', href: '/#faq' }
];

const APP_NAV_ITEMS = [
  { label: 'Trips', href: '/trips' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Profile', href: '/profile' }
];

/**
 * Global navbar — a persistent glass-blur bar (matching the original
 * Naviora dashboard's header) with the gradient plane mark, product
 * name, and nav links that switch between marketing and in-app sets
 * depending on auth state.
 */
export function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navItems = user ? APP_NAV_ITEMS : MARKETING_NAV_ITEMS;

  // Close the mobile menu on route change.
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-[var(--z-index-fixed)] border-b border-white/20 bg-white/70 backdrop-blur-xl">
      <nav className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-700 text-white shadow-lg">
            <Plane size={22} />
          </span>
          <span>
            <span className="block text-xl font-extrabold tracking-tight text-dark">Naviora</span>
            <span className="-mt-1 block text-xs text-slate-500">AI Travel Planner</span>
          </span>
        </Link>

        <div className="hidden md:flex md:items-center md:gap-7">
          {navItems.map((item) => (
            <NavLink key={item.href} to={item.href}>
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden md:flex md:items-center md:gap-4">
          {user ? (
            <>
              <span className="text-sm text-gray-500">{user.name.split(' ')[0]}</span>
              <Button
                size="sm"
                variant="outline"
                leftIcon={<LogOut className="size-4" />}
                onClick={() => {
                  logout();
                  navigate('/');
                }}
              >
                Log out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-gray-600 transition-colors hover:text-dark">
                Log in
              </Link>
              <Button size="sm" onClick={() => navigate('/register')}>
                Get Started
              </Button>
            </>
          )}
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

      <MobileMenu isOpen={isMobileOpen} items={navItems} onNavigate={() => setIsMobileOpen(false)} />
    </header>
  );
}
