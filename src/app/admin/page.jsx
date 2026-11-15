'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Ticket,
  Sparkles,
  PlusCircle,
  ArrowRight,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  Loader2,
  RefreshCw,
  MapPin,
  Eye,
  Layers,
  TrendingUp,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'featured' | 'variants' | 'published'

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsRes, eventsRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/events?all=true'),
      ]);

      const statsData = await statsRes.json();
      const eventsData = await eventsRes.json();

      if (statsData.success) setStats(statsData.stats);
      if (eventsData.success) setAllEvents(eventsData.events || []);
    } catch (e) {
      console.error('Failed to load admin data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-pink-600" />
        <p className="text-sm font-semibold text-stone-600">Loading admin dashboard...</p>
      </div>
    );
  }

  // Filtered Events depending on selected card
  const filteredEvents = allEvents.filter((ev) => {
    if (activeFilter === 'featured') return ev.isFeatured;
    if (activeFilter === 'published') return ev.status === 'published';
    return true; // 'all'
  });

  // Flatten all variants across all events for the "Ticket Variants" view
  const allVariantsList = allEvents.flatMap((ev) =>
    (ev.variants || []).map((v) => ({
      ...v,
      eventId: ev._id,
      eventTitle: ev.title,
      eventDate: ev.date,
      eventCity: ev.city,
      eventCategory: ev.category,
      soldCount: Math.max(0, (v.capacity || 0) - (v.available || 0)),
    }))
  );

  return (
    <div className="space-y-7 pb-12">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#240727] via-[#3d0943] to-[#240727] text-white p-6 sm:p-8 rounded-3xl shadow-lg border border-purple-900/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-pink-400 font-bold text-xs uppercase tracking-wider block mb-1">
            MeraIndia Control Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif">
            UK Events & Variants Manager
          </h1>
          <p className="text-stone-300 text-xs sm:text-sm mt-1 max-w-xl">
            Configure live event dates, venues, Cloudinary posters, and manage custom ticket variants for the diaspora.
          </p>
        </div>
        <div className="flex items-center space-x-3 shrink-0">
          <Link
            href="/admin/events/new"
            className="px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs sm:text-sm flex items-center space-x-2 shadow-lg shadow-pink-600/30 transition-all hover:scale-105"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Event</span>
          </Link>
          <Link
            href="/admin/bookings"
            className="px-4 py-2.5 rounded-xl bg-purple-900/80 hover:bg-purple-800 text-white font-bold text-xs sm:text-sm flex items-center space-x-2 border border-purple-700/60 transition-all"
          >
            <Ticket className="w-4 h-4 text-pink-400" />
            <span>View Bookings</span>
          </Link>
        </div>
      </div>

      {/* Interactive Metric Cards (Click to filter listings below) */}
      <div>
        <div className="flex items-center justify-between mb-2.5 px-1">
          <p className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Click on any card below to view its specific breakdown:
          </p>
          <button
            onClick={loadData}
            className="text-xs font-semibold text-pink-600 hover:text-pink-700 flex items-center space-x-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Total Events */}
          <div
            onClick={() => setActiveFilter('all')}
            className={`p-5 rounded-3xl border shadow-sm flex items-center space-x-4 cursor-pointer transition-all duration-200 select-none ${
              activeFilter === 'all'
                ? 'bg-pink-50/70 border-pink-500 ring-2 ring-pink-500/30 scale-[1.02]'
                : 'bg-white border-stone-200/80 hover:border-pink-300 hover:shadow-md'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-pink-100 flex items-center justify-center text-pink-600 shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-stone-500">Total Events</p>
              <p className="text-2xl font-extrabold text-stone-900">{stats?.totalEvents || 0}</p>
              {activeFilter === 'all' && (
                <span className="text-[10px] font-bold text-pink-600 uppercase tracking-wider">
                  ● Viewing All
                </span>
              )}
            </div>
          </div>

          {/* Card 2: Featured Events */}
          <div
            onClick={() => setActiveFilter('featured')}
            className={`p-5 rounded-3xl border shadow-sm flex items-center space-x-4 cursor-pointer transition-all duration-200 select-none ${
              activeFilter === 'featured'
                ? 'bg-amber-50/70 border-amber-500 ring-2 ring-amber-500/30 scale-[1.02]'
                : 'bg-white border-stone-200/80 hover:border-amber-300 hover:shadow-md'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-stone-500">Featured Events</p>
              <p className="text-2xl font-extrabold text-stone-900">{stats?.featuredEvents || 0}</p>
              {activeFilter === 'featured' && (
                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">
                  ● Filter Active
                </span>
              )}
            </div>
          </div>

          {/* Card 3: Ticket Variants */}
          <div
            onClick={() => setActiveFilter('variants')}
            className={`p-5 rounded-3xl border shadow-sm flex items-center space-x-4 cursor-pointer transition-all duration-200 select-none ${
              activeFilter === 'variants'
                ? 'bg-purple-50/70 border-purple-500 ring-2 ring-purple-500/30 scale-[1.02]'
                : 'bg-white border-stone-200/80 hover:border-purple-300 hover:shadow-md'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
              <Ticket className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-stone-500">Ticket Variants</p>
              <p className="text-2xl font-extrabold text-stone-900">{stats?.totalVariants || 0}</p>
              {activeFilter === 'variants' && (
                <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">
                  ● Showing Tiers
                </span>
              )}
            </div>
          </div>

          {/* Card 4: Live Published */}
          <div
            onClick={() => setActiveFilter('published')}
            className={`p-5 rounded-3xl border shadow-sm flex items-center space-x-4 cursor-pointer transition-all duration-200 select-none ${
              activeFilter === 'published'
                ? 'bg-emerald-50/70 border-emerald-500 ring-2 ring-emerald-500/30 scale-[1.02]'
                : 'bg-white border-stone-200/80 hover:border-emerald-300 hover:shadow-md'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-stone-500">Live Published</p>
              <p className="text-2xl font-extrabold text-stone-900">{stats?.publishedEvents || 0}</p>
              {activeFilter === 'published' && (
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                  ● Filter Active
                </span>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* DYNAMIC LISTING SECTION BASED ON ACTIVE CARD */}
      {activeFilter === 'variants' ? (
        /* TICKET VARIANTS BREAKDOWN TABLE */
        <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm p-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800">
                  Ticket Tiers Breakdown
                </span>
                <span className="text-xs text-stone-400">• {allVariantsList.length} Tiers across all events</span>
              </div>
              <h2 className="text-lg font-bold text-stone-900 mt-1">
                All Ticket Variants, Pricing & Capacity
              </h2>
            </div>
            <button
              onClick={() => setActiveFilter('all')}
              className="text-xs text-pink-600 hover:text-pink-700 font-semibold"
            >
              ← Back to All Events
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#faf7f2] border-b border-stone-200/80 text-stone-600 font-semibold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Event Title</th>
                  <th className="py-3 px-4">Tier Name</th>
                  <th className="py-3 px-4">Price (£ GBP)</th>
                  <th className="py-3 px-4">Total Stock</th>
                  <th className="py-3 px-4">Available</th>
                  <th className="py-3 px-4">Sold</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {allVariantsList.map((tier, idx) => (
                  <tr key={idx} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-bold text-stone-900 line-clamp-1">{tier.eventTitle}</p>
                      <p className="text-[11px] text-stone-400">{tier.eventDate} • {tier.eventCity}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-purple-900 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200 text-xs">
                        {tier.name}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-stone-900">
                      {tier.price === 0 ? 'FREE' : `£${tier.price}`}
                    </td>
                    <td className="py-3 px-4 text-stone-600">
                      {tier.capacity} tickets
                    </td>
                    <td className="py-3 px-4">
                      <span className={`font-bold text-xs px-2 py-0.5 rounded-full ${
                        tier.available <= 0
                          ? 'bg-rose-100 text-rose-700'
                          : tier.available < 20
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {tier.available} left
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-stone-700">
                      {tier.soldCount}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/admin/events/${tier.eventId}/edit`}
                        className="p-1.5 rounded-lg bg-stone-100 hover:bg-pink-100 text-stone-600 hover:text-pink-600 transition-colors inline-block"
                        title="Edit Event & Variants"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* FILTERED EVENTS LIST (ALL / FEATURED / PUBLISHED) */
        <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <div className="flex items-center space-x-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                  activeFilter === 'featured'
                    ? 'bg-amber-100 text-amber-800'
                    : activeFilter === 'published'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-pink-100 text-pink-800'
                }`}>
                  {activeFilter === 'featured'
                    ? '★ Featured Events Only'
                    : activeFilter === 'published'
                    ? '● Live Published Events'
                    : 'All Events'}
                </span>
                <span className="text-xs text-stone-400">• Showing {filteredEvents.length} events</span>
              </div>
              <h2 className="text-lg font-bold text-stone-900 mt-1">
                {activeFilter === 'featured'
                  ? 'Featured Events on MeraIndia UK'
                  : activeFilter === 'published'
                  ? 'Active Published Events'
                  : 'Recent & Active Events'}
              </h2>
            </div>
            <Link
              href="/admin/events"
              className="text-pink-600 hover:text-pink-700 font-semibold text-xs flex items-center space-x-1"
            >
              <span>Manage full list</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {filteredEvents.length === 0 ? (
            <div className="py-12 text-center text-stone-500 text-xs">
              No events found matching this filter. Click &quot;Create New Event&quot; to add one.
            </div>
          ) : (
            <div className="divide-y divide-stone-100">
              {filteredEvents.map((ev) => (
                <div key={ev._id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center space-x-3.5 overflow-hidden">
                    <img
                      src={ev.imageUrl}
                      alt={ev.title}
                      className="w-12 h-12 rounded-xl object-cover shrink-0 bg-stone-100 border border-stone-200"
                    />
                    <div className="overflow-hidden">
                      <div className="flex items-center space-x-2">
                        <p className="font-bold text-sm text-stone-900 truncate">{ev.title}</p>
                        {ev.isFeatured && (
                          <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded-full shrink-0">
                            ★ Featured
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-stone-500 mt-0.5">
                        <span className="font-semibold text-pink-600">{ev.category}</span>
                        <span>•</span>
                        <span>{ev.date}</span>
                        <span>•</span>
                        <span>{ev.city}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    <div className="text-right hidden sm:block">
                      <span className="text-xs font-bold text-stone-800">
                        {ev.variants?.length || 0} Tiers
                      </span>
                      <span className="block text-[11px] text-stone-400 capitalize">
                        {ev.status}
                      </span>
                    </div>
                    <Link
                      href={`/admin/events/${ev._id}/edit`}
                      className="p-2 rounded-xl bg-stone-100 hover:bg-pink-50 text-stone-600 hover:text-pink-600 transition-colors"
                      title="Edit Event & Variants"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
