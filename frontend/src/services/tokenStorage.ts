const ACCESS_TOKEN_KEY = 'naviora:accessToken';
const REFRESH_TOKEN_KEY = 'naviora:refreshToken';

/**
 * localStorage, not httpOnly cookies — the backend doesn't set cookies
 * (see auth.py: tokens come back in the JSON body), so this is the
 * pragmatic option for now. Tradeoff: vulnerable to XSS reading
 * localStorage, unlike an httpOnly cookie. Worth revisiting if the
 * backend adds cookie-based auth later.
 */
export const tokenStorage = {
  getAccessToken: () => localStorage.getItem(ACCESS_TOKEN_KEY),
  getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
  setTokens: (accessToken: string, refreshToken: string) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },
  clear: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
};
