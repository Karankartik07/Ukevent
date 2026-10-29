'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import DesktopFooter from '@/components/DesktopFooter';
import { MapPin, Utensils, Plane, GraduationCap, Users, Radio, Sparkles, Loader2 } from 'lucide-react';

const CATEGORY_ICONS = {
  Restaurants: Utensils,
  Travel: Plane,
  Education: GraduationCap,
  Community: Users,
  Radio: Radio,
  Festivals: Sparkles,
};

export default function ListingsPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetch('/api/listings');
        const data = await res.json();
        if (data.success) {
          setListings(data.listings || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const categories = ['ALL', ...new Set(listings.map((l) => l.category))];
  const filtered = selectedCategory === 'ALL'
    ? listings
    : listings.filter((l) => l.category === selectedCategory);

  return (
    <div className="min-h-screen flex flex-col bg-[#faf7f2] text-stone-900 pb-16 md:pb-0">
      <Header />

      <div className="bg-[#240727] text-white py-10 px-4 sm:px-6 lg:px-8 border-b border-purple-900/50">
        <div className="max-w-7xl mx-auto">
          <span className="text-pink-400 font-semibold text-xs uppercase tracking-wider block mb-1">
            Community Directory
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif">
            UK Indian & South Asian Directory
          </h1>
          <p className="text-stone-300 text-sm mt-1 max-w-xl">
            Trusted restaurants, heritage businesses, language schools, travel specialists, and community welfare hubs.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-pink-600 text-white shadow-md'
                    : 'bg-purple-950/80 text-purple-200 hover:bg-purple-900 border border-purple-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-stone-500 space-y-2">
            <Loader2 className="w-8 h-8 animate-spin text-pink-600" />
            <p className="text-sm">Loading listings...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => {
              const Icon = CATEGORY_ICONS[item.category] || Sparkles;

              return (
                <div
                  key={item._id}
                  className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-200/80 flex flex-col group"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-stone-900">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-pink-600 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-md flex items-center space-x-1">
                      <Icon className="w-3 h-3" />
                      <span>{item.category}</span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center text-xs text-stone-500 space-x-1 mb-1">
                        <MapPin className="w-3.5 h-3.5 text-pink-500" />
                        <span>{item.city || 'UK Wide'}</span>
                      </div>
                      <h3 className="font-bold text-lg text-stone-900 group-hover:text-pink-600 transition-colors">
                        {item.title}
                      </h3>
                      {item.subtitle && (
                        <p className="text-xs font-semibold text-pink-600 mt-0.5">
                          {item.subtitle}
                        </p>
                      )}
                      {item.description && (
                        <p className="text-xs text-stone-600 mt-2 line-clamp-3 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <DesktopFooter />
      <BottomNav />
    </div>
  );
}
