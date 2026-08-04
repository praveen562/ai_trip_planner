import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { tokenStorage } from '../../services/tokenStorage';
import { getCurrentUser, logout as logoutService } from './authService';
import type { AuthUser } from './authService';

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * On mount, if a token is already in storage (returning visitor),
 * silently fetches /auth/me to restore the session instead of forcing
 * a fresh login every page refresh. LoginForm/RegisterForm call
 * setUser directly after a successful call, rather than waiting on
 * this effect to re-run.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = tokenStorage.getAccessToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    getCurrentUser()
      .then(setUser)
      .catch(() => tokenStorage.clear())
      .finally(() => setIsLoading(false));
  }, []);

  const logout = () => {
    logoutService();
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, isLoading, setUser, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
