import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * React Router doesn't scroll to in-page anchors on its own — a <Link
 * to="/#features"> from another route lands on "/" at the top of the
 * page, not at the Features section. This watches the hash and scrolls
 * to the matching element once it's mounted.
 *
 * Mounted once near the root, inside <Router>, alongside the route
 * table rather than per-page, so it works for every anchor link
 * (Navbar, Footer, mobile menu) without each of them managing scroll
 * behavior themselves.
 */
export function ScrollToHash() {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (!hash) {
      // Plain route change (no anchor) — reset to top rather than
      // preserving scroll position from the previous page.
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      return;
    }

    const id = hash.slice(1);
    // The target section may not be in the DOM the instant navigation
    // completes (route transition, lazy content), so retry briefly
    // instead of failing silently on the first missed frame.
    let attempts = 0;
    const tryScroll = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
      attempts += 1;
      if (attempts < 10) {
        requestAnimationFrame(tryScroll);
      }
    };
    tryScroll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hash, pathname]);

  return null;
}
