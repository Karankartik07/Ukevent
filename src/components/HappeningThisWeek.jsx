'use client';

import { useState, useMemo } from 'react';
import {
  Calendar,
  MapPin,
  Ticket,
  ExternalLink,
  Flame,
  Sparkles,
  Heart,
  Clock,
  ArrowUpRight,
  Filter,
} from 'lucide-react';
import { deduplicateEvents } from '@/lib/eventDeduplication';

/**
 * Returns a human-friendly platform badge config
 */
function getPlatformBadge(source = 'MERAINDIA') {
  const norm = (source || '').toUpperCase();
  switch (norm) {
    case 'TICKETMASTER':
      return {
        name: 'Ticketmaster',
        bg: 'bg-blue-600',
        text: 'text-white',
        border: 'border-blue-500/30',
        dot: 'bg-blue-200',
      };
    case 'EVENTBRITE':
      return {
        name: 'Eventbrite',
        bg: 'bg-orange-600',
        text: 'text-white',
        border: 'border-orange-500/30',
        dot: 'bg-orange-200',
      };
    case 'ALLEVENTS':
      return {
        name: 'AllEvents.in',
        bg: 'bg-emerald-600',
        text: 'text-white',
        border: 'border-emerald-500/30',
        dot: 'bg-emerald-200',
      };
    default:
      return {
        name: 'MeraIndia Direct',
        bg: 'bg-pink-600',
        text: 'text-white',
        border: 'border-pink-500/30',
        dot: 'bg-pink-200',
      };
  }
}

/**
 * Parses event date into Date object or null
 */
function parseEventDate(dateStr) {
  if (!dateStr) return null;
  const isoMatch = String(dateStr).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    return new Date(Number(isoMatch[1]), Number(isoMatch[2]) - 1, Number(isoMatch[3]));
  }
  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? null : parsed;
}

/**
 * Format relative tag like "TODAY", "TOMORROW", "THIS WEEKEND" or formatted date
 */
function getEventTimingLabel(dateObj, displayMonth, displayDay) {
  if (!dateObj) {
    return `${displayMonth || 'LIVE'} ${displayDay || ''}`.trim();
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const eventDay = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
  const diffDays = Math.round((eventDay - today) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return '🔥 TODAY';
  if (diffDays === 1) return '⚡ TOMORROW';
  if (diffDays === -1) return 'YESTERDAY';
  if (diffDays < 0 && diffDays >= -3) return `${Math.abs(diffDays)} DAYS AGO`;

  const dayOfWeek = dateObj.toLocaleDateString('en-GB', { weekday: 'short' }).toUpperCase();
  const monthName = dateObj.toLocaleDateString('en-GB', { month: 'short' }).toUpperCase();

  // If coming up on Friday/Sat/Sun within 7 days
  if (diffDays > 1 && diffDays <= 7 && (dateObj.getDay() === 0 || dateObj.getDay() === 6 || dateObj.getDay() === 5)) {
    return `THIS ${dayOfWeek}`;
  }

  return `${dayOfWeek}, ${dateObj.getDate()} ${monthName}`;
}

export default function HappeningThisWeek({ events = [], title = 'Happening This Week & Upcoming' }) {
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'next3days' | 'weekend'
  const [favorites, setFavorites] = useState({});

  const toggleFav = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // 1. Deduplicate across sources so no duplicate card is ever displayed
  const uniqueEvents = useMemo(() => {
    return deduplicateEvents(events);
  }, [events]);

  // 2. Filter events for this week and upcoming window (including past 3 days)
  const filteredEvents = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Window boundaries: past 3 days (-3) to future
    const pastThreeDays = new Date(today);
    pastThreeDays.setDate(today.getDate() - 3);

    const nextSevenDays = new Date(today);
    nextSevenDays.setDate(today.getDate() + 7);

    const nextThreeDays = new Date(today);
    nextThreeDays.setDate(today.getDate() + 3);

    // Score & filter events
    const matching = uniqueEvents.filter((ev) => {
      const d = parseEventDate(ev.date);
      if (!d) return true; // keep if undated

      const evDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());

      // Filter by tab
      if (activeTab === 'next3days') {
        return evDay >= today && evDay <= nextThreeDays;
      }
      if (activeTab === 'weekend') {
        const isWeekend = d.getDay() === 0 || d.getDay() === 6 || d.getDay() === 5;
        return isWeekend && evDay >= pastThreeDays && evDay <= nextSevenDays;
      }

      // Default 'all': Past 3 days to future
      return evDay >= pastThreeDays;
    });

    // If specific filter resulted in empty, fallback gracefully to any upcoming
    if (matching.length === 0) {
      return uniqueEvents;
    }

    // Sort chronologically (closest first)
    return [...matching].sort((a, b) => {
      const da = parseEventDate(a.date);
      const db = parseEventDate(b.date);
      if (!da && !db) return 0;
      if (!da) return 1;
      if (!db) return -1;
      return da - db;
    });
  }, [uniqueEvents, activeTab]);

  if (!filteredEvents || filteredEvents.length === 0) {
    return null;
  }

  return (
    <section className="py-8 sm:py-12 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Section Header */}
      <div className="bg-gradient-to-br from-stone-900 via-[#1f0b24] to-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-stone-800 relative overflow-hidden mb-8">
        {/* Glow ambient background circles */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-5">
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-pink-500/20 border border-pink-500/30 text-pink-300 text-xs font-bold uppercase tracking-wider mb-2.5 backdrop-blur-sm">
              <Flame className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
              <span>Happening This Week & Upcoming</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-serif tracking-tight text-white">
              {title}
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 mt-1.5 leading-relaxed">
              Live South Asian concerts, festivals & community gatherings across the UK.
              Direct ticket booking via our official partners (<span className="text-pink-300 font-medium">Ticketmaster</span>, <span className="text-orange-300 font-medium">Eventbrite</span> & <span className="text-emerald-300 font-medium">AllEvents</span>).
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center flex-wrap gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === 'all'
                  ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/40 scale-105'
                  : 'bg-stone-800/80 hover:bg-stone-700/80 text-stone-300 border border-stone-700/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>All Upcoming</span>
            </button>
            <button
              onClick={() => setActiveTab('next3days')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === 'next3days'
                  ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/40 scale-105'
                  : 'bg-stone-800/80 hover:bg-stone-700/80 text-stone-300 border border-stone-700/60'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Next 3 Days</span>
            </button>
            <button
              onClick={() => setActiveTab('weekend')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === 'weekend'
                  ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/40 scale-105'
                  : 'bg-stone-800/80 hover:bg-stone-700/80 text-stone-300 border border-stone-700/60'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>This Weekend</span>
            </button>
          </div>
        </div>
      </div>

      {/* Events Grid / Horizontal Scroll for Mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {filteredEvents.map((event) => {
          const platform = getPlatformBadge(event.sourcePlatform);
          const dateObj = parseEventDate(event.date);
          const timingLabel = getEventTimingLabel(dateObj, event.displayMonth, event.displayDay);

          // Pricing calculation: priceDisplay or min variant price
          const minPrice =
            event.variants && event.variants.length > 0
              ? Math.min(...event.variants.map((v) => Number(v.price) || 0))
              : 0;

          const priceText =
            event.priceDisplay && event.priceDisplay.trim() !== ''
              ? event.priceDisplay
              : minPrice === 0
              ? 'FREE ENTRY'
              : `from £${minPrice}`;

          const targetUrl =
            event.ticketUrl && event.ticketUrl.trim() !== '' ? event.ticketUrl.trim() : '#';
          const targetAttr = event.openInNewTab !== false ? '_blank' : '_self';

          return (
            <a
              key={event._id || event.sourceEventId || event.title}
              href={targetUrl}
              target={targetAttr}
              rel={targetAttr === '_blank' ? 'noopener noreferrer' : undefined}
              className="group bg-white rounded-3xl overflow-hidden border border-stone-200/90 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between select-none relative hover:-translate-y-1 block no-underline text-inherit"
            >
              {/* Image & Header Overlay */}
              <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-stone-900">
                <img
                  src={event.imageUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80'}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

                {/* Platform Badge (Ticketmaster / Eventbrite / AllEvents / MeraIndia) */}
                <div className="absolute top-3 left-3 flex items-center space-x-1.5 z-10">
                  <div
                    className={`${platform.bg} ${platform.text} text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-lg flex items-center space-x-1.5 border border-white/20 backdrop-blur-sm`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${platform.dot} animate-ping`} />
                    <span>{platform.name}</span>
                  </div>

                  {event.isDuplicateMerged && (
                    <span className="bg-stone-900/80 text-amber-300 text-[9px] font-bold px-2 py-0.5 rounded-full border border-amber-400/30 backdrop-blur-sm">
                      Verified
                    </span>
                  )}
                </div>

                {/* Favorite Heart Button */}
                <button
                  type="button"
                  onClick={(e) => toggleFav(event._id, e)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-stone-700 hover:text-pink-600 flex items-center justify-center shadow-md transition-colors z-10"
                  aria-label="Save to favorites"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      favorites[event._id] ? 'fill-pink-600 text-pink-600' : ''
                    }`}
                  />
                </button>

                {/* Timing Badge on Bottom-Left */}
                <div className="absolute bottom-3 left-3 bg-stone-900/90 backdrop-blur-md text-white text-[11px] font-extrabold px-3 py-1 rounded-xl border border-stone-700/80 shadow-lg flex items-center space-x-1.5">
                  <Clock className="w-3 h-3 text-pink-400" />
                  <span>{timingLabel}</span>
                </div>

                {/* Price Pill on Bottom-Right */}
                <div className="absolute bottom-3 right-3 bg-emerald-500 text-white text-xs font-black px-2.5 py-1 rounded-xl shadow-lg border border-emerald-400/50 uppercase tracking-tight">
                  {priceText}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  {/* Category & Location */}
                  <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
                    <span className="font-bold text-pink-600 uppercase tracking-wider text-[11px]">
                      {event.category || 'EVENT'}
                    </span>
                    <div className="flex items-center space-x-1 text-stone-600">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span className="font-semibold truncate max-w-[120px]">{event.city || 'London'}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-base sm:text-lg text-stone-900 group-hover:text-pink-600 transition-colors line-clamp-2 leading-snug">
                    {event.title}
                  </h3>

                  {/* Venue / Subtitle */}
                  <p className="text-xs text-stone-500 line-clamp-1 mt-1">
                    {event.venue || event.subtitle || 'UK Venue'}
                  </p>
                </div>

                {/* Booking CTA Button (Points directly to external ticket URL) */}
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-xs text-stone-500">
                    <Ticket className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                    <span>Official Tickets</span>
                  </div>

                  <div className="inline-flex items-center space-x-1 text-xs font-bold text-pink-600 group-hover:text-pink-700 bg-pink-50 group-hover:bg-pink-100 px-3 py-1.5 rounded-xl transition-all">
                    <span>Book on {platform.name.split(' ')[0]}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
                  </div>
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
