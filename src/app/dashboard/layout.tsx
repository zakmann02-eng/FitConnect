import Link from 'next/link';
import { Activity, LayoutDashboard, User, LogOut } from 'lucide-react';

export const metadata = { title: 'Dashboard — FitConnect' };

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-gray-50">
      <aside className="w-56 bg-white border-r border-gray-100 flex flex-col py-6 px-3 shrink-0 hidden md:flex">
        <div className="flex items-center gap-2 px-3 mb-8">
          <Activity className="h-5 w-5 text-emerald-600" />
          <span className="font-bold text-gray-900">Pro Dashboard</span>
        </div>
        <nav className="space-y-1 flex-1">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 text-sm font-medium transition-colors">
            <LayoutDashboard className="h-4 w-4" /> Leads
          </Link>
          <Link href="/dashboard/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 text-sm font-medium transition-colors">
            <User className="h-4 w-4" /> My Profile
          </Link>
        </nav>
        <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:text-gray-700 text-sm font-medium transition-colors">
          <LogOut className="h-4 w-4" /> Exit Dashboard
        </Link>
      </aside>
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}
