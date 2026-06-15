'use client';

import { useState } from 'react';
import { IntakeFormData, Professional, Specialty, HEALTH_GOALS, SPECIALTY_LABELS } from '@/types';
import { ArrowLeft, ArrowRight, CheckCircle, Star, Loader2, MapPin, Phone, Mail, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const STEPS = ['Goals', 'Specialty', 'Location', 'Budget', 'Contact'];

const BUDGET_RANGES = [
  { label: 'Under $75/session', min: 0, max: 75 },
  { label: '$75 – $125/session', min: 75, max: 125 },
  { label: '$125 – $200/session', min: 125, max: 200 },
  { label: '$200+/session', min: 200, max: 999 },
];

const SPECIALTIES = Object.keys(SPECIALTY_LABELS) as Specialty[];

const initialData: IntakeFormData = {
  goals: [],
  specialtyNeeded: 'physical-therapist',
  zipCode: '',
  budgetMin: 0,
  budgetMax: 125,
  clientName: '',
  clientEmail: '',
  clientPhone: '',
  notes: '',
};

export default function IntakeWizard() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<IntakeFormData>(initialData);
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState<Professional[] | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = (patch: Partial<IntakeFormData>) => setData((prev) => ({ ...prev, ...patch }));

  const validateStep = (): boolean => {
    const e: Record<string, string> = {};
    if (step === 0 && data.goals.length === 0) e.goals = 'Select at least one goal';
    if (step === 2 && !/^\d{5}$/.test(data.zipCode)) e.zipCode = 'Enter a valid 5-digit ZIP code';
    if (step === 4) {
      if (data.clientName.length < 2) e.clientName = 'Enter your full name';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.clientEmail)) e.clientEmail = 'Enter a valid email';
      if (data.clientPhone.replace(/\D/g, '').length < 10) e.clientPhone = 'Enter a valid phone number';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = async () => {
    if (!validateStep()) return;
    if (step < STEPS.length - 1) {
      setStep(step + 1);
      return;
    }
    // Final submit
    setLoading(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (res.ok) {
        setMatches(json.matchedProfessionals);
        setSubmitted(true);
      } else {
        setErrors({ submit: json.error || 'Something went wrong. Please try again.' });
      }
    } catch {
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (submitted && matches) {
    return <MatchResults matches={matches} data={data} />;
  }

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between text-xs text-gray-400 mb-2">
          <span>Step {step + 1} of {STEPS.length}</span>
          <span>{STEPS[step]}</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step content */}
      <div className="min-h-[320px]">
        {step === 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">What are your health goals?</h2>
            <p className="text-gray-500 text-sm mb-6">Select all that apply</p>
            <div className="grid grid-cols-2 gap-2">
              {HEALTH_GOALS.map((goal) => {
                const selected = data.goals.includes(goal);
                return (
                  <button
                    key={goal}
                    onClick={() =>
                      update({
                        goals: selected
                          ? data.goals.filter((g) => g !== goal)
                          : [...data.goals, goal],
                      })
                    }
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium text-left transition-all ${
                      selected
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-gray-200 text-gray-700 hover:border-emerald-300'
                    }`}
                  >
                    {selected && <CheckCircle className="h-4 w-4 shrink-0" />}
                    {goal}
                  </button>
                );
              })}
            </div>
            {errors.goals && <p className="text-red-500 text-sm mt-3">{errors.goals}</p>}
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">What type of specialist do you need?</h2>
            <p className="text-gray-500 text-sm mb-6">Choose the best match for your goals</p>
            <div className="grid gap-3">
              {SPECIALTIES.map((s) => (
                <button
                  key={s}
                  onClick={() => update({ specialtyNeeded: s })}
                  className={`flex items-center justify-between px-5 py-4 rounded-xl border text-sm font-medium transition-all ${
                    data.specialtyNeeded === s
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-gray-200 text-gray-700 hover:border-emerald-300'
                  }`}
                >
                  <span>{SPECIALTY_LABELS[s]}</span>
                  {data.specialtyNeeded === s && <CheckCircle className="h-4 w-4" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Where are you located?</h2>
            <p className="text-gray-500 text-sm mb-6">We&apos;ll find professionals near you</p>
            <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                inputMode="numeric"
                maxLength={5}
                value={data.zipCode}
                onChange={(e) => update({ zipCode: e.target.value.replace(/\D/g, '') })}
                placeholder="e.g. 78701"
                className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
                  errors.zipCode ? 'border-red-400' : 'border-gray-200'
                }`}
              />
            </div>
            {errors.zipCode && <p className="text-red-500 text-sm mt-2">{errors.zipCode}</p>}
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">What&apos;s your budget?</h2>
            <p className="text-gray-500 text-sm mb-6">Per session pricing</p>
            <div className="grid gap-3">
              {BUDGET_RANGES.map((range) => {
                const selected = data.budgetMin === range.min && data.budgetMax === range.max;
                return (
                  <button
                    key={range.label}
                    onClick={() => update({ budgetMin: range.min, budgetMax: range.max })}
                    className={`flex items-center justify-between px-5 py-4 rounded-xl border text-sm font-medium transition-all ${
                      selected
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-gray-200 text-gray-700 hover:border-emerald-300'
                    }`}
                  >
                    <span>{range.label}</span>
                    {selected && <CheckCircle className="h-4 w-4" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Almost there!</h2>
            <p className="text-gray-500 text-sm mb-6">We&apos;ll send your matches and let professionals contact you</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={data.clientName}
                    onChange={(e) => update({ clientName: e.target.value })}
                    placeholder="Jane Smith"
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 ${errors.clientName ? 'border-red-400' : 'border-gray-200'}`}
                  />
                </div>
                {errors.clientName && <p className="text-red-500 text-xs mt-1">{errors.clientName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    value={data.clientEmail}
                    onChange={(e) => update({ clientEmail: e.target.value })}
                    placeholder="jane@example.com"
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 ${errors.clientEmail ? 'border-red-400' : 'border-gray-200'}`}
                  />
                </div>
                {errors.clientEmail && <p className="text-red-500 text-xs mt-1">{errors.clientEmail}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="tel"
                    value={data.clientPhone}
                    onChange={(e) => update({ clientPhone: e.target.value })}
                    placeholder="(512) 555-0100"
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 ${errors.clientPhone ? 'border-red-400' : 'border-gray-200'}`}
                  />
                </div>
                {errors.clientPhone && <p className="text-red-500 text-xs mt-1">{errors.clientPhone}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes <span className="text-gray-400 font-normal">(optional)</span></label>
                <textarea
                  rows={3}
                  value={data.notes}
                  onChange={(e) => update({ notes: e.target.value })}
                  placeholder="Any specific concerns or details that would help the professional prepare..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
                />
              </div>
            </div>
            {errors.submit && (
              <p className="text-red-500 text-sm mt-3 bg-red-50 px-3 py-2 rounded-lg">{errors.submit}</p>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-3 mt-8">
        {step > 0 && (
          <button
            onClick={() => setStep(step - 1)}
            className="flex items-center gap-2 px-5 py-3 border border-gray-200 rounded-xl text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
        )}
        <button
          onClick={handleNext}
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-emerald-700 transition-colors disabled:opacity-60"
        >
          {loading ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Finding matches...</>
          ) : step === STEPS.length - 1 ? (
            <>Get My Matches <CheckCircle className="h-4 w-4" /></>
          ) : (
            <>Continue <ArrowRight className="h-4 w-4" /></>
          )}
        </button>
      </div>
    </div>
  );
}

function MatchResults({ matches, data }: { matches: Professional[]; data: IntakeFormData }) {
  return (
    <div>
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Matches Are Ready!</h2>
        <p className="text-gray-500">
          We found {matches.length} {SPECIALTY_LABELS[data.specialtyNeeded]}
          {matches.length !== 1 ? 's' : ''} near you. Your info has been sent to the top match.
        </p>
      </div>
      <div className="space-y-4">
        {matches.map((pro, i) => (
          <div
            key={pro.id}
            className={`bg-white rounded-2xl border p-5 shadow-sm ${i === 0 ? 'border-emerald-300 ring-1 ring-emerald-200' : 'border-gray-100'}`}
          >
            {i === 0 && (
              <div className="text-xs font-bold text-emerald-600 mb-2 uppercase tracking-wider">Top Match</div>
            )}
            <div className="flex gap-4">
              <Image
                src={pro.photo}
                alt={pro.name}
                width={64}
                height={64}
                className="rounded-xl object-cover w-16 h-16 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-gray-900">{pro.name}</h3>
                    <p className="text-emerald-600 text-sm">{SPECIALTY_LABELS[pro.specialty]}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-gray-900">${pro.pricingMin}–${pro.pricingMax}</p>
                    <p className="text-xs text-gray-400">per session</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className={`h-3 w-3 ${j < Math.round(pro.rating) ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`} />
                  ))}
                  <span className="text-xs text-gray-500 ml-1">{pro.rating} ({pro.reviewCount} reviews)</span>
                </div>
                <p className="text-gray-500 text-xs mt-2 line-clamp-2">{pro.bio}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {pro.credentials.map((c) => (
                    <span key={c} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{c}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4">
              <Link
                href={`/professionals/${pro.id}`}
                className="block w-full text-center bg-emerald-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors"
              >
                View Full Profile
              </Link>
            </div>
          </div>
        ))}
      </div>
      <p className="text-center text-xs text-gray-400 mt-6">
        Your contact information has been shared with your top match. Expect to hear back within 48 hours.
      </p>
    </div>
  );
}
