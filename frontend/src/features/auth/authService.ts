import type { LoginFormValues, RegisterFormValues } from './schemas';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
}

/**
 * Mocked for now — the real backend already has working registration/
 * login/JWT/refresh-token endpoints (see project handoff), but wiring
 * axios up to them is explicitly Step 10 ("Connect backend APIs").
 * Keeping the function signatures realistic now means Step 10 is a
 * drop-in swap of the implementation, not a rewrite of every caller.
 */
function mockDelay<T>(value: T, ms = 700): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export async function login(values: LoginFormValues): Promise<AuthResponse> {
  return mockDelay({
    user: { id: 'mock-user-id', name: 'Naviora Traveler', email: values.email },
    accessToken: 'mock-access-token'
  });
}

export async function register(values: RegisterFormValues): Promise<AuthResponse> {
  return mockDelay({
    user: { id: 'mock-user-id', name: values.name, email: values.email },
    accessToken: 'mock-access-token'
  });
}
