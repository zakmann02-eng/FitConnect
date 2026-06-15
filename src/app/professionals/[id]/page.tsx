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
