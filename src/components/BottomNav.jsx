'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, MapPin, Radio as RadioIcon } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  // Don't render inside admin dashboard
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Events', href: '/events', icon: Calendar },
    { label: 'Listings', href: '/listings', icon: MapPin },
    { label: 'Radio', href: '/radio', icon: RadioIcon },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/90 backdrop-blur-lg border-t border-stone-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-3 py-1.5 pb-safe">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all ${
                isActive
                  ? 'text-pink-600 font-semibold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-pink-600" />
                )}
              </div>
              <span className="text-[11px] mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
