import { NextRequest, NextResponse } from 'next/server';
import { createLead, getLeadsByProfessionalId, getAllLeads } from '@/lib/data/leads';
import { getAllProfessionals } from '@/lib/data/professionals';
import { matchProfessionals } from '@/lib/matching';
import { intakeSchema } from '@/lib/validations';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const professionalId = searchParams.get('professionalId');
  const leads = professionalId ? getLeadsByProfessionalId(professionalId) : getAllLeads();
  return NextResponse.json(leads);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = intakeSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const data = parsed.data;
  const professionals = getAllProfessionals();
  const matches = matchProfessionals(data, professionals);
  if (matches.length === 0) return NextResponse.json({ error: 'No matching professionals found' }, { status: 404 });
  const lead = createLead({
    clientName: data.clientName, clientEmail: data.clientEmail, clientPhone: data.clientPhone,
    goals: data.goals, specialtyNeeded: data.specialtyNeeded, zipCode: data.zipCode,
    budgetMin: data.budgetMin, budgetMax: data.budgetMax, notes: data.notes ?? '',
    matchedProfessionalId: matches[0].id, status: 'new',
  });
  return NextResponse.json({ lead, matchedProfessionals: matches });
}
