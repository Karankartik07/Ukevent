'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import DesktopFooter from '@/components/DesktopFooter';
import EventDetailModal from '@/components/EventDetailModal';
import { Search, MapPin, Calendar, Ticket, Loader2, Sparkles, Filter } from 'lucide-react';

const CATEGORIES = ['ALL', 'MUSIC', 'FESTIVAL', 'CULTURE', 'FOOD', 'EDUCATION'];
const CITIES = ['ALL', 'London', 'Birmingham', 'Leicester', 'Manchester', 'Leeds'];

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [category, setCategory] = useState('ALL');
  const [city, setCity] = useState('ALL');
  const [search, setSearch] = useState('');

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (category !== 'ALL') params.set('category', category);
      if (city !== 'ALL') params.set('city', city);
      if (search) params.set('search', search);

      const res = await fetch(`/api/events?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setEvents(data.events || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [category, city, search]);

  return (
    <div className="min-h-screen flex flex-col bg-[#faf7f2] text-stone-900 pb-16 md:pb-0">
      <Header
        selectedCity={city === 'ALL' ? '' : city}
        onSelectCity={(c) => setCity(c || 'ALL')}
        searchQuery={search}
        onSearch={setSearch}
      />

      <div className="bg-[#240727] text-white py-10 px-4 sm:px-6 lg:px-8 border-b border-purple-900/50">
        <div className="max-w-7xl mx-auto">
          <span className="text-pink-400 font-semibold text-xs uppercase tracking-wider block mb-1">
            UK South Asian Diaspora
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif">
            All Events & Tickets
          </h1>
          <p className="text-stone-300 text-sm mt-1 max-w-xl">
            Explore live concerts, heritage festivals, comedy nights, and community gatherings across the United Kingdom.
          </p>

          {/* Filter Pills */}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="text-xs text-stone-400 font-medium mr-1 flex items-center">
              <Filter className="w-3.5 h-3.5 mr-1 text-pink-400" />
              Category:
            </span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  category === cat
                    ? 'bg-pink-600 text-white shadow-md'
                    : 'bg-purple-950/80 text-purple-200 hover:bg-purple-900 border border-purple-800'
                }`}
              >
                {cat === 'ALL' ? 'All Categories' : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-stone-500 space-y-2">
            <Loader2 className="w-8 h-8 animate-spin text-pink-600" />
            <p className="text-sm">Loading events...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl p-8 border border-stone-200">
            <p className="text-base font-semibold text-stone-700">No events found matching your criteria</p>
            <p className="text-xs text-stone-400 mt-1">Try resetting your filters or search term</p>
            <button
              onClick={() => {
                setCategory('ALL');
                setCity('ALL');
                setSearch('');
              }}
              className="mt-4 px-4 py-2 bg-pink-600 text-white text-xs font-semibold rounded-full"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => {
              const minPrice =
                event.variants && event.variants.length > 0
                  ? Math.min(...event.variants.map((v) => v.price))
                  : 0;

              return (
                <div
                  key={event._id}
                  onClick={() => setSelectedEvent(event)}
                  className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-200/80 cursor-pointer flex flex-col group"
                >
                  <div className="relative h-52 w-full overflow-hidden bg-stone-900">
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-pink-600 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-md">
                      {event.category}
                    </div>
                    <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md text-stone-900 px-3 py-1.5 rounded-2xl shadow-lg flex flex-col items-center justify-center min-w-[52px]">
                      <span className="text-[10px] font-bold text-pink-600 tracking-wider uppercase leading-none">
                        {event.displayMonth || 'AUG'}
                      </span>
                      <span className="text-base font-extrabold text-stone-900 leading-tight">
                        {event.displayDay || '23'}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center text-xs text-stone-500 space-x-1 mb-1.5">
                        <MapPin className="w-3.5 h-3.5 text-pink-500" />
                        <span className="font-medium text-stone-700">{event.venue}, {event.city}</span>
                      </div>
                      <h3 className="font-bold text-lg text-stone-900 group-hover:text-pink-600 transition-colors line-clamp-1">
                        {event.title}
                      </h3>
                      {event.subtitle && (
                        <p className="text-xs text-stone-500 line-clamp-1 mt-0.5">
                          {event.subtitle}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                      <span className="text-xs text-stone-500 flex items-center space-x-1">
                        <Ticket className="w-3.5 h-3.5 text-pink-500" />
                        <span>{event.variants?.length || 1} Tiers</span>
                      </span>
                      <div className="text-right">
                        <span className="text-xs text-stone-400 mr-1">from</span>
                        <span className="font-bold text-base text-stone-900">
                          {minPrice === 0 ? 'FREE' : `£${minPrice}`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}

      <DesktopFooter />
      <BottomNav />
    </div>
  );
}
