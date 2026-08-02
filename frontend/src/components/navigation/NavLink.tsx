import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

export interface NavLinkProps {
  to: string;
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

/**
 * Nav item with an active-route indicator. Pulled out of Navbar so the
 * "am I the current route" logic (and its underline treatment) lives
 * in exactly one place instead of being re-derived per link.
 */
export function NavLink({ to, children, onClick, className }: NavLinkProps) {
  const { pathname } = useLocation();
  const isActive = pathname === to;

  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        'relative px-1 py-2 text-sm font-medium transition-colors',
        isActive ? 'text-primary' : 'text-gray-600 hover:text-dark',
        className
      )}
    >
      {children}
      {isActive && (
        <span className="absolute -bottom-0.5 left-0 h-0.5 w-full rounded-full bg-primary" />
      )}
    </Link>
  );
}
