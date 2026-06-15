import { NextRequest, NextResponse } from 'next/server';
import { getProfessionalById, updateProfessional } from '@/lib/data/professionals';

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const professional = getProfessionalById(params.id);
  if (!professional) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(professional);
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const body = await request.json();
  const updated = updateProfessional(params.id, body);
  if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(updated);
}
