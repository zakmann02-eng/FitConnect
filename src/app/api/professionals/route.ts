import { NextRequest, NextResponse } from 'next/server';
import { getAllProfessionals, createProfessional, getProfessionalsBySpecialty } from '@/lib/data/professionals';
import { professionalSchema } from '@/lib/validations';
import { Specialty } from '@/types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const specialty = searchParams.get('specialty') as Specialty | null;
  const professionals = specialty ? getProfessionalsBySpecialty(specialty) : getAllProfessionals();
  return NextResponse.json(professionals);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = professionalSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const professional = createProfessional({
    ...parsed.data,
    photo: parsed.data.photo ?? 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop',
    rating: 0, reviewCount: 0, acceptingClients: true,
  });
  return NextResponse.json(professional, { status: 201 });
}
