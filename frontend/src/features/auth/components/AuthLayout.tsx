import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass, Sparkles } from 'lucide-react';

export interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

/**
 * Split-screen frame shared by Login and Register — brand panel on the
 * left (hidden on small screens), the actual form on the right so the
 * two pages only ever differ in their form content.
 */
export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="grid min-h-[calc(100vh-4rem)] grid-cols-1 lg:grid-cols-2">
      {/* Brand panel */}
      <div
        className="relative hidden flex-col justify-between overflow-hidden p-12 text-white lg:flex"
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

        <Link to="/" className="relative flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-white/20 backdrop-blur">
            <Compass className="size-4.5" />
          </span>
          <span className="font-display text-lg font-semibold">Naviora</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <Sparkles className="mb-4 size-8 text-white/80" />
          <p className="font-display text-2xl font-semibold leading-snug">
            "One sentence about Portugal, and I had a full itinerary before I finished my coffee."
          </p>
          <p className="mt-4 text-sm text-white/70">Amara O. · Naviora traveler</p>
        </motion.div>

        <p className="relative text-xs text-white/50">&copy; {new Date().getFullYear()} Naviora</p>
      </div>

      {/* Form panel */}
      <div className="flex flex-col justify-center px-6 py-16 sm:px-12 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto w-full max-w-sm"
        >
          {/* Logo shown only when the brand panel is hidden (mobile) */}
          <Link to="/" className="mb-8 flex items-center gap-2 lg:hidden">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-white">
              <Compass className="size-4.5" />
            </span>
            <span className="font-display text-lg font-semibold text-dark">Naviora</span>
          </Link>

          <h1 className="font-display text-2xl font-semibold text-dark">{title}</h1>
          <p className="mt-2 text-sm text-gray-500">{subtitle}</p>

          <div className="mt-8">{children}</div>

          <div className="mt-6 text-center text-sm text-gray-500">{footer}</div>
        </motion.div>
      </div>
    </div>
  );
}
