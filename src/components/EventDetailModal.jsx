'use client';

import { useState } from 'react';
import { X, Calendar, Clock, MapPin, Ticket, CheckCircle, AlertCircle, Sparkles, Share2 } from 'lucide-react';

export default function EventDetailModal({ event, onClose }) {
  const [selectedVariantId, setSelectedVariantId] = useState(
    event?.variants && event.variants.length > 0 ? event.variants[0]._id : null
  );
  const [quantity, setQuantity] = useState(1);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);
  const [bookingError, setBookingError] = useState('');

  if (!event) return null;

  const currentVariant = event.variants?.find((v) => v._id === selectedVariantId) || event.variants?.[0];
  const totalPrice = currentVariant ? (currentVariant.price * quantity) : 0;

  const handleBook = async (e) => {
    e.preventDefault();
    setBookingError('');

    if (!userName.trim() || !userEmail.trim()) {
      setBookingError('Please enter your full name and email address');
      return;
    }

    setBookingLoading(true);
    try {
      const res = await fetch('/api/tickets/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: event._id,
          variantId: currentVariant._id,
          quantity,
          userName: userName.trim(),
          userEmail: userEmail.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Booking failed');
      }

      setBookingResult(data.booking);
      // update event available count locally
      if (currentVariant) {
        currentVariant.available -= quantity;
      }
    } catch (err) {
      setBookingError(err.message || 'Something went wrong while booking tickets');
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-stone-200 max-h-[92vh] flex flex-col my-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center backdrop-blur-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Scrollable Container */}
        <div className="overflow-y-auto flex-1">
          
          {/* Header Poster */}
          <div className="relative h-44 sm:h-64 w-full bg-stone-900">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

            <div className="absolute top-4 left-4 flex gap-2">
              <span className="bg-pink-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md uppercase tracking-wider">
                {event.category}
              </span>
              {event.isFeatured && (
                <span className="bg-amber-500 text-stone-950 text-xs font-bold px-3 py-1 rounded-full shadow-md">
                  ★ Featured
                </span>
              )}
            </div>

            <div className="absolute bottom-4 left-4 right-4 text-white">
              <h2 className="text-xl sm:text-2xl font-bold font-serif leading-tight">
                {event.title}
              </h2>
              {event.subtitle && (
                <p className="text-sm text-pink-300 font-medium mt-0.5">
                  {event.subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-4 sm:p-6 space-y-6">
            
            {/* Event Time & Venue Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#faf7f2] p-3.5 rounded-2xl border border-stone-200/80 text-xs sm:text-sm">
              <div className="flex items-center space-x-2 text-stone-700">
                <Calendar className="w-4 h-4 text-pink-600 shrink-0" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center space-x-2 text-stone-700">
                <Clock className="w-4 h-4 text-pink-600 shrink-0" />
                <span>{event.time || '19:00 UK Time'}</span>
              </div>
              <div className="flex items-center space-x-2 text-stone-700">
                <MapPin className="w-4 h-4 text-pink-600 shrink-0" />
                <span className="truncate">{event.venue}, {event.city}</span>
              </div>
            </div>

            {/* Description */}
            {event.description && (
              <div>
                <h4 className="font-semibold text-sm text-stone-900 mb-1.5">About This Event</h4>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {event.description}
                </p>
              </div>
            )}

            {/* Booking Result View or Booking Form */}
            {bookingResult ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center space-y-3">
                <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="text-lg font-bold text-emerald-900">Tickets Confirmed!</h3>
                <p className="text-xs sm:text-sm text-emerald-700">
                  A confirmation has been issued to <span className="font-semibold">{bookingResult.userEmail}</span>.
                </p>
                <div className="bg-white p-4 rounded-xl border border-emerald-200 text-left space-y-1.5 text-xs">
                  <div className="flex justify-between font-mono font-bold text-stone-900">
                    <span>Booking Ref:</span>
                    <span className="text-pink-600">{bookingResult.bookingRef}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Tier:</span>
                    <span className="font-medium text-stone-800">{bookingResult.variantName}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Quantity:</span>
                    <span className="font-medium text-stone-800">{bookingResult.quantity} Ticket(s)</span>
                  </div>
                  <div className="flex justify-between text-stone-600 border-t pt-1 font-bold text-stone-900">
                    <span>Total Paid:</span>
                    <span>{bookingResult.totalAmount === 0 ? 'FREE' : `£${bookingResult.totalAmount}`}</span>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 transition-colors"
                >
                  Close & Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleBook} className="space-y-5">
                
                {/* Ticket Variants Section */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-sm text-stone-900 flex items-center space-x-1.5">
                      <Ticket className="w-4 h-4 text-pink-600" />
                      <span>Select Ticket Variant</span>
                    </h4>
                    <span className="text-[11px] text-stone-400">Prices in GBP (£)</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {event.variants?.map((v) => {
                      const isSelected = selectedVariantId === v._id;
                      const isSoldOut = v.available <= 0;

                      return (
                        <div
                          key={v._id}
                          onClick={() => !isSoldOut && setSelectedVariantId(v._id)}
                          className={`p-3 rounded-2xl border transition-all cursor-pointer relative ${
                            isSelected
                              ? 'border-pink-600 bg-pink-50/50 shadow-sm'
                              : isSoldOut
                              ? 'border-stone-200 bg-stone-50 opacity-60 cursor-not-allowed'
                              : 'border-stone-200 hover:border-pink-300 bg-white'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-bold text-xs sm:text-sm text-stone-900">{v.name}</p>
                              {v.description && (
                                <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-1">{v.description}</p>
                              )}
                              <p className="text-[10px] text-stone-400 mt-1">
                                {isSoldOut ? 'Sold out' : `${v.available} tickets left`}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className="text-sm sm:text-base font-extrabold text-stone-900">
                                {v.price === 0 ? 'FREE' : `£${v.price}`}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Quantity and Total calculation */}
                {currentVariant && (
                  <div className="flex items-center justify-between bg-stone-50 p-3 rounded-2xl border border-stone-200/80">
                    <div>
                      <span className="text-xs text-stone-500 block">Quantity</span>
                      <div className="flex items-center space-x-2.5 mt-1">
                        <button
                          type="button"
                          disabled={quantity <= 1}
                          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                          className="w-7 h-7 rounded-lg bg-white border border-stone-300 font-bold text-stone-700 disabled:opacity-40 hover:bg-stone-100 flex items-center justify-center text-sm"
                        >
                          -
                        </button>
                        <span className="font-bold text-stone-900 text-sm px-1">{quantity}</span>
                        <button
                          type="button"
                          disabled={quantity >= Math.min(10, currentVariant.available)}
                          onClick={() => setQuantity((q) => q + 1)}
                          className="w-7 h-7 rounded-lg bg-white border border-stone-300 font-bold text-stone-700 disabled:opacity-40 hover:bg-stone-100 flex items-center justify-center text-sm"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-stone-500 block">Total Price</span>
                      <span className="text-lg sm:text-xl font-extrabold text-pink-600">
                        {totalPrice === 0 ? 'FREE' : `£${totalPrice}`}
                      </span>
                    </div>
                  </div>
                )}

                {/* User Info Form */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Your Email (for ticket) *</label>
                    <input
                      type="email"
                      required
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      placeholder="e.g. rahul@example.co.uk"
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                {/* Booking Error Display */}
                {bookingError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{bookingError}</span>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={bookingLoading || !currentVariant || currentVariant.available <= 0}
                  className="w-full py-3.5 px-4 rounded-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold text-sm shadow-lg shadow-pink-600/30 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {bookingLoading ? (
                    <span>Processing Booking...</span>
                  ) : (
                    <>
                      <span>Confirm & Book Tickets ({totalPrice === 0 ? 'FREE' : `£${totalPrice}`})</span>
                      <Sparkles className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
