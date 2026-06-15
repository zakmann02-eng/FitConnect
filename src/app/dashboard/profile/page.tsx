'use client';

import { useState, useEffect } from 'react';
import { Professional, SPECIALTY_LABELS } from '@/types';
import { Loader2, CheckCircle } from 'lucide-react';

export default function DashboardProfilePage() {
  const [pro, setPro] = useState<Professional | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({ bio: '', city: '', state: '', pricingMin: 0, pricingMax: 0, acceptingClients: true, credentials: '' });

  useEffect(() => {
    const proId = localStorage.getItem('fitconnect_pro_id') || 'pro-001';
    fetch(`/api/professionals/${proId}`)
      .then((r) => r.json())
      .then((data: Professional) => {
        setPro(data);
        setForm({
          bio: data.bio,
          city: data.city,
          state: data.state,
          pricingMin: data.pricingMin,
          pricingMax: data.pricingMax,
          acceptingClients: data.acceptingClients,
          credentials: data.credentials.join(', '),
        });
        setLoading(false);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pro) return;
    setSaving(true);
    await fetch(`/api/professionals/${pro.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bio: form.bio,
        city: form.city,
        state: form.state.toUpperCase(),
        pricingMin: Number(form.pricingMin),
        pricingMax: Number(form.pricingMax),
        acceptingClients: form.acceptingClients,
        credentials: form.credentials.split(',').map((c) => c.trim()).filter(Boolean),
      }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
    </div>
  );

  if (!pro) return null;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">My Profile</h1>
      <p className="text-gray-500 text-sm mb-8">Keep your profile up to date to attract the right clients</p>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-50 mb-4">
          <div>
            <p className="font-bold text-gray-900">{pro.name}</p>
            <p className="text-emerald-600 text-sm">{SPECIALTY_LABELS[pro.specialty]}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <input type="text" maxLength={2} value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 uppercase" />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Price ($/session)</label>
              <input type="number" value={form.pricingMin} onChange={(e) => setForm({ ...form, pricingMin: Number(e.target.value) })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Price ($/session)</label>
              <input type="number" value={form.pricingMax} onChange={(e) => setForm({ ...form, pricingMax: Number(e.target.value) })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Credentials</label>
            <input type="text" value={form.credentials} onChange={(e) => setForm({ ...form, credentials: e.target.value })}
              placeholder="DPT, CSCS, OCS" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
            <p className="text-xs text-gray-400 mt-1">Comma-separated</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea rows={5} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none" />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setForm({ ...form, acceptingClients: !form.acceptingClients })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.acceptingClients ? 'bg-emerald-500' : 'bg-gray-300'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${form.acceptingClients ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
            <span className="text-sm text-gray-700 font-medium">Accepting new clients</span>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button type="submit" disabled={saving}
              className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-60 flex items-center gap-2">
              {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : 'Save Changes'}
            </button>
            {saved && (
              <span className="flex items-center gap-1.5 text-emerald-600 text-sm font-medium">
                <CheckCircle className="h-4 w-4" /> Saved!
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
