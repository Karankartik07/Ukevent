'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Ticket,
  Search,
  Mail,
  User,
  Calendar,
  MapPin,
  PoundSterling,
  CheckCircle2,
  Loader2,
  RefreshCw,
  ArrowLeft,
  Eye,
  X,
  Phone,
} from 'lucide-react';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalTickets, setTotalTickets] = useState(0);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const loadBookings = async (query = '') => {
    try {
      setLoading(true);
      const url = query ? `/api/admin/bookings?search=${encodeURIComponent(query)}` : '/api/admin/bookings';
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setBookings(data.bookings || []);
        setTotalRevenue(data.totalRevenue || 0);
        setTotalTickets(data.totalTicketsSold || 0);
      }
    } catch (err) {
      console.error('Failed to load bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings(search);
  }, [search]);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <Link
              href="/admin"
              className="p-1 rounded-lg hover:bg-stone-200 text-stone-500 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <span className="text-xs font-bold text-pink-600 uppercase tracking-wider">
              Ticket Sales & Audience
            </span>
          </div>
          <h1 className="text-2xl font-extrabold font-serif text-stone-900">
            Booked Tickets & Customers
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Monitor real-time attendee bookings, customer email addresses, ticket tiers, and sales revenue.
          </p>
        </div>

        <button
          onClick={() => loadBookings(search)}
          className="px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-stone-700 hover:text-pink-600 hover:border-pink-300 text-xs font-semibold flex items-center space-x-2 shadow-sm transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh List</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-pink-100 flex items-center justify-center text-pink-600">
            <Ticket className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-stone-500">Total Bookings</p>
            <p className="text-2xl font-extrabold text-stone-900">{bookings.length}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600">
            <User className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-stone-500">Tickets Issued</p>
            <p className="text-2xl font-extrabold text-stone-900">{totalTickets}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600">
            <PoundSterling className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-stone-500">Total Ticket Revenue</p>
            <p className="text-2xl font-extrabold text-stone-900">£{totalRevenue.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-stone-200/80 shadow-sm flex items-center space-x-3">
        <Search className="w-4 h-4 text-stone-400 ml-2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by customer name, email, booking reference, or event title..."
          className="w-full text-xs sm:text-sm bg-transparent outline-none text-stone-800 placeholder-stone-400"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="p-1 rounded-full text-stone-400 hover:text-stone-600 mr-2"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-2">
            <Loader2 className="w-8 h-8 animate-spin text-pink-600" />
            <p className="text-xs font-semibold text-stone-500">Loading attendee bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="py-16 text-center text-stone-500">
            <Ticket className="w-12 h-12 text-stone-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-stone-800">No ticket bookings recorded yet</p>
            <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto">
              When visitors book tickets on MeraIndia UK, their contact details and tier selections will display here instantly.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#faf7f2] border-b border-stone-200/80 text-stone-600 font-semibold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Ref & Status</th>
                  <th className="py-3.5 px-4">Customer / Attendee</th>
                  <th className="py-3.5 px-4">Event Details</th>
                  <th className="py-3.5 px-4">Ticket Tier</th>
                  <th className="py-3.5 px-4">Quantity</th>
                  <th className="py-3.5 px-4">Total Amount</th>
                  <th className="py-3.5 px-4">Booked On</th>
                  <th className="py-3.5 px-4 text-right">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {bookings.map((b) => (
                  <tr key={b._id} className="hover:bg-stone-50/70 transition-colors">
                    
                    {/* Booking Ref */}
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-xs bg-purple-100 text-purple-800 px-2.5 py-1 rounded-lg inline-block border border-purple-200">
                        {b.bookingRef}
                      </span>
                      <span className="block mt-1 text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
                        ● Confirmed
                      </span>
                    </td>

                    {/* Customer Info */}
                    <td className="py-3.5 px-4">
                      <div>
                        <p className="font-bold text-stone-900">{b.userName}</p>
                        <p className="text-[11px] text-stone-500 flex items-center space-x-1 mt-0.5">
                          <Mail className="w-3 h-3 text-stone-400 shrink-0" />
                          <span className="truncate max-w-[180px]">{b.userEmail}</span>
                        </p>
                        {b.userPhone && (
                          <p className="text-[10px] text-stone-400 flex items-center space-x-1 mt-0.5">
                            <Phone className="w-2.5 h-2.5 text-stone-400 shrink-0" />
                            <span>{b.userPhone}</span>
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Event Details */}
                    <td className="py-3.5 px-4">
                      <div>
                        <p className="font-bold text-stone-900 line-clamp-1">{b.eventTitle}</p>
                        <p className="text-[11px] text-stone-500 flex items-center space-x-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                          <span>{b.venue}, {b.city}</span>
                        </p>
                        <p className="text-[10px] text-stone-400 flex items-center space-x-1 mt-0.5">
                          <Calendar className="w-3 h-3 text-stone-400 shrink-0" />
                          <span>{b.date} • {b.time}</span>
                        </p>
                      </div>
                    </td>

                    {/* Variant */}
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-xs text-pink-700 bg-pink-50 px-2 py-0.5 rounded-md border border-pink-200 inline-block">
                        {b.variantName}
                      </span>
                      <p className="text-[10px] text-stone-400 mt-0.5">
                        £{b.unitPrice} each
                      </p>
                    </td>

                    {/* Quantity */}
                    <td className="py-3.5 px-4 font-bold text-stone-800">
                      {b.quantity} {b.quantity === 1 ? 'ticket' : 'tickets'}
                    </td>

                    {/* Total Amount */}
                    <td className="py-3.5 px-4">
                      <span className="font-extrabold text-sm text-stone-900">
                        {b.totalAmount === 0 ? 'FREE' : `£${b.totalAmount.toFixed(2)}`}
                      </span>
                    </td>

                    {/* Booked Date */}
                    <td className="py-3.5 px-4 text-xs text-stone-500">
                      {b.createdAt ? new Date(b.createdAt).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      }) : 'Recent'}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedBooking(b)}
                        className="p-1.5 rounded-lg bg-stone-100 hover:bg-pink-100 text-stone-600 hover:text-pink-600 transition-colors"
                        title="View Full Booking"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 space-y-5 border border-stone-200 animate-in fade-in">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-pink-600">{selectedBooking.bookingRef}</span>
                <h3 className="text-lg font-bold text-stone-900">Customer Ticket Details</h3>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs sm:text-sm">
              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 space-y-1.5">
                <p className="text-stone-500 font-medium">Customer Information</p>
                <p className="font-bold text-stone-900 text-base">{selectedBooking.userName}</p>
                <p className="text-stone-600">Email: <span className="font-semibold text-stone-900">{selectedBooking.userEmail}</span></p>
                {selectedBooking.userPhone && (
                  <p className="text-stone-600">Phone: <span className="font-semibold text-stone-900">{selectedBooking.userPhone}</span></p>
                )}
              </div>

              <div className="p-3 rounded-2xl bg-purple-50 border border-purple-200 space-y-1.5">
                <p className="text-purple-700 font-semibold">Event Information</p>
                <p className="font-bold text-stone-900 text-base">{selectedBooking.eventTitle}</p>
                <p className="text-stone-700">Venue: {selectedBooking.venue}, {selectedBooking.city}</p>
                <p className="text-stone-700">Date & Time: {selectedBooking.date} • {selectedBooking.time}</p>
              </div>

              <div className="p-3 rounded-2xl bg-pink-50 border border-pink-200 flex items-center justify-between">
                <div>
                  <p className="text-pink-700 font-semibold">Tier: {selectedBooking.variantName}</p>
                  <p className="text-stone-600">{selectedBooking.quantity} Ticket(s) @ £{selectedBooking.unitPrice}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-stone-500">Total Paid</p>
                  <p className="text-xl font-extrabold text-stone-900">
                    {selectedBooking.totalAmount === 0 ? 'FREE' : `£${selectedBooking.totalAmount.toFixed(2)}`}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSelectedBooking(null)}
                className="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
