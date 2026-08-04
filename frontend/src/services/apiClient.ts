import axios from 'axios';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { tokenStorage } from './tokenStorage';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000/api/v1';

export const apiClient = axios.create({ baseURL: API_BASE_URL });

apiClient.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Queues requests that hit a 401 while a single refresh call is in
// flight, so a page firing several requests at once doesn't trigger
// multiple concurrent refresh attempts.
let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const refreshToken = tokenStorage.getRefreshToken();
  if (!refreshToken) throw new Error('No refresh token available');

  const { data } = await axios.post<{ access_token: string; refresh_token: string }>(
    `${API_BASE_URL}/auth/refresh`,
    { refresh_token: refreshToken }
  );
  tokenStorage.setTokens(data.access_token, data.refresh_token);
  return data.access_token;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        refreshPromise ??= refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
        const newAccessToken = await refreshPromise;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch {
        tokenStorage.clear();
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);
