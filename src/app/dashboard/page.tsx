'use client';

import { useState, useEffect } from 'react';
import { Lead, LeadStatus, Professional, SPECIALTY_LABELS } from '@/types';
import { TrendingUp, Users, CheckCircle, Clock, Loader2 } from 'lucide-react';

const STATUS_COLORS: Record<LeadStatus, string> = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-yellow-100 text-yellow-700',
  converted: 'bg-emerald-100 text-emerald-700',
  closed: 'bg-gray-100 text-gray-500',
};

const STATUS_OPTIONS: { value: LeadStatus; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'converted', label: 'Converted' },
  { value: 'closed', label: 'Closed' },
];

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [professional, setProfessional] = useState<Professional | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const stored = localStorage.getItem('fitconnect_pro_id') || 'pro-001';
    Promise.all([
      fetch(`/api/leads?professionalId=${stored}`).then((r) => r.json()),
      fetch(`/api/professionals/${stored}`).then((r) => r.json()),
    ]).then(([leadsData, proData]) => {
      setLeads(leadsData);
      setProfessional(proData);
      setLoading(false);
    });
  }, []);

  const updateStatus = async (leadId: string, status: LeadStatus) => {
    const res = await fetch(`/api/leads/${leadId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      const updated = await res.json();
      setLeads((prev) => prev.map((l) => (l.id === leadId ? updated : l)));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  const thisWeek = leads.filter((l) => {
    const d = new Date(l.createdAt);
    const now = new Date();
    return now.getTime() - d.getTime() < 7 * 24 * 60 * 60 * 1000;
  });
  const converted = leads.filter((l) => l.status === 'converted');

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {professional ? `Welcome back, ${professional.name.split(' ')[0]}` : 'Dashboard'}
        </h1>
        {professional && (
          <p className="text-gray-500 text-sm mt-1">
            {SPECIALTY_LABELS[professional.specialty]} · {professional.city}, {professional.state}
          </p>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Leads', value: leads.length, icon: <Users className="h-5 w-5 text-blue-500" />, bg: 'bg-blue-50' },
          { label: 'New This Week', value: thisWeek.length, icon: <Clock className="h-5 w-5 text-yellow-500" />, bg: 'bg-yellow-50' },
          { label: 'Converted', value: converted.length, icon: <CheckCircle className="h-5 w-5 text-emerald-500" />, bg: 'bg-emerald-50' },
          {
            label: 'Conversion Rate',
            value: leads.length ? `${Math.round((converted.length / leads.length) * 100)}%` : '—',
            icon: <TrendingUp className="h-5 w-5 text-purple-500" />,
            bg: 'bg-purple-50',
          },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
              {stat.icon}
            </div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-500 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50">
          <h2 className="font-bold text-gray-900">Incoming Leads</h2>
          <p className="text-sm text-gray-400 mt-0.5">Update status as you contact each client</p>
        </div>

        {leads.length === 0 ? (
          <div className="text-center py-16">
            <Users className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400">No leads yet. Your profile is live — check back soon!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400 uppercase tracking-wider bg-gray-50/60">
                  <th className="px-6 py-3 font-medium">Client</th>
                  <th className="px-6 py-3 font-medium">Contact</th>
                  <th className="px-6 py-3 font-medium">Goals</th>
                  <th className="px-6 py-3 font-medium">Budget</th>
                  <th className="px-6 py-3 font-medium">Received</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{lead.clientName}</p>
                      <p className="text-xs text-gray-400">{lead.zipCode}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-700">{lead.clientEmail}</p>
                      <p className="text-xs text-gray-400">{lead.clientPhone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-[160px]">
                        {lead.goals.slice(0, 2).map((g) => (
                          <span key={g} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{g}</span>
                        ))}
                        {lead.goals.length > 2 && (
                          <span className="text-xs text-gray-400">+{lead.goals.length - 2}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      ${lead.budgetMin}–${lead.budgetMax}
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs whitespace-nowrap">
                      {new Date(lead.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={lead.status}
                        onChange={(e) => updateStatus(lead.id, e.target.value as LeadStatus)}
                        className={`text-xs font-medium px-2.5 py-1.5 rounded-lg border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-400 ${STATUS_COLORS[lead.status]}`}
                      >
                        {STATUS_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
