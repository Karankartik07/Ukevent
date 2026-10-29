'use client';

import { useState } from 'react';
import { Search, MapPin, Calendar, Sparkles } from 'lucide-react';

export default function HeroBanner({ onSearchSubmit, onScrollToEvents }) {
  const [keyword, setKeyword] = useState('');
  const [city, setCity] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearchSubmit) {
      onSearchSubmit({ keyword, city, category });
    }
  };

  return (
    <div className="relative overflow-hidden bg-[#240727] text-white w-full">
      {/* Background Hero Image with Taj Mahal */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1800&auto=format&fit=crop&q=80"
          alt="Taj Mahal reflection - Indian Heritage"
          className="w-full h-full object-cover object-center opacity-40 transform scale-105 filter brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#240727] via-[#240727]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#240727]/80 via-transparent to-[#240727]/80" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-20 lg:py-24 text-center flex flex-col items-center">
        
        {/* Glow badge */}
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-pink-500/20 border border-pink-500/30 text-pink-300 text-[11px] sm:text-xs font-semibold mb-3 backdrop-blur-sm">
          <Sparkles className="w-3.5 h-3.5 text-pink-400" />
          <span>UK South Asian Community & Events Hub</span>
        </div>

        {/* Hero Title (Matches Screenshot 1 & 4) */}
        <h1 className="text-3xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight font-serif mb-3 sm:mb-4">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-rose-400 to-amber-300">
            MeraIndia
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-xl text-xs sm:text-base lg:text-lg text-stone-200 font-light leading-relaxed mb-6 sm:mb-8 px-2">
          Discover events, culture, food, and community across the UK South Asian diaspora.
        </p>

        {/* Mobile Discover Button (Matches Screenshot 1 & 4) */}
        <div className="md:hidden w-full max-w-[240px] mb-2">
          <button
            onClick={onScrollToEvents}
            className="w-full py-3 px-6 rounded-full bg-gradient-to-r from-pink-600 via-rose-500 to-pink-500 text-white font-bold text-sm shadow-lg shadow-pink-600/40 active:scale-95 transition-all"
          >
            Discover Events
          </button>
        </div>

        {/* Desktop / Tablet Interactive Search Card */}
        <div className="hidden md:block w-full max-w-4xl bg-stone-900/85 backdrop-blur-md p-3 rounded-2xl border border-stone-700/60 shadow-2xl">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-2">
            
            {/* Keyword Input */}
            <div className="relative flex items-center bg-stone-800/80 rounded-xl px-3 py-2 border border-stone-700/50">
              <Search className="w-4 h-4 text-pink-400 mr-2 shrink-0" />
              <input
                type="text"
                placeholder="Artist, concert, or festival..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full bg-transparent text-sm text-white placeholder-stone-400 focus:outline-none"
              />
            </div>

            {/* City Selector */}
            <div className="relative flex items-center bg-stone-800/80 rounded-xl px-3 py-2 border border-stone-700/50">
              <MapPin className="w-4 h-4 text-pink-400 mr-2 shrink-0" />
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-transparent text-sm text-stone-200 focus:outline-none cursor-pointer"
              >
                <option value="" className="bg-stone-900 text-white">All UK Locations</option>
                <option value="London" className="bg-stone-900 text-white">London & Wembley</option>
                <option value="Birmingham" className="bg-stone-900 text-white">Birmingham & Midlands</option>
                <option value="Leicester" className="bg-stone-900 text-white">Leicester</option>
                <option value="Manchester" className="bg-stone-900 text-white">Manchester</option>
                <option value="Leeds" className="bg-stone-900 text-white">Leeds</option>
              </select>
            </div>

            {/* Category */}
            <div className="relative flex items-center bg-stone-800/80 rounded-xl px-3 py-2 border border-stone-700/50">
              <Calendar className="w-4 h-4 text-pink-400 mr-2 shrink-0" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-transparent text-sm text-stone-200 focus:outline-none cursor-pointer"
              >
                <option value="" className="bg-stone-900 text-white">All Categories</option>
                <option value="MUSIC" className="bg-stone-900 text-white">Music & Concerts</option>
                <option value="FESTIVAL" className="bg-stone-900 text-white">Festivals & Melas</option>
                <option value="CULTURE" className="bg-stone-900 text-white">Arts & Dance</option>
                <option value="FOOD" className="bg-stone-900 text-white">Food & Dining</option>
              </select>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white text-sm font-semibold shadow-md shadow-pink-600/30 transition-all flex items-center justify-center space-x-2"
            >
              <Search className="w-4 h-4" />
              <span>Search Events</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
