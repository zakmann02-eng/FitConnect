import { z } from 'zod';

const specialties = [
  'physical-therapist', 'massage-therapist', 'strength-conditioning',
  'nutritionist', 'personal-trainer', 'yoga-instructor', 'mental-wellness',
] as const;

export const intakeSchema = z.object({
  goals: z.array(z.string()).min(1, 'Select at least one goal'),
  specialtyNeeded: z.enum(specialties),
  zipCode: z.string().regex(/^\d{5}$/, 'Enter a valid 5-digit ZIP'),
  budgetMin: z.number().min(0),
  budgetMax: z.number().min(0),
  clientName: z.string().min(2, 'Name must be at least 2 characters'),
  clientEmail: z.string().email('Enter a valid email address'),
  clientPhone: z.string().min(10, 'Enter a valid phone number'),
  notes: z.string().optional(),
});

export const professionalSchema = z.object({
  name: z.string().min(2),
  specialty: z.enum(specialties),
  bio: z.string().min(50).max(600),
  city: z.string().min(2),
  state: z.string().length(2),
  zipCodes: z.array(z.string().regex(/^\d{5}$/)).min(1),
  credentials: z.array(z.string()),
  pricingMin: z.number().min(0),
  pricingMax: z.number().min(0),
  email: z.string().email(),
  yearsExperience: z.number().min(0),
  photo: z.string().optional(),
});

export type IntakeSchema = z.infer<typeof intakeSchema>;
export type ProfessionalSchema = z.infer<typeof professionalSchema>;
