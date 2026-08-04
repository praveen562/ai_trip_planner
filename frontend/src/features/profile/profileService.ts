import { isAxiosError } from 'axios';
import { apiClient } from '../../services/apiClient';
import type { ProfileFormValues } from './schemas';
import type { UserProfileResponseDto, UserProfileWriteDto } from '../../types/api/dto';

function toWriteDto(values: ProfileFormValues): UserProfileWriteDto {
  const dto: UserProfileWriteDto = { full_name: values.fullName };
  if (values.phoneNumber) dto.phone_number = values.phoneNumber;
  if (values.dateOfBirth) dto.date_of_birth = values.dateOfBirth;
  if (values.gender) dto.gender = values.gender;
  if (values.nationality) dto.nationality = values.nationality;
  if (values.preferredLanguage) dto.preferred_language = values.preferredLanguage;
  if (values.preferredCurrency) dto.preferred_currency = values.preferredCurrency;
  if (values.emergencyContactName) dto.emergency_contact_name = values.emergencyContactName;
  if (values.emergencyContactPhone) dto.emergency_contact_phone = values.emergencyContactPhone;
  if (values.dietaryPreferences) dto.dietary_preferences = values.dietaryPreferences;
  if (values.accessibilityRequirements) dto.accessibility_requirements = values.accessibilityRequirements;
  if (values.bio) dto.bio = values.bio;
  if (values.profileImageUrl) dto.profile_image_url = values.profileImageUrl;
  return dto;
}

/**
 * GET /profile 404s (NotFoundException, see user_profile_service.py)
 * when the current user hasn't created a profile yet — that's a real,
 * expected state here (every new account starts this way), not an
 * error, so it's normalized to `null` rather than thrown.
 */
export async function getProfile(): Promise<UserProfileResponseDto | null> {
  try {
    const { data } = await apiClient.get<UserProfileResponseDto>('/profile');
    return data;
  } catch (err) {
    if (isAxiosError(err) && err.response?.status === 404) {
      return null;
    }
    throw err;
  }
}

export async function createProfile(values: ProfileFormValues): Promise<UserProfileResponseDto> {
  const { data } = await apiClient.post<UserProfileResponseDto>('/profile', toWriteDto(values));
  return data;
}

export async function updateProfile(values: ProfileFormValues): Promise<UserProfileResponseDto> {
  const { data } = await apiClient.patch<UserProfileResponseDto>('/profile', toWriteDto(values));
  return data;
}
