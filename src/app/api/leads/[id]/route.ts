import { NextRequest, NextResponse } from 'next/server';
import { updateLeadStatus } from '@/lib/data/leads';
import { LeadStatus } from '@/types';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const body = await request.json();
  const { status } = body as { status: LeadStatus };
  const valid: LeadStatus[] = ['new', 'contacted', 'converted', 'closed'];
  if (!valid.includes(status)) return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  const lead = updateLeadStatus(params.id, status);
  if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
  return NextResponse.json(lead);
}
