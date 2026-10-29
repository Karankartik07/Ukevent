'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  UploadCloud,
  Plus,
  Trash2,
  Ticket,
  Calendar,
  Sparkles,
  Loader2,
  AlertCircle,
  CheckCircle,
  Image as ImageIcon,
} from 'lucide-react';

const CATEGORIES = ['MUSIC', 'FESTIVAL', 'CULTURE', 'FOOD', 'TRAVEL', 'EDUCATION', 'BUSINESS', 'OTHER'];
const UK_CITIES = ['London', 'Birmingham', 'Leicester', 'Manchester', 'Leeds', 'Edinburgh', 'Glasgow', 'Coventry'];

export default function EditEventPage({ params }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const [loadingEvent, setLoadingEvent] = useState(true);

  // Form Fields
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState('MUSIC');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('19:00');
  const [displayMonth, setDisplayMonth] = useState('');
  const [displayDay, setDisplayDay] = useState('');
  const [venue, setVenue] = useState('');
  const [city, setCity] = useState('London');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [status, setStatus] = useState('published');
  const [tags, setTags] = useState('');

  // Image & Cloudinary
  const [imageUrl, setImageUrl] = useState('');
  const [imagePublicId, setImagePublicId] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Variants
  const [variants, setVariants] = useState([]);

  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  useEffect(() => {
    async function fetchEvent() {
      try {
        setLoadingEvent(true);
        const res = await fetch(`/api/events/${id}`);
        const data = await res.json();
        if (data.success && data.event) {
          const ev = data.event;
          setTitle(ev.title || '');
          setSubtitle(ev.subtitle || '');
          setCategory(ev.category || 'MUSIC');
          setDate(ev.date || '');
          setTime(ev.time || '19:00');
          setDisplayMonth(ev.displayMonth || '');
          setDisplayDay(ev.displayDay || '');
          setVenue(ev.venue || '');
          setCity(ev.city || 'London');
          setAddress(ev.address || '');
          setDescription(ev.description || '');
          setIsFeatured(Boolean(ev.isFeatured));
          setStatus(ev.status || 'published');
          setTags(Array.isArray(ev.tags) ? ev.tags.join(', ') : '');
          setImageUrl(ev.imageUrl || '');
          setImagePublicId(ev.imagePublicId || '');
          setVariants(
            ev.variants && ev.variants.length > 0
              ? ev.variants.map((v) => ({
                  name: v.name,
                  price: v.price,
                  capacity: v.capacity,
                  description: v.description || '',
                }))
              : [{ name: 'General Admission', price: 25, capacity: 100, description: '' }]
          );
        } else {
          setFormError('Failed to load event data');
        }
      } catch (err) {
        setFormError('Error loading event');
      } finally {
        setLoadingEvent(false);
      }
    }

    if (id) {
      fetchEvent();
    }
  }, [id]);

  const handleDateChange = (val) => {
    setDate(val);
    const parsed = new Date(val);
    if (!isNaN(parsed.getTime())) {
      const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      setDisplayMonth(monthNames[parsed.getMonth()]);
      setDisplayDay(String(parsed.getDate()).padStart(2, '0'));
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError('');
    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to upload image to Cloudinary');
      }

      setImageUrl(data.url);
      setImagePublicId(data.public_id);
    } catch (err) {
      setUploadError(err.message || 'Image upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
      {
        name: '',
        price: 25,
        capacity: 100,
        description: '',
      },
    ]);
  };

  const updateVariant = (index, field, value) => {
    setVariants((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const removeVariant = (index) => {
    if (variants.length <= 1) {
      alert('Event must have at least one ticket variant');
      return;
    }
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!title.trim()) return setFormError('Event title is required');
    if (!date.trim()) return setFormError('Event date is required');
    if (!venue.trim()) return setFormError('Venue name is required');
    if (!city.trim()) return setFormError('City is required');
    if (!imageUrl.trim()) return setFormError('Image is required');

    for (let i = 0; i < variants.length; i++) {
      const v = variants[i];
      if (!v.name.trim()) return setFormError(`Variant #${i + 1} must have a name`);
      if (v.price === undefined || v.price === '' || isNaN(v.price) || Number(v.price) < 0) {
        return setFormError(`Variant #${i + 1} must have a valid price (0 or more)`);
      }
      if (!v.capacity || isNaN(v.capacity) || Number(v.capacity) < 1) {
        return setFormError(`Variant #${i + 1} must have a capacity of at least 1`);
      }
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          subtitle,
          category,
          date,
          time,
          displayMonth,
          displayDay,
          venue,
          city,
          address,
          description,
          imageUrl,
          imagePublicId,
          isFeatured,
          status,
          variants,
          tags,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update event');
      }

      setFormSuccess('Event updated successfully! Redirecting...');
      setTimeout(() => {
        router.push('/admin/events');
      }, 800);
    } catch (err) {
      setFormError(err.message || 'Error updating event');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingEvent) {
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-pink-600" />
        <p className="text-sm font-semibold text-stone-600">Loading event details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl pb-16">
      
      {/* Navigation & Header */}
      <div className="flex items-center space-x-3">
        <Link
          href="/admin/events"
          className="p-2 rounded-xl bg-white border border-stone-200 text-stone-600 hover:text-pink-600 hover:border-pink-300 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold font-serif text-stone-900">
            Edit Event & Ticket Variants
          </h1>
          <p className="text-xs text-stone-500">
            Modify event details, dates, pricing, capacity, and Cloudinary media.
          </p>
        </div>
      </div>

      {formError && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {formSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{formSuccess}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* SECTION 1: Overview */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-stone-900 border-b pb-2 flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-pink-600" />
            <span>Event Overview</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 mb-1">Event Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Subtitle / Tour Name</label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 2: Date, Time & Venue */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-stone-900 border-b pb-2 flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-pink-600" />
            <span>Date, Time & Venue</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 mb-1">Date *</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => handleDateChange(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Time</label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Display Badge (Month/Day)</label>
              <div className="flex space-x-1.5">
                <input
                  type="text"
                  maxLength={4}
                  value={displayMonth}
                  onChange={(e) => setDisplayMonth(e.target.value.toUpperCase())}
                  className="w-1/2 px-2 py-2 text-center text-xs font-bold bg-stone-50 border border-stone-200 rounded-xl uppercase"
                />
                <input
                  type="text"
                  maxLength={3}
                  value={displayDay}
                  onChange={(e) => setDisplayDay(e.target.value)}
                  className="w-1/2 px-2 py-2 text-center text-xs font-bold bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 mb-1">Venue Name *</label>
              <input
                type="text"
                required
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">City *</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                {UK_CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Postal Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: Cloudinary Image */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-stone-900 border-b pb-2 flex items-center space-x-2">
            <UploadCloud className="w-4 h-4 text-pink-600" />
            <span>Cloudinary Poster Image</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-start">
            <div className="space-y-3">
              <div className="border-2 border-dashed border-stone-300 hover:border-pink-500 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-stone-50/50">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploadingImage}
                  className="hidden"
                  id="cloudinary-file-edit-input"
                />
                <label htmlFor="cloudinary-file-edit-input" className="cursor-pointer block">
                  {uploadingImage ? (
                    <div className="flex flex-col items-center space-y-2 text-pink-600">
                      <Loader2 className="w-8 h-8 animate-spin" />
                      <span className="text-xs font-semibold">Uploading new image to Cloudinary...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center space-y-2 text-stone-500">
                      <UploadCloud className="w-8 h-8 text-pink-600" />
                      <span className="text-xs font-semibold text-stone-800">
                        Click to replace poster image
                      </span>
                    </div>
                  )}
                </label>
              </div>

              {uploadError && (
                <p className="text-xs text-rose-600 flex items-center space-x-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{uploadError}</span>
                </p>
              )}

              <div className="pt-2">
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                  Or Paste Direct Image URL
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-pink-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Poster Preview</label>
              <div className="relative h-48 sm:h-56 w-full rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 flex items-center justify-center">
                {imageUrl ? (
                  <img src={imageUrl} alt="Poster preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-stone-300" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4: Ticket Variants */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <div>
              <h2 className="text-base font-bold text-stone-900 flex items-center space-x-2">
                <Ticket className="w-4 h-4 text-pink-600" />
                <span>Ticket Variants & Pricing</span>
              </h2>
            </div>
            <button
              type="button"
              onClick={addVariant}
              className="px-3 py-1.5 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-700 text-xs font-bold flex items-center space-x-1.5 transition-colors border border-pink-200"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Variant</span>
            </button>
          </div>

          <div className="space-y-3.5">
            {variants.map((v, index) => (
              <div
                key={index}
                className="p-4 rounded-2xl border border-stone-200 bg-stone-50/60 relative space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-stone-700 uppercase tracking-wider">
                    Variant #{index + 1}
                  </span>
                  {variants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeVariant(index)}
                      className="text-stone-400 hover:text-rose-600 text-xs flex items-center space-x-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">Variant Name *</label>
                    <input
                      type="text"
                      required
                      value={v.name}
                      onChange={(e) => updateVariant(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">Price (£ GBP) *</label>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      required
                      value={v.price}
                      onChange={(e) => updateVariant(index, 'price', e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">Capacity / Tickets *</label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={v.capacity}
                      onChange={(e) => updateVariant(index, 'capacity', e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-pink-500"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">Variant Description</label>
                    <input
                      type="text"
                      value={v.description}
                      onChange={(e) => updateVariant(index, 'description', e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-pink-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 5: Description & Status */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-stone-900 border-b pb-2">
            Description & Status
          </h2>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Event Description</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Tags (comma-separated)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center space-x-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 text-pink-600 rounded border-stone-300 focus:ring-pink-500"
              />
              <span className="text-xs font-bold text-stone-800">
                ★ Feature this event on Homepage Carousel
              </span>
            </label>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-4">
          <Link
            href="/admin/events"
            className="px-5 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-700 text-xs sm:text-sm font-semibold hover:bg-stone-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting || uploadingImage}
            className="px-6 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-pink-600/30 transition-all disabled:opacity-50 flex items-center space-x-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Updating Event...</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
