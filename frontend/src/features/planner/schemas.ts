import { z } from 'zod';

export const plannerSchema = z
  .object({
    destination: z.string().min(2, 'Where are you headed?'),
    startDate: z.string().min(1, 'Pick a start date'),
    endDate: z.string().min(1, 'Pick an end date'),
    travelers: z.coerce.number().int().min(1, 'At least 1 traveler').max(20, 'Max 20 travelers'),
    budget: z.enum(['budget', 'mid-range', 'luxury']),
    notes: z.string().max(500, 'Keep it under 500 characters').optional()
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: 'End date must be after the start date',
    path: ['endDate']
  });

export type PlannerFormValues = z.infer<typeof plannerSchema>;
export type PlannerFormInput = z.input<typeof plannerSchema>;
