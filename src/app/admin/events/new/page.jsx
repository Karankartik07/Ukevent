'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  UploadCloud,
  Plus,
  Trash2,
  Ticket,
  Calendar,
  MapPin,
  Sparkles,
  Loader2,
  AlertCircle,
  CheckCircle,
  Image as ImageIcon,
} from 'lucide-react';

const CATEGORIES = ['MUSIC', 'FESTIVAL', 'CULTURE', 'FOOD', 'TRAVEL', 'EDUCATION', 'BUSINESS', 'OTHER'];
const UK_CITIES = ['London', 'Birmingham', 'Leicester', 'Manchester', 'Leeds', 'Edinburgh', 'Glasgow', 'Coventry'];

export default function CreateEventPage() {
  const router = useRouter();

  // Basic Details
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

  // Ticket Variants
  const [variants, setVariants] = useState([
    {
      name: 'General Admission',
      price: 35,
      capacity: 250,
      description: 'Standard reserved seating / general entry',
    },
    {
      name: 'VIP Experience',
      price: 85,
      capacity: 50,
      description: 'Prime seating, fast-track entry and lanyard',
    },
  ]);

  // Form State
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Auto-fill month & day when date changes
  const handleDateChange = (val) => {
    setDate(val);
    const parsed = new Date(val);
    if (!isNaN(parsed.getTime())) {
      const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      setDisplayMonth(monthNames[parsed.getMonth()]);
      setDisplayDay(String(parsed.getDate()).padStart(2, '0'));
    }
  };

  // Upload to Cloudinary via backend API
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
        throw new Error(data.error || 'Failed to upload to Cloudinary');
      }

      setImageUrl(data.url);
      setImagePublicId(data.public_id);
    } catch (err) {
      setUploadError(err.message || 'Image upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  // Variant operations
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

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    // Validations
    if (!title.trim()) return setFormError('Event title is required');
    if (!date.trim()) return setFormError('Event date is required');
    if (!venue.trim()) return setFormError('Venue name is required');
    if (!city.trim()) return setFormError('City is required');
    if (!imageUrl.trim()) return setFormError('Please upload an image to Cloudinary or provide an image URL');

    if (!variants || variants.length === 0) {
      return setFormError('At least one ticket variant is required');
    }

    for (let i = 0; i < variants.length; i++) {
      const v = variants[i];
      if (!v.name.trim()) return setFormError(`Variant #${i + 1} must have a name`);
      if (v.price === undefined || v.price === '' || isNaN(v.price) || Number(v.price) < 0) {
        return setFormError(`Variant #${i + 1} (${v.name}) must have a valid price (0 or more)`);
      }
      if (!v.capacity || isNaN(v.capacity) || Number(v.capacity) < 1) {
        return setFormError(`Variant #${i + 1} must have a capacity of at least 1`);
      }
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
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
        throw new Error(data.error || 'Failed to create event');
      }

      setFormSuccess('Event created successfully! Redirecting to events list...');
      setTimeout(() => {
        router.push('/admin/events');
      }, 900);
    } catch (err) {
      setFormError(err.message || 'Error creating event');
    } finally {
      setSubmitting(false);
    }
  };

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
            Create New UK Diaspora Event
          </h1>
          <p className="text-xs text-stone-500">
            Upload posters to Cloudinary, schedule dates, and set up custom ticket variants.
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
        
        {/* SECTION 1: Basic Event Details */}
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
                placeholder="e.g. Arijit Singh Live at OVO Arena Wembley"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Subtitle / Tour Name</label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. Soulful Symphony UK Tour"
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
                placeholder="19:00"
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
                  placeholder="AUG"
                  className="w-1/2 px-2 py-2 text-center text-xs font-bold bg-stone-50 border border-stone-200 rounded-xl uppercase"
                />
                <input
                  type="text"
                  maxLength={3}
                  value={displayDay}
                  onChange={(e) => setDisplayDay(e.target.value)}
                  placeholder="23"
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
                placeholder="e.g. OVO Arena Wembley"
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
                placeholder="Arena Square, London HA9 0AA"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: Cloudinary Poster Image */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-stone-900 border-b pb-2 flex items-center space-x-2">
            <UploadCloud className="w-4 h-4 text-pink-600" />
            <span>Cloudinary Poster Image</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-start">
            
            {/* Upload Box */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-stone-700">
                Upload from Device to Cloudinary (cloud: o31b8mid)
              </label>
              <div className="border-2 border-dashed border-stone-300 hover:border-pink-500 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-stone-50/50">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploadingImage}
                  className="hidden"
                  id="cloudinary-file-input"
                />
                <label htmlFor="cloudinary-file-input" className="cursor-pointer block">
                  {uploadingImage ? (
                    <div className="flex flex-col items-center space-y-2 text-pink-600">
                      <Loader2 className="w-8 h-8 animate-spin" />
                      <span className="text-xs font-semibold">Uploading to Cloudinary...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center space-y-2 text-stone-500">
                      <UploadCloud className="w-8 h-8 text-pink-600" />
                      <span className="text-xs font-semibold text-stone-800">
                        Click to select poster image
                      </span>
                      <span className="text-[11px] text-stone-400">
                        PNG, JPG, WEBP up to 10MB
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

              {/* Or manual URL input */}
              <div className="pt-2">
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                  Or Paste Direct Image URL
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/... or https://res.cloudinary.com/..."
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-pink-500"
                />
              </div>
            </div>

            {/* Preview Box */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Poster Preview</label>
              <div className="relative h-48 sm:h-56 w-full rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 flex items-center justify-center">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="Poster preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center text-stone-400 text-xs">
                    <ImageIcon className="w-8 h-8 mx-auto mb-1 text-stone-300" />
                    <span>No image selected yet</span>
                  </div>
                )}
              </div>
              {imagePublicId && (
                <p className="text-[10px] text-stone-400 mt-1 font-mono truncate">
                  Cloudinary ID: {imagePublicId}
                </p>
              )}
            </div>

          </div>
        </div>

        {/* SECTION 4: Ticket Variants (Dynamic Repeater) */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <div>
              <h2 className="text-base font-bold text-stone-900 flex items-center space-x-2">
                <Ticket className="w-4 h-4 text-pink-600" />
                <span>Ticket Variants & Pricing</span>
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Configure multiple ticket tiers (e.g. VIP, Standard, Early Bird, Student).
              </p>
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
                      placeholder="e.g. VIP Front Row / Early Bird"
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
                      placeholder="45"
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
                      placeholder="200"
                      className="w-full px-3 py-2 text-xs bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-pink-500"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">Variant Description</label>
                    <input
                      type="text"
                      value={v.description}
                      onChange={(e) => updateVariant(index, 'description', e.target.value)}
                      placeholder="e.g. Standard entry + complimentary souvenir programme"
                      className="w-full px-3 py-2 text-xs bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-pink-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 5: Description, Visibility & Publishing */}
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
              placeholder="Provide event overview, artist biography, doors open timing, food stalls, transport information..."
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
                placeholder="Bollywood, Live, Wembley, Concert"
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
                <option value="published">Published (Visible to public)</option>
                <option value="draft">Draft (Hidden from public)</option>
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

        {/* Action Buttons */}
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
                <span>Saving Event...</span>
              </>
            ) : (
              <span>Save & Publish Event</span>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
