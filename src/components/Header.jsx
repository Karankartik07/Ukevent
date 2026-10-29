'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Search,
  Radio as RadioIcon,
  Shield,
  Menu,
  X,
  ChevronDown,
  Home,
  Calendar,
  Utensils,
  ExternalLink,
} from 'lucide-react';

const UK_CITIES = ['All UK', 'London', 'Birmingham', 'Leicester', 'Manchester', 'Leeds', 'Edinburgh', 'Glasgow'];

export default function Header({ selectedCity, onSelectCity, onSearch, searchQuery = '' }) {
  const [cityOpen, setCityOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#240727] text-white shadow-md border-b border-purple-950/40 w-full">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-20">
            
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 shrink-0 group">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-pink-500 via-rose-500 to-amber-400 p-[1.5px] shadow-lg shadow-pink-500/20 group-hover:scale-105 transition-transform shrink-0">
                <div className="w-full h-full bg-[#240727] rounded-[10px] flex items-center justify-center">
                  <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-amber-300 text-xs sm:text-base tracking-tight">
                    MI
                  </span>
                </div>
              </div>
              <div className="flex items-baseline">
                <span className="font-bold text-lg sm:text-2xl text-pink-500 tracking-tight">Mera</span>
                <span className="font-bold text-lg sm:text-2xl text-amber-400 tracking-tight">India</span>
                <span className="ml-1.5 hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded bg-pink-500/20 text-pink-300 border border-pink-500/30">
                  UK
                </span>
              </div>
            </Link>

            {/* Desktop Search Bar (Hidden on Mobile) */}
            <div className="hidden md:flex flex-1 max-w-md mx-6 lg:mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearch && onSearch(e.target.value)}
                  placeholder="Search Indian concerts, Diwali, Eid, food..."
                  className="w-full pl-10 pr-4 py-2 bg-purple-950/60 border border-purple-800/60 rounded-full text-sm text-white placeholder-purple-300/60 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Navigation Links - Desktop Only */}
            <nav className="hidden lg:flex items-center space-x-6 text-sm font-medium">
              <Link href="/" className="text-pink-400 hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/events" className="text-purple-200 hover:text-pink-400 transition-colors">
                Events
              </Link>
              <Link href="/listings" className="text-purple-200 hover:text-pink-400 transition-colors">
                Culture & Food
              </Link>
              <Link href="/radio" className="text-purple-200 hover:text-pink-400 transition-colors flex items-center space-x-1">
                <RadioIcon className="w-3.5 h-3.5 text-pink-500 animate-pulse" />
                <span>Live Radio</span>
              </Link>
            </nav>

            {/* Right Header Actions */}
            <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
              
              {/* City Selector */}
              <div className="relative">
                <button
                  onClick={() => setCityOpen(!cityOpen)}
                  className="flex items-center space-x-1 sm:space-x-1.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-full bg-purple-950/80 border border-purple-800/80 hover:border-pink-500/60 text-xs sm:text-sm font-medium text-purple-100 transition-all"
                  title="Select UK City"
                >
                  <MapPin className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                  <span className="text-xs sm:text-sm max-w-[65px] sm:max-w-none truncate">
                    {selectedCity || 'London'}
                  </span>
                  <ChevronDown className="w-3 h-3 text-purple-400 hidden sm:inline" />
                </button>

                {cityOpen && (
                  <div className="absolute right-0 mt-2 w-44 rounded-2xl bg-[#2a082e] border border-purple-800/80 shadow-2xl py-1.5 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-3 py-1.5 text-[11px] font-semibold text-purple-300 uppercase tracking-wider border-b border-purple-900/60">
                      Filter by UK City
                    </div>
                    {UK_CITIES.map((city) => (
                      <button
                        key={city}
                        onClick={() => {
                          onSelectCity && onSelectCity(city === 'All UK' ? '' : city);
                          setCityOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs transition-colors flex items-center justify-between ${
                          (selectedCity === city || (!selectedCity && city === 'All UK'))
                            ? 'text-pink-400 font-semibold bg-pink-500/10'
                            : 'text-purple-200 hover:bg-purple-900/50'
                        }`}
                      >
                        <span>{city}</span>
                        {(selectedCity === city || (!selectedCity && city === 'All UK')) && (
                          <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Desktop Admin Portal Button */}
              <Link
                href="/admin"
                className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white text-xs sm:text-sm font-semibold shadow-md shadow-pink-600/30 transition-all hover:scale-105"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin Portal</span>
              </Link>

              {/* Hamburger Icon for Mobile & Tablet */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-purple-200 hover:text-white bg-purple-950/70 border border-purple-800/60 hover:bg-purple-900/80 transition-all focus:outline-none flex items-center justify-center"
                aria-label="Open Navigation Menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 text-pink-400" />
                ) : (
                  <Menu className="w-5 h-5 text-white" />
                )}
              </button>

            </div>
          </div>
        </div>
      </header>

      {/* Slide-out Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer content */}
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-[#240727] text-white shadow-2xl p-5 flex flex-col justify-between z-50 border-l border-purple-900/80 animate-in slide-in-from-right duration-200 overflow-y-auto">
            
            {/* Top drawer bar */}
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-purple-900/60">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-amber-400 p-[1.5px]">
                    <div className="w-full h-full bg-[#240727] rounded-[6px] flex items-center justify-center font-bold text-xs text-pink-400">
                      MI
                    </div>
                  </div>
                  <span className="font-bold text-base text-pink-500">
                    Mera<span className="text-amber-400">India</span>
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg bg-purple-950 text-purple-300 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search inside Drawer */}
              <div className="relative my-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearch && onSearch(e.target.value)}
                  placeholder="Search events, concerts..."
                  className="w-full pl-9 pr-3 py-2 bg-purple-950 border border-purple-800 rounded-xl text-xs text-white placeholder-purple-400/50 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              {/* Navigation Links with Icons */}
              <nav className="space-y-1.5">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-pink-400 bg-purple-900/40"
                >
                  <Home className="w-4 h-4 text-pink-400" />
                  <span>Home</span>
                </Link>

                <Link
                  href="/events"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium text-purple-200 hover:bg-purple-900/40 hover:text-white transition-colors"
                >
                  <Calendar className="w-4 h-4 text-purple-400" />
                  <span>Featured Events & Tickets</span>
                </Link>

                <Link
                  href="/listings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium text-purple-200 hover:bg-purple-900/40 hover:text-white transition-colors"
                >
                  <Utensils className="w-4 h-4 text-purple-400" />
                  <span>Culture & Food Directory</span>
                </Link>

                <Link
                  href="/radio"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium text-purple-200 hover:bg-purple-900/40 hover:text-white transition-colors"
                >
                  <RadioIcon className="w-4 h-4 text-pink-500 animate-pulse" />
                  <span>South Asian Live Radio</span>
                </Link>
              </nav>

              {/* City quick filter pills */}
              <div className="mt-5 pt-4 border-t border-purple-900/60">
                <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider block mb-2">
                  Select UK Location
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {UK_CITIES.slice(0, 6).map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        onSelectCity && onSelectCity(c === 'All UK' ? '' : c);
                        setMobileMenuOpen(false);
                      }}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                        (selectedCity === c || (!selectedCity && c === 'All UK'))
                          ? 'bg-pink-600 text-white border-pink-500 font-bold'
                          : 'bg-purple-950/80 text-purple-300 border-purple-800'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Drawer Admin Link */}
            <div className="pt-4 border-t border-purple-900/60 mt-6">
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-md shadow-pink-600/30"
              >
                <Shield className="w-4 h-4" />
                <span>Admin Management Portal</span>
              </Link>
              <p className="text-[10px] text-purple-400/70 text-center mt-2">
                MeraIndia UK • Cultural Events Hub
              </p>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
