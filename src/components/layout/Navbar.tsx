'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Activity } from 'lucide-react';

const navLinks = [
  { href: '/find-a-specialist', label: 'Find a Specialist' },
  { href: '/professionals', label: 'Browse Professionals' },
  { href: '/for-professionals', label: 'For Professionals' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-emerald-600" />
            <span className="font-bold text-xl text-gray-900">FitConnect</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} className="text-gray-600 hover:text-emerald-600 text-sm font-medium transition-colors">{l.label}</Link>
            ))}
            <Link href="/dashboard" className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors">Pro Dashboard</Link>
          </div>
          <button className="md:hidden p-2 rounded-md text-gray-600" onClick={() => setOpen(!open)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="block text-gray-700 hover:text-emerald-600 font-medium" onClick={() => setOpen(false)}>{l.label}</Link>
          ))}
          <Link href="/dashboard" className="block bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium text-center" onClick={() => setOpen(false)}>Pro Dashboard</Link>
        </div>
      )}
    </nav>
  );
}
