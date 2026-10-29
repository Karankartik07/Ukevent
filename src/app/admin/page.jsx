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
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [feedback, setFeedback] = useState('');

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
      if (eventsData.success) setRecentEvents(eventsData.events || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSeed = async () => {
    if (!confirm('This will refresh the sample UK diaspora events with ticket variants. Proceed?')) return;
    try {
      setSeeding(true);
      setFeedback('');
      const res = await fetch('/api/admin/seed', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setFeedback('Sample events refreshed successfully!');
        loadData();
      }
    } catch (e) {
      setFeedback('Failed to seed events');
    } finally {
      setSeeding(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-pink-600" />
        <p className="text-sm font-semibold text-stone-600">Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
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
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-pink-100 flex items-center justify-center text-pink-600">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-stone-500">Total Events</p>
            <p className="text-2xl font-extrabold text-stone-900">{stats?.totalEvents || 0}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-stone-500">Featured Events</p>
            <p className="text-2xl font-extrabold text-stone-900">{stats?.featuredEvents || 0}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600">
            <Ticket className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-stone-500">Ticket Variants</p>
            <p className="text-2xl font-extrabold text-stone-900">{stats?.totalVariants || 0}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-stone-500">Live Published</p>
            <p className="text-2xl font-extrabold text-stone-900">{stats?.publishedEvents || 0}</p>
          </div>
        </div>
      </div>

      {/* Recent Events Section */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-stone-900">Recent Events</h2>
            <p className="text-xs text-stone-500">Manage dates, ticket variants, and publicity status</p>
          </div>
          <Link
            href="/admin/events"
            className="text-pink-600 hover:text-pink-700 font-semibold text-xs flex items-center space-x-1"
          >
            <span>View all events</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentEvents.length === 0 ? (
          <div className="py-12 text-center text-stone-500 text-xs">
            No events found. Click "Create New Event" to add your first event.
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {recentEvents.slice(0, 5).map((ev) => (
              <div key={ev._id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center space-x-3.5 overflow-hidden">
                  <img
                    src={ev.imageUrl}
                    alt={ev.title}
                    className="w-12 h-12 rounded-xl object-cover shrink-0 bg-stone-100 border border-stone-200"
                  />
                  <div className="overflow-hidden">
                    <p className="font-bold text-sm text-stone-900 truncate">{ev.title}</p>
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
                      {ev.variants?.length || 0} Variants
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

    </div>
  );
}
