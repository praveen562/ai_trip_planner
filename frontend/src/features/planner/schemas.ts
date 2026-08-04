import { z } from 'zod';

export const TRAVEL_STYLES = ['BUDGET', 'BALANCED', 'PREMIUM'] as const;

export const plannerSchema = z
  .object({
    title: z.string().min(1, 'Give your trip a name').max(150),
    sourceLocation: z.string().min(1, 'Where are you traveling from?'),
    destination: z.string().min(2, 'Where are you headed?'),
    startDate: z.string().min(1, 'Pick a start date'),
    endDate: z.string().min(1, 'Pick an end date'),
    budget: z.coerce.number().positive('Enter your total trip budget'),
    travelStyle: z.enum(TRAVEL_STYLES),
    notes: z.string().max(500, 'Keep it under 500 characters').optional()
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: 'End date must be after the start date',
    path: ['endDate']
  });

export type PlannerFormValues = z.infer<typeof plannerSchema>;
export type PlannerFormInput = z.input<typeof plannerSchema>;
