import { apiClient } from '../../services/apiClient';
import { tokenStorage } from '../../services/tokenStorage';
import type { LoginFormValues, RegisterFormValues } from './schemas';
import type { TokenResponseDto, UserResponseDto } from '../../types/api/dto';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

function mapUser(dto: UserResponseDto): AuthUser {
  return { id: dto.id, name: dto.full_name, email: dto.email };
}

export async function login(values: LoginFormValues): Promise<AuthUser> {
  const { data: tokens } = await apiClient.post<TokenResponseDto>('/auth/login', {
    email: values.email,
    password: values.password
  });
  tokenStorage.setTokens(tokens.access_token, tokens.refresh_token);

  const { data: user } = await apiClient.get<UserResponseDto>('/auth/me');
  return mapUser(user);
}

export async function register(values: RegisterFormValues): Promise<AuthUser> {
  await apiClient.post<UserResponseDto>('/auth/register', {
    full_name: values.name,
    email: values.email,
    password: values.password
  });

  // The backend's /register doesn't log the user in — sign in right
  // after so the rest of the app (Dashboard, Planner) has a session.
  return login({ email: values.email, password: values.password });
}

export async function getCurrentUser(): Promise<AuthUser> {
  const { data } = await apiClient.get<UserResponseDto>('/auth/me');
  return mapUser(data);
}

export function logout(): void {
  tokenStorage.clear();
}
