import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';
import { PageLoader } from '../../components/ui/Loading';

/**
 * Guards authenticated-only routes.
 *
 * Crucially waits on `isLoading` before deciding anything. AuthContext
 * starts every mount with isLoading=true and, if a token is already in
 * storage, silently re-validates it against GET /auth/me. If this guard
 * redirected before that resolves, a hard refresh on any protected route
 * (e.g. /profile) would always bounce a logged-in user to /login for a
 * flash before AuthContext caught up. Waiting on isLoading fixes that.
 *
 * The attempted path is passed along in location state so Login can
 * send the user back to where they meant to go after signing in.
 */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <PageLoader />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
