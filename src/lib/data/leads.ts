import { Lead, LeadStatus } from '@/types';

const leadStore: Lead[] = [
  {
    id: 'lead-001',
    clientName: 'Alex Thompson',
    clientEmail: 'alex.t@example.com',
    clientPhone: '512-555-0101',
    goals: ['Injury Recovery', 'Pain Management'],
    specialtyNeeded: 'physical-therapist',
    zipCode: '78701',
    budgetMin: 100,
    budgetMax: 200,
    notes: 'Recovering from ACL surgery 3 months ago, looking to return to recreational soccer.',
    matchedProfessionalId: 'pro-001',
    status: 'new',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'lead-002',
    clientName: 'Jordan Lee',
    clientEmail: 'jordan.lee@example.com',
    clientPhone: '512-555-0102',
    goals: ['Muscle Gain', 'Athletic Performance'],
    specialtyNeeded: 'strength-conditioning',
    zipCode: '78745',
    budgetMin: 75,
    budgetMax: 150,
    notes: 'Training for my first powerlifting meet in 6 months.',
    matchedProfessionalId: 'pro-002',
    status: 'contacted',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'lead-003',
    clientName: 'Maria Santos',
    clientEmail: 'maria.s@example.com',
    clientPhone: '512-555-0103',
    goals: ['Weight Loss', 'Nutrition Planning'],
    specialtyNeeded: 'nutritionist',
    zipCode: '78702',
    budgetMin: 80,
    budgetMax: 160,
    notes: 'Diagnosed with pre-diabetes, want to manage blood sugar through diet changes.',
    matchedProfessionalId: 'pro-003',
    status: 'converted',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export function getAllLeads(): Lead[] { return leadStore; }
export function getLeadsByProfessionalId(professionalId: string): Lead[] {
  return leadStore.filter((l) => l.matchedProfessionalId === professionalId);
}
export function createLead(data: Omit<Lead, 'id' | 'createdAt'>): Lead {
  const lead: Lead = { ...data, id: `lead-${Date.now()}`, createdAt: new Date().toISOString() };
  leadStore.push(lead);
  return lead;
}
export function updateLeadStatus(id: string, status: LeadStatus): Lead | undefined {
  const index = leadStore.findIndex((l) => l.id === id);
  if (index === -1) return undefined;
  leadStore[index] = { ...leadStore[index], status };
  return leadStore[index];
}
