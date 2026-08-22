import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';

export interface MobileMenuItem {
  label: string;
  href: string;
}

export interface MobileMenuProps {
  isOpen: boolean;
  items: MobileMenuItem[];
  onNavigate: () => void;
}

/**
 * Slide-down panel show below the Navbar on small screens. Kept as a
 * separate component so Navbar itself doesn't grow past a screenful of
 * open/close and scroll-lock logic on top of its own responsibilities.
 */
export function MobileMenu({ isOpen, items, onNavigate }: MobileMenuProps) {
  const { user, logout } = useAuth();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden border-t border-gray-100 bg-surface/95 backdrop-blur-xl md:hidden"
        >
          <div className="flex flex-col gap-1 px-4 py-4">
            {items.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={onNavigate}
                className="rounded-lg px-3 py-2.5 text-base font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-primary"
              >
                {item.label}
              </Link>
            ))}

            <div className="mt-3 flex flex-col gap-2 border-t border-gray-100 pt-3">
              {user ? (
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    onNavigate();
                  }}
                  className="rounded-lg px-3 py-2.5 text-center text-base font-medium text-gray-700 hover:bg-gray-50"
                >
                  Log out ({user.name.split(' ')[0]})
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={onNavigate}
                    className="rounded-lg px-3 py-2.5 text-center text-base font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    onClick={onNavigate}
                    className="inline-flex h-11 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 text-base font-medium text-white shadow-sm transition-all hover:shadow-lg"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
