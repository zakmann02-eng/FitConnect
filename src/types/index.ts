export type Specialty =
  | 'physical-therapist'
  | 'massage-therapist'
  | 'strength-conditioning'
  | 'nutritionist'
  | 'personal-trainer'
  | 'yoga-instructor'
  | 'mental-wellness';

export type LeadStatus = 'new' | 'contacted' | 'converted' | 'closed';

export interface Professional {
  id: string;
  name: string;
  specialty: Specialty;
  bio: string;
  city: string;
  state: string;
  zipCodes: string[];
  credentials: string[];
  photo: string;
  pricingMin: number;
  pricingMax: number;
  rating: number;
  reviewCount: number;
  yearsExperience: number;
  acceptingClients: boolean;
  email: string;
  createdAt: string;
}

export interface Lead {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  goals: string[];
  specialtyNeeded: Specialty;
  zipCode: string;
  budgetMin: number;
  budgetMax: number;
  notes: string;
  matchedProfessionalId: string;
  status: LeadStatus;
  createdAt: string;
}

export interface IntakeFormData {
  goals: string[];
  specialtyNeeded: Specialty;
  zipCode: string;
  budgetMin: number;
  budgetMax: number;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  notes: string;
}

export const SPECIALTY_LABELS: Record<Specialty, string> = {
  'physical-therapist': 'Physical Therapist',
  'massage-therapist': 'Massage Therapist',
  'strength-conditioning': 'Strength & Conditioning',
  'nutritionist': 'Nutritionist',
  'personal-trainer': 'Personal Trainer',
  'yoga-instructor': 'Yoga Instructor',
  'mental-wellness': 'Mental Wellness Coach',
};

export const HEALTH_GOALS = [
  'Injury Recovery', 'Pain Management', 'Weight Loss', 'Muscle Gain',
  'Improve Flexibility', 'Stress Relief', 'Nutrition Planning',
  'Athletic Performance', 'Post-Surgery Rehab', 'General Wellness',
];
