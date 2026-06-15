'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Star, MapPin, CheckCircle, ArrowLeft, Loader2, Phone, Mail, User } from 'lucide-react';
import { Professional, SPECIALTY_LABELS } from '@/types';

export default function ProfessionalProfilePage() {
  const params = useParams();
  const [pro, setPro] = useState<Professional | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetch(`/api/professionals/${params.id}`)
      .then((r) => r.json())
      .then((data) => { setPro(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [params.id]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
    </div>
  );

  if (!pro || (pro as unknown as { error: string }).error) return (
    <div className="text-center py-20">
      <p className="text-gray-400 text-lg">Professional not found.</p>
      <Link href="/professionals" className="text-emerald-600 font-medium mt-2 inline-block hover:underline">
        Back to directory
      </Link>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <Link href="/professionals" className="inline-flex items-center gap-1 text-gray-500 hover:text-emerald-600 text-sm mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to professionals
      </Link>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <Image
              src={pro.photo}
              alt={pro.name}
              width={120}
              height={120}
              className="rounded-2xl object-cover w-30 h-30 shadow-sm"
              style={{ width: 120, height: 120 }}
            />
            <div className="flex-1">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{pro.name}</h1>
                  <p className="text-emerald-600 font-medium">{SPECIALTY_LABELS[pro.specialty]}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-gray-900">${pro.pricingMin}–${pro.pricingMax}</p>
                  <p className="text-sm text-gray-400">per session</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4 mt-3">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < Math.round(pro.rating) ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`} />
                  ))}
                  <span className="font-medium text-gray-700 ml-1">{pro.rating}</span>
                  <span className="text-gray-400 text-sm">({pro.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center gap-1 text-gray-500 text-sm">
                  <MapPin className="h-4 w-4" /> {pro.city}, {pro.state}
                </div>
                <span className="text-sm text-gray-500">{pro.yearsExperience} years experience</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {pro.credentials.map((c) => (
                  <span key={c} className="bg-white border border-emerald-200 text-emerald-700 text-xs px-3 py-1 rounded-full font-medium">
                    {c}
                  </span>
                ))}
                {pro.acceptingClients ? (
                  <span className="bg-emerald-100 text-emerald-700 text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1">
                    <CheckCircle className="h-3.5 w-3.5" /> Accepting Clients
                  </span>
                ) : (
                  <span className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full font-medium">Waitlist Only</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-3">About</h2>
          <p className="text-gray-600 leading-relaxed">{pro.bio}</p>
        </div>
      </div>

      {/* Contact Form */}
      {pro.acceptingClients && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
          {!showForm ? (
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Ready to Connect?</h2>
              <p className="text-gray-500 mb-5">Send {pro.name} a message and get started on your health journey.</p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
              >
                Contact {pro.name.split(' ')[0]}
              </button>
            </div>
          ) : (
            <ContactForm professional={pro} />
          )}
        </div>
      )}
    </div>
  );
}

function ContactForm({ professional }: { professional: Professional }) {
  const [form, setForm] = useState({ clientName: '', clientEmail: '', clientPhone: '', notes: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (form.clientName.length < 2) e.clientName = 'Enter your name';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.clientEmail)) e.clientEmail = 'Enter a valid email';
    if (form.clientPhone.replace(/\D/g, '').length < 10) e.clientPhone = 'Enter a valid phone number';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          goals: ['General Wellness'],
          specialtyNeeded: professional.specialty,
          zipCode: professional.zipCodes[0],
          budgetMin: professional.pricingMin,
          budgetMax: professional.pricingMax,
          matchedProfessionalId: professional.id,
        }),
      });
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  if (success) return (
    <div className="text-center py-4">
      <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
      <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
      <p className="text-gray-500">
        {professional.name.split(' ')[0]} will receive your information and reach out within 48 hours.
      </p>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Contact {professional.name}</h2>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input type="text" value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })}
            placeholder="Jane Smith" className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 ${errors.clientName ? 'border-red-400' : 'border-gray-200'}`} />
        </div>
        {errors.clientName && <p className="text-red-500 text-xs mt-1">{errors.clientName}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input type="email" value={form.clientEmail} onChange={(e) => setForm({ ...form, clientEmail: e.target.value })}
            placeholder="jane@example.com" className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 ${errors.clientEmail ? 'border-red-400' : 'border-gray-200'}`} />
        </div>
        {errors.clientEmail && <p className="text-red-500 text-xs mt-1">{errors.clientEmail}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input type="tel" value={form.clientPhone} onChange={(e) => setForm({ ...form, clientPhone: e.target.value })}
            placeholder="(512) 555-0100" className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 ${errors.clientPhone ? 'border-red-400' : 'border-gray-200'}`} />
        </div>
        {errors.clientPhone && <p className="text-red-500 text-xs mt-1">{errors.clientPhone}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Message <span className="text-gray-400 font-normal">(optional)</span></label>
        <textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
          placeholder="Tell them a bit about your goals or situation..."
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none" />
      </div>
      <button type="submit" disabled={loading}
        className="w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
        {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending...</> : 'Send Message'}
      </button>
    </form>
  );
}
===SPLIT===
'use client';

import { useState } from 'react';
import { CheckCircle, Loader2, TrendingUp, Users, Shield, Star } from 'lucide-react';
import { SPECIALTY_LABELS, Specialty } from '@/types';

const SPECIALTIES = Object.keys(SPECIALTY_LABELS) as Specialty[];

const BENEFITS = [
  {
    icon: <Users className="h-6 w-6 text-emerald-600" />,
    title: 'Qualified Leads Only',
    desc: 'Every lead has already told us their goals, budget, and location. No tire-kickers, no cold inquiries.',
  },
  {
    icon: <TrendingUp className="h-6 w-6 text-emerald-600" />,
    title: 'Grow Your Practice',
    desc: 'New client inquiries delivered directly to your dashboard. Spend less time marketing, more time doing what you love.',
  },
  {
    icon: <Shield className="h-6 w-6 text-emerald-600" />,
    title: 'No Monthly Fees',
    desc: 'FitConnect is free to join. We only win when you win. Our business model is built on long-term professional success.',
  },
  {
    icon: <Star className="h-6 w-6 text-emerald-600" />,
    title: 'Build Your Reputation',
    desc: 'A verified profile with client reviews helps you stand out in your market and build trust before the first call.',
  },
];

export default function ForProfessionalsPage() {
  const [form, setForm] = useState({
    name: '', specialty: 'physical-therapist' as Specialty, email: '', city: '', state: '',
    zipCodes: '', credentials: '', bio: '', pricingMin: '', pricingMax: '', yearsExperience: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (form.name.length < 2) e.name = 'Enter your full name';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    if (form.city.length < 2) e.city = 'Enter your city';
    if (form.state.length !== 2) e.state = 'Use 2-letter abbreviation (e.g. TX)';
    if (!form.zipCodes.trim()) e.zipCodes = 'Enter at least one ZIP code';
    if (form.bio.length < 50) e.bio = 'Bio must be at least 50 characters';
    if (!form.pricingMin || !form.pricingMax) e.pricing = 'Enter your pricing range';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/professionals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          specialty: form.specialty,
          email: form.email,
          city: form.city,
          state: form.state.toUpperCase(),
          zipCodes: form.zipCodes.split(',').map((z) => z.trim()).filter(Boolean),
          credentials: form.credentials.split(',').map((c) => c.trim()).filter(Boolean),
          bio: form.bio,
          pricingMin: Number(form.pricingMin),
          pricingMax: Number(form.pricingMax),
          yearsExperience: Number(form.yearsExperience) || 0,
        }),
      });
      if (res.ok) setSuccess(true);
      else {
        const data = await res.json();
        setErrors({ submit: data.error?.formErrors?.[0] || 'Something went wrong. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-emerald-500/20 text-emerald-300 text-sm font-semibold px-3 py-1 rounded-full mb-4">
            For Health & Wellness Professionals
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-5">
            Grow Your Practice with <span className="text-emerald-400">Qualified Leads</span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto">
            Join 500+ physical therapists, nutritionists, strength coaches, and wellness professionals
            who trust FitConnect to fill their client roster with motivated, pre-qualified leads.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Why FitConnect?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {BENEFITS.map((b) => (
              <div key={b.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-4">
                  {b.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{b.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Signup Form */}
      <section className="bg-gray-50 py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Your Professional Profile</h2>
            <p className="text-gray-500">Free to join. Start receiving leads today.</p>
          </div>

          {success ? (
            <div className="bg-white rounded-2xl border border-emerald-200 shadow-sm p-10 text-center">
              <CheckCircle className="h-14 w-14 text-emerald-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Profile Created!</h3>
              <p className="text-gray-500 mb-6">
                Welcome to FitConnect. Your profile is now live and you&apos;ll start receiving qualified leads shortly.
              </p>
              <a href="/dashboard" className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors inline-block">
                Go to Your Dashboard
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Dr. Jane Smith" className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 ${errors.name ? 'border-red-400' : 'border-gray-200'}`} />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Specialty *</label>
                  <select value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value as Specialty })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400">
                    {SPECIALTIES.map((s) => <option key={s} value={s}>{SPECIALTY_LABELS[s]}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com" className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 ${errors.email ? 'border-red-400' : 'border-gray-200'}`} />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                  <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}
                    placeholder="Austin" className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 ${errors.city ? 'border-red-400' : 'border-gray-200'}`} />
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                  <input type="text" maxLength={2} value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })}
                    placeholder="TX" className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 uppercase ${errors.state ? 'border-red-400' : 'border-gray-200'}`} />
                  {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Area ZIP Codes *</label>
                <input type="text" value={form.zipCodes} onChange={(e) => setForm({ ...form, zipCodes: e.target.value })}
                  placeholder="78701, 78702, 78703" className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 ${errors.zipCodes ? 'border-red-400' : 'border-gray-200'}`} />
                <p className="text-xs text-gray-400 mt-1">Comma-separated 5-digit ZIP codes for your service area</p>
                {errors.zipCodes && <p className="text-red-500 text-xs mt-1">{errors.zipCodes}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Credentials & Certifications</label>
                <input type="text" value={form.credentials} onChange={(e) => setForm({ ...form, credentials: e.target.value })}
                  placeholder="DPT, CSCS, OCS" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
                <p className="text-xs text-gray-400 mt-1">Comma-separated abbreviations</p>
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Price ($) *</label>
                  <input type="number" value={form.pricingMin} onChange={(e) => setForm({ ...form, pricingMin: e.target.value })}
                    placeholder="80" className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 ${errors.pricing ? 'border-red-400' : 'border-gray-200'}`} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Price ($) *</label>
                  <input type="number" value={form.pricingMax} onChange={(e) => setForm({ ...form, pricingMax: e.target.value })}
                    placeholder="150" className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 ${errors.pricing ? 'border-red-400' : 'border-gray-200'}`} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Years Exp.</label>
                  <input type="number" value={form.yearsExperience} onChange={(e) => setForm({ ...form, yearsExperience: e.target.value })}
                    placeholder="5" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
                </div>
              </div>
              {errors.pricing && <p className="text-red-500 text-xs -mt-3">{errors.pricing}</p>}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Professional Bio *</label>
                <textarea rows={4} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  placeholder="Tell potential clients about your background, specialties, and approach to care (minimum 50 characters)..."
                  className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none ${errors.bio ? 'border-red-400' : 'border-gray-200'}`} />
                <p className="text-xs text-gray-400 mt-1">{form.bio.length}/600 characters</p>
                {errors.bio && <p className="text-red-500 text-xs mt-1">{errors.bio}</p>}
              </div>

              {errors.submit && (
                <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">{errors.submit}</p>
              )}

              <button type="submit" disabled={loading}
                className="w-full bg-emerald-600 text-white py-3.5 rounded-xl font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 text-base">
                {loading ? <><Loader2 className="h-5 w-5 animate-spin" /> Creating profile...</> : 'Create My Profile — It\'s Free'}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
