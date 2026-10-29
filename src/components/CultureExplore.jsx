'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function CultureExplore({ listings = [], onSelectCategory }) {
  const items = listings.length > 0 ? listings : [
    {
      _id: 'c1',
      title: 'Festivals',
      subtitle: 'UK Celebrations & Melas',
      imageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&auto=format&fit=crop&q=80',
    },
    {
      _id: 'c2',
      title: 'Restaurants',
      subtitle: 'Indian restaurants, street food, and catering',
      imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&auto=format&fit=crop&q=80',
    },
    {
      _id: 'c3',
      title: 'Travel',
      subtitle: 'Indian travel agents, tour operators, and holiday',
      imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&auto=format&fit=crop&q=80',
    },
    {
      _id: 'c4',
      title: 'Education',
      subtitle: 'Language schools, classical music & arts',
      imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80',
    },
    {
      _id: 'c5',
      title: 'Community',
      subtitle: 'Charities, senior groups, and youth societies',
      imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&auto=format&fit=crop&q=80',
    },
    {
      _id: 'c6',
      title: 'Radio',
      subtitle: '24/7 South Asian music, news & podcasts',
      imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <section className="py-6 sm:py-10 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Title */}
      <div className="flex items-end justify-between mb-4 sm:mb-6">
        <div>
          <h2 className="text-xl sm:text-3xl font-bold font-serif text-stone-900 tracking-tight">
            Explore culture across the UK
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5 sm:mt-1">
            Find what you're looking for
          </p>
        </div>
        <Link
          href="/listings"
          className="text-pink-600 hover:text-pink-700 text-xs sm:text-sm font-semibold flex items-center space-x-1 group shrink-0"
        >
          <span>All directory</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Grid: 2 columns on mobile (matches Screenshot 2 & 4), 3 on tablet, 6 on desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
        {items.map((item) => (
          <div
            key={item._id || item.title}
            onClick={() => onSelectCategory && onSelectCategory(item.title)}
            className="group cursor-pointer bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-stone-200/80 flex flex-col active:scale-95"
          >
            {/* Image (Square) */}
            <div className="relative aspect-square w-full overflow-hidden bg-stone-100">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity" />
            </div>

            {/* Label */}
            <div className="p-2.5 sm:p-3 text-center flex-1 flex flex-col justify-center">
              <h3 className="font-serif font-bold text-xs sm:text-sm md:text-base text-stone-900 group-hover:text-pink-600 transition-colors">
                {item.title}
              </h3>
              {item.subtitle && (
                <p className="text-[10px] sm:text-[11px] text-stone-500 line-clamp-1 mt-0.5 hidden sm:block">
                  {item.subtitle}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
