import type { UserProfileResponseDto } from '../../types/api/dto';
import type { ProfileFormValues } from '../../features/profile/schemas';

export function mapProfileResponseToForm(dto: UserProfileResponseDto): Partial<ProfileFormValues> {
  return {
    fullName: dto.full_name,
    phoneNumber: dto.phone_number ?? '',
    dateOfBirth: dto.date_of_birth ?? '',
    gender: dto.gender ?? undefined,
    nationality: dto.nationality ?? '',
    preferredLanguage: dto.preferred_language ?? '',
    preferredCurrency: dto.preferred_currency ?? '',
    emergencyContactName: dto.emergency_contact_name ?? '',
    emergencyContactPhone: dto.emergency_contact_phone ?? '',
    dietaryPreferences: dto.dietary_preferences ?? '',
    accessibilityRequirements: dto.accessibility_requirements ?? '',
    bio: dto.bio ?? '',
    profileImageUrl: dto.profile_image_url ?? ''
  };
}
