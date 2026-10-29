'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Calendar,
  PlusCircle,
  ExternalLink,
  LogOut,
  Shield,
  Menu,
  X,
  Sparkles,
  Layers,
  ChevronRight,
} from 'lucide-react';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [adminUser, setAdminUser] = useState(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // If on /admin/login, don't show the admin dashboard shell
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (!isLoginPage) {
      fetch('/api/auth/me')
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setAdminUser(data.admin);
          }
        })
        .catch(() => {});
    }
  }, [isLoginPage]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  const navLinks = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Manage Events', href: '/admin/events', icon: Calendar },
    { label: 'Create New Event', href: '/admin/events/new', icon: PlusCircle },
  ];

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col md:flex-row text-stone-900">
      
      {/* Mobile Admin Header */}
      <div className="md:hidden bg-[#240727] text-white p-4 flex items-center justify-between border-b border-purple-900/60 sticky top-0 z-30">
        <Link href="/admin" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-pink-500 to-amber-400 p-[1px]">
            <div className="w-full h-full bg-[#240727] rounded-[7px] flex items-center justify-center">
              <span className="font-extrabold text-xs text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-amber-300">
                MI
              </span>
            </div>
          </div>
          <span className="font-bold text-base text-pink-500">MeraIndia <span className="text-amber-400 text-xs font-normal">Admin</span></span>
        </Link>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-1.5 rounded-lg text-purple-200 hover:text-white"
        >
          {mobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Desktop & Mobile Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#240727] text-white flex flex-col justify-between transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen shrink-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Sidebar Brand */}
          <div className="p-6 border-b border-purple-900/60">
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-amber-400 p-[1.5px] shadow-lg">
                <div className="w-full h-full bg-[#240727] rounded-[10px] flex items-center justify-center">
                  <span className="font-extrabold text-sm text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-amber-300">
                    MI
                  </span>
                </div>
              </div>
              <div>
                <span className="font-bold text-lg text-pink-500 block leading-tight">Mera<span className="text-amber-400">India</span></span>
                <span className="text-[10px] text-purple-300 uppercase tracking-widest font-semibold">Admin Panel</span>
              </div>
            </Link>
          </div>

          {/* Nav links */}
          <nav className="p-4 space-y-1.5">
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-purple-400">
              Management
            </div>
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30'
                      : 'text-purple-200 hover:bg-purple-900/50 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            <div className="pt-4 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-purple-400">
              Public Portal
            </div>
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-purple-200 hover:bg-purple-900/50 hover:text-white transition-all"
            >
              <div className="flex items-center space-x-3">
                <ExternalLink className="w-4 h-4 text-pink-400" />
                <span>View Live Site</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-purple-400" />
            </Link>
          </nav>
        </div>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-purple-900/60">
          <div className="bg-purple-950/60 p-3 rounded-2xl border border-purple-800/60 mb-3 flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-pink-300 font-bold text-xs">
              <Shield className="w-4 h-4 text-pink-400" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{adminUser?.name || 'Admin User'}</p>
              <p className="text-[11px] text-purple-300 truncate">{adminUser?.email || 'admin@meraindia.co.uk'}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-2 px-3 rounded-xl bg-purple-900/40 hover:bg-rose-900/50 text-rose-300 hover:text-rose-100 text-xs font-semibold flex items-center justify-center space-x-2 border border-purple-800/40 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>

    </div>
  );
}
