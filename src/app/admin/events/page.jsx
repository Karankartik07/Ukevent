'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar,
  PlusCircle,
  Search,
  Filter,
  Edit,
  Trash2,
  Ticket,
  MapPin,
  Sparkles,
  Check,
  X,
  Loader2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

export default function AdminEventsListPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [deletingId, setDeletingId] = useState(null);
  const [message, setMessage] = useState('');

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.set('all', 'true');
      if (search) params.set('search', search);
      if (categoryFilter !== 'ALL') params.set('category', categoryFilter);

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
  }, [categoryFilter, search]);

  const handleDelete = async (id, title) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      return;
    }

    try {
      setDeletingId(id);
      const res = await fetch(`/api/events/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setMessage(`Event "${title}" deleted successfully`);
        setEvents((prev) => prev.filter((e) => e._id !== id));
      } else {
        alert(data.error || 'Failed to delete event');
      }
    } catch (e) {
      alert('Delete failed');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold font-serif text-stone-900">
            Manage Events & Ticket Variants
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            View, edit, toggle featured status, and configure ticket variants for UK diaspora events.
          </p>
        </div>
        <Link
          href="/admin/events/new"
          className="px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs sm:text-sm flex items-center space-x-2 shadow-md shadow-pink-600/30 transition-all shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Event</span>
        </Link>
      </div>

      {message && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
          <span>{message}</span>
          <button onClick={() => setMessage('')} className="text-emerald-600 hover:text-emerald-800">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, artist, city, or venue..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-stone-400 shrink-0" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-700 focus:bg-white focus:outline-none"
          >
            <option value="ALL">All Categories</option>
            <option value="MUSIC">Music</option>
            <option value="FESTIVAL">Festival</option>
            <option value="CULTURE">Culture</option>
            <option value="FOOD">Food</option>
            <option value="EDUCATION">Education</option>
          </select>
        </div>
      </div>

      {/* Events Table / Grid */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-2">
            <Loader2 className="w-8 h-8 animate-spin text-pink-600" />
            <p className="text-xs text-stone-500">Loading events...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="py-16 text-center text-stone-500">
            <Calendar className="w-10 h-10 text-stone-300 mx-auto mb-2" />
            <p className="text-sm font-semibold">No events found</p>
            <p className="text-xs text-stone-400 mt-1">Try modifying your search or add a new event</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#faf7f2] border-b border-stone-200/80 text-stone-600 font-semibold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Event & Poster</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Date & Venue</th>
                  <th className="py-3.5 px-4">Ticket Variants</th>
                  <th className="py-3.5 px-4">Featured</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {events.map((ev) => {
                  const minPrice = ev.variants?.length > 0 ? Math.min(...ev.variants.map((v) => v.price)) : 0;
                  const maxPrice = ev.variants?.length > 0 ? Math.max(...ev.variants.map((v) => v.price)) : 0;

                  return (
                    <tr key={ev._id} className="hover:bg-stone-50/60 transition-colors">
                      
                      {/* Image & Title */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={ev.imageUrl}
                            alt={ev.title}
                            className="w-12 h-12 rounded-xl object-cover shrink-0 bg-stone-100 border border-stone-200"
                          />
                          <div>
                            <p className="font-bold text-stone-900 line-clamp-1">{ev.title}</p>
                            {ev.subtitle && (
                              <p className="text-[11px] text-stone-500 line-clamp-1">{ev.subtitle}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-[11px] px-2 py-0.5 rounded-full bg-pink-50 text-pink-700 border border-pink-200 uppercase">
                          {ev.category}
                        </span>
                      </td>

                      {/* Date & Venue */}
                      <td className="py-3.5 px-4">
                        <div className="text-stone-800 font-medium">
                          <p>{ev.date}</p>
                          <p className="text-[11px] text-stone-500 flex items-center space-x-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-stone-400" />
                            <span>{ev.venue}, {ev.city}</span>
                          </p>
                        </div>
                      </td>

                      {/* Ticket Variants */}
                      <td className="py-3.5 px-4">
                        <div>
                          <span className="inline-flex items-center space-x-1 font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded-lg text-xs">
                            <Ticket className="w-3 h-3 text-pink-600" />
                            <span>{ev.variants?.length || 0} Tiers</span>
                          </span>
                          <p className="text-[11px] text-stone-500 mt-0.5">
                            £{minPrice} {maxPrice > minPrice ? `- £${maxPrice}` : ''}
                          </p>
                        </div>
                      </td>

                      {/* Featured */}
                      <td className="py-3.5 px-4">
                        {ev.isFeatured ? (
                          <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                            <span>★</span>
                            <span>Yes</span>
                          </span>
                        ) : (
                          <span className="text-stone-400 text-xs">No</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            ev.status === 'published'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          {ev.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <Link
                            href={`/admin/events/${ev._id}/edit`}
                            className="p-1.5 rounded-lg bg-stone-100 hover:bg-pink-100 text-stone-700 hover:text-pink-700 transition-colors"
                            title="Edit Event"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(ev._id, ev.title)}
                            disabled={deletingId === ev._id}
                            className="p-1.5 rounded-lg bg-stone-100 hover:bg-rose-100 text-stone-700 hover:text-rose-700 transition-colors disabled:opacity-50"
                            title="Delete Event"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
