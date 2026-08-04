import { z } from 'zod';

export const GENDER_OPTIONS = ['MALE', 'FEMALE', 'OTHER'] as const;

export const profileSchema = z.object({
  fullName: z.string().min(1, 'Enter your full name').max(150),
  phoneNumber: z.string().max(20).optional().or(z.literal('')),
  dateOfBirth: z.string().optional().or(z.literal('')),
  gender: z.enum(GENDER_OPTIONS).optional(),
  nationality: z.string().max(100).optional().or(z.literal('')),
  preferredLanguage: z.string().max(50).optional().or(z.literal('')),
  preferredCurrency: z.string().max(10).optional().or(z.literal('')),
  emergencyContactName: z.string().max(150).optional().or(z.literal('')),
  emergencyContactPhone: z.string().max(20).optional().or(z.literal('')),
  dietaryPreferences: z.string().optional().or(z.literal('')),
  accessibilityRequirements: z.string().optional().or(z.literal('')),
  bio: z.string().max(500, 'Keep your bio under 500 characters').optional().or(z.literal('')),
  profileImageUrl: z.string().max(500).optional().or(z.literal(''))
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
