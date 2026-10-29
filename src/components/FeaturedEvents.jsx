'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MapPin, Heart, ArrowRight, Ticket } from 'lucide-react';

export default function FeaturedEvents({
  events = [],
  onSelectEvent,
  title = 'Featured across the UK',
  subtitle = 'Discover events, food, and community',
}) {
  const [favorites, setFavorites] = useState({});

  const toggleFavorite = (id, e) => {
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (!events || events.length === 0) {
    return (
      <section className="py-8 px-4 max-w-7xl mx-auto text-center">
        <p className="text-stone-500 text-xs sm:text-sm">No featured events currently available.</p>
      </section>
    );
  }

  return (
    <section className="py-6 sm:py-10 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full overflow-hidden">
      
      {/* Header section matching screenshot 1 */}
      <div className="flex items-end justify-between mb-4 sm:mb-6">
        <div>
          <h2 className="text-xl sm:text-3xl font-bold font-serif text-stone-900 tracking-tight">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5 sm:mt-1">
            {subtitle}
          </p>
        </div>
        <Link
          href="/events"
          className="text-pink-600 hover:text-pink-700 text-xs sm:text-sm font-semibold flex items-center space-x-1 shrink-0 group ml-2"
        >
          <span>All listings</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Responsive layout: Smooth horizontal swipe on mobile, 3-column grid on desktop */}
      <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 overflow-x-auto pb-4 md:pb-0 hide-scrollbar snap-x snap-mandatory">
        {events.map((event) => {
          const minPrice =
            event.variants && event.variants.length > 0
              ? Math.min(...event.variants.map((v) => v.price))
              : 0;

          return (
            <div
              key={event._id}
              onClick={() => onSelectEvent && onSelectEvent(event)}
              className="shrink-0 w-[240px] sm:w-[280px] md:w-auto snap-start bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-200/80 cursor-pointer flex flex-col group select-none"
            >
              {/* Event Poster Image & Overlays */}
              <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-stone-900">
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                {/* Featured Pink Badge */}
                {event.isFeatured && (
                  <div className="absolute top-2.5 left-2.5 bg-pink-600 text-white text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center space-x-1 shadow-md">
                    <span>★</span>
                    <span>Featured</span>
                  </div>
                )}

                {/* Heart / Wishlist Button */}
                <button
                  onClick={(e) => toggleFavorite(event._id, e)}
                  className="absolute top-2.5 right-2.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/80 hover:bg-white backdrop-blur-sm flex items-center justify-center text-stone-700 hover:text-pink-600 shadow-md transition-colors"
                  aria-label="Save to favorites"
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      favorites[event._id] ? 'fill-pink-600 text-pink-600' : ''
                    }`}
                  />
                </button>

                {/* Date Badge (rounded circular pill as in screenshots) */}
                <div className="absolute bottom-2.5 right-2.5 bg-white/95 backdrop-blur-md text-stone-900 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl sm:rounded-2xl shadow-lg flex flex-col items-center justify-center min-w-[46px] border border-stone-100">
                  <span className="text-[9px] sm:text-[10px] font-bold text-pink-600 tracking-wider uppercase leading-none">
                    {event.displayMonth || 'AUG'}
                  </span>
                  <span className="text-sm sm:text-base font-extrabold text-stone-900 leading-tight">
                    {event.displayDay || '23'}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-3.5 sm:p-5 flex-1 flex flex-col justify-between">
                <div>
                  {/* Category & Location metadata */}
                  <div className="flex items-center justify-between text-[11px] sm:text-xs mb-1.5">
                    <span className="font-bold text-pink-600 tracking-wider uppercase">
                      {event.category || 'MUSIC'}
                    </span>
                    <div className="flex items-center text-stone-500 space-x-1">
                      <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                      <span className="font-medium truncate max-w-[90px]">{event.city || 'London'}</span>
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="font-bold text-sm sm:text-base text-stone-900 line-clamp-1 group-hover:text-pink-600 transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-stone-500 line-clamp-1 mt-0.5">
                    {event.subtitle || event.venue}
                  </p>
                </div>

                {/* Ticket Variants Preview & Price */}
                <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-[11px] text-stone-600 font-medium">
                    <Ticket className="w-3 h-3 text-pink-500 shrink-0" />
                    <span>
                      {event.variants?.length || 1} {event.variants?.length === 1 ? 'Tier' : 'Tiers'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-stone-400 mr-1">from</span>
                    <span className="font-bold text-sm sm:text-base text-stone-900">
                      {minPrice === 0 ? 'FREE' : `£${minPrice}`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
