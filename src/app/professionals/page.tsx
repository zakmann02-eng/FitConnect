import { getAllProfessionals } from '@/lib/data/professionals';
import { SPECIALTY_LABELS, Specialty } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { Star, MapPin, CheckCircle } from 'lucide-react';

export const metadata = { title: 'Browse Professionals — FitConnect' };

const SPECIALTIES = Object.keys(SPECIALTY_LABELS) as Specialty[];

export default function ProfessionalsPage({
  searchParams,
}: {
  searchParams: { specialty?: string };
}) {
  const all = getAllProfessionals();
  const activeSpecialty = searchParams.specialty as Specialty | undefined;
  const filtered = activeSpecialty
    ? all.filter((p) => p.specialty === activeSpecialty)
    : all;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Health & Wellness Professionals</h1>
        <p className="text-gray-500">
          {filtered.length} verified professionals
          {activeSpecialty ? ` in ${SPECIALTY_LABELS[activeSpecialty]}` : ''}
        </p>
      </div>

      {/* Specialty Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
        <Link
          href="/professionals"
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            !activeSpecialty
              ? 'bg-emerald-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Specialties
        </Link>
        {SPECIALTIES.map((s) => (
          <Link
            key={s}
            href={`/professionals?specialty=${s}`}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeSpecialty === s
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {SPECIALTY_LABELS[s]}
          </Link>
        ))}
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((pro) => (
          <Link
            key={pro.id}
            href={`/professionals/${pro.id}`}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
          >
            <div className="p-5">
              <div className="flex gap-4">
                <Image
                  src={pro.photo}
                  alt={pro.name}
                  width={72}
                  height={72}
                  className="rounded-xl object-cover w-18 h-18 shrink-0"
                  style={{ width: 72, height: 72 }}
                />
                <div className="min-w-0">
                  <h3 className="font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">{pro.name}</h3>
                  <p className="text-emerald-600 text-sm font-medium">{SPECIALTY_LABELS[pro.specialty]}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-medium text-gray-700">{pro.rating}</span>
                    <span className="text-xs text-gray-400">({pro.reviewCount})</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-500 text-sm mt-3 line-clamp-2">{pro.bio}</p>

              <div className="flex flex-wrap gap-1 mt-3">
                {pro.credentials.slice(0, 3).map((c) => (
                  <span key={c} className="bg-emerald-50 text-emerald-700 text-xs px-2 py-0.5 rounded-full font-medium">
                    {c}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                <div className="flex items-center gap-1 text-gray-400 text-xs">
                  <MapPin className="h-3.5 w-3.5" />
                  {pro.city}, {pro.state}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900">
                    ${pro.pricingMin}–${pro.pricingMax}
                  </span>
                  {pro.acceptingClients ? (
                    <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                      <CheckCircle className="h-3.5 w-3.5" /> Open
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">Waitlist</span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">No professionals found for this specialty.</p>
          <Link href="/professionals" className="text-emerald-600 font-medium mt-2 inline-block hover:underline">
            View all professionals
          </Link>
        </div>
      )}
    </div>
  );
}
