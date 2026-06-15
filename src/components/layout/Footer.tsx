import Link from 'next/link';
import { Activity } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <Activity className="h-5 w-5 text-emerald-500" />
              <span className="font-bold text-white text-lg">FitConnect</span>
            </Link>
            <p className="text-sm leading-relaxed">Connecting people with the right health & wellness professionals.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">For Clients</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/find-a-specialist" className="hover:text-emerald-400 transition-colors">Find a Specialist</Link></li>
              <li><Link href="/professionals" className="hover:text-emerald-400 transition-colors">Browse Professionals</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">For Professionals</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/for-professionals" className="hover:text-emerald-400 transition-colors">Join FitConnect</Link></li>
              <li><Link href="/dashboard" className="hover:text-emerald-400 transition-colors">Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><span>About</span></li><li><span>Privacy</span></li><li><span>Terms</span></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 text-sm text-center">© {new Date().getFullYear()} FitConnect. All rights reserved.</div>
      </div>
    </footer>
  );
}
