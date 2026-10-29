'use client';

import { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import FestivalTicker from '@/components/FestivalTicker';
import HeroBanner from '@/components/HeroBanner';
import FeaturedEvents from '@/components/FeaturedEvents';
import CultureExplore from '@/components/CultureExplore';
import EventDetailModal from '@/components/EventDetailModal';
import BottomNav from '@/components/BottomNav';
import DesktopFooter from '@/components/DesktopFooter';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const [events, setEvents] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedFestival, setSelectedFestival] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const eventsSectionRef = useRef(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.set('search', searchQuery);
      if (selectedCity) params.set('city', selectedCity);
      if (selectedCategory) params.set('category', selectedCategory);
      if (selectedFestival) params.set('search', selectedFestival);

      const res = await fetch(`/api/events?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setEvents(data.events || []);
      }
    } catch (e) {
      console.error('Failed to load events:', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchListings = async () => {
    try {
      const res = await fetch('/api/listings');
      const data = await res.json();
      if (data.success) {
        setListings(data.listings || []);
      }
    } catch (e) {
      console.error('Failed to load listings:', e);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [searchQuery, selectedCity, selectedCategory, selectedFestival]);

  const handleHeroSearch = ({ keyword, city, category }) => {
    setSearchQuery(keyword || '');
    setSelectedCity(city || '');
    setSelectedCategory(category || '');
    scrollToEvents();
  };

  const scrollToEvents = () => {
    if (eventsSectionRef.current) {
      eventsSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf7f2] text-stone-900 pb-24 md:pb-0 w-full overflow-x-hidden">
      
      {/* 1. Top Header */}
      <Header
        selectedCity={selectedCity}
        onSelectCity={(city) => setSelectedCity(city)}
        searchQuery={searchQuery}
        onSearch={(q) => setSearchQuery(q)}
      />

      {/* 2. Top Festival Banner Ticker (as in screenshot 4) */}
      <FestivalTicker
        activeFilter={selectedFestival}
        onSelectFestival={(fest) => {
          setSelectedFestival(fest);
          scrollToEvents();
        }}
      />

      {/* 3. Hero Banner (Taj Mahal & CTA) */}
      <HeroBanner
        onSearchSubmit={handleHeroSearch}
        onScrollToEvents={scrollToEvents}
      />

      {/* Filter indicator if active */}
      {(searchQuery || selectedCity || selectedFestival || selectedCategory) && (
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6 w-full">
          <div className="flex items-center flex-wrap gap-1.5 sm:gap-2 text-xs">
            <span className="font-semibold text-stone-600">Filters:</span>
            {searchQuery && (
              <span className="bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full font-medium">
                "{searchQuery}"
              </span>
            )}
            {selectedCity && (
              <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                {selectedCity}
              </span>
            )}
            {selectedFestival && (
              <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-medium">
                {selectedFestival}
              </span>
            )}
            {selectedCategory && (
              <span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full font-medium">
                {selectedCategory}
              </span>
            )}
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCity('');
                setSelectedFestival('');
                setSelectedCategory('');
              }}
              className="text-stone-500 hover:text-pink-600 underline text-xs ml-1"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* 4. Featured Events Section */}
      <div ref={eventsSectionRef} className="w-full">
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center text-stone-500 space-y-2">
            <Loader2 className="w-7 h-7 animate-spin text-pink-600" />
            <p className="text-xs font-medium">Loading diaspora events...</p>
          </div>
        ) : (
          <FeaturedEvents
            events={events}
            onSelectEvent={(ev) => setSelectedEvent(ev)}
            title="Featured across the UK"
            subtitle="Discover events, food, and community"
          />
        )}
      </div>

      {/* 5. Explore Culture Across the UK (2-column cards) */}
      <CultureExplore
        listings={listings}
        onSelectCategory={(catTitle) => {
          setSelectedCategory(catTitle.toUpperCase());
          scrollToEvents();
        }}
      />

      {/* 6. Event Detail & Ticket Variant Booking Modal */}
      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}

      {/* 7. Desktop Footer */}
      <DesktopFooter />

      {/* 8. Mobile Bottom Navigation Dock */}
      <BottomNav />

    </div>
  );
}
