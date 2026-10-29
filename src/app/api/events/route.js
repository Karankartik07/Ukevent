import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Event from '@/models/Event';
import { getAuthAdmin } from '@/lib/auth';

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);

    const featured = searchParams.get('featured');
    const category = searchParams.get('category');
    const city = searchParams.get('city');
    const search = searchParams.get('search');
    const isAdmin = searchParams.get('all') === 'true';

    const filter = {};

    // Normal visitors only see published events
    if (!isAdmin) {
      filter.status = 'published';
    }

    if (featured === 'true') {
      filter.isFeatured = true;
    }

    if (category && category !== 'ALL') {
      filter.category = category.toUpperCase();
    }

    if (city && city !== 'ALL') {
      filter.city = new RegExp(city, 'i');
    }

    if (search && search.trim() !== '') {
      const q = search.trim();
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { subtitle: { $regex: q, $options: 'i' } },
        { venue: { $regex: q, $options: 'i' } },
        { city: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } },
      ];
    }

    const events = await Event.find(filter).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error) {
    console.error('Fetch events error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    // 1. Verify admin
    const admin = await getAuthAdmin();
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin authentication required' },
        { status: 401 }
      );
    }

    await connectDB();
    const body = await request.json();

    const {
      title,
      subtitle,
      description,
      category,
      date,
      time,
      displayMonth,
      displayDay,
      venue,
      city,
      address,
      imageUrl,
      imagePublicId,
      isFeatured,
      status,
      variants,
      tags,
    } = body;

    // 2. Comprehensive Validation
    const errors = [];
    if (!title || !title.trim()) errors.push('Title is required');
    if (!category) errors.push('Category is required');
    if (!date) errors.push('Date is required');
    if (!venue || !venue.trim()) errors.push('Venue is required');
    if (!city || !city.trim()) errors.push('City is required');
    if (!imageUrl || !imageUrl.trim()) errors.push('Poster image URL or upload is required');

    if (!Array.isArray(variants) || variants.length === 0) {
      errors.push('At least one ticket variant is required (e.g. VIP, Standard, Early Bird)');
    } else {
      variants.forEach((v, index) => {
        if (!v.name || !v.name.trim()) {
          errors.push(`Variant #${index + 1} must have a name`);
        }
        if (v.price === undefined || v.price === null || isNaN(v.price) || Number(v.price) < 0) {
          errors.push(`Variant #${index + 1} (${v.name || 'unnamed'}) must have a valid price (0 or more)`);
        }
        if (!v.capacity || isNaN(v.capacity) || Number(v.capacity) < 1) {
          errors.push(`Variant #${index + 1} must have a capacity of at least 1`);
        }
      });
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, error: errors.join(', '), errors },
        { status: 400 }
      );
    }

    // Auto extract displayMonth / displayDay if not manually set
    let finalMonth = displayMonth;
    let finalDay = displayDay;
    if (!finalMonth || !finalDay) {
      const parsed = new Date(date);
      if (!isNaN(parsed.getTime())) {
        const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        finalMonth = finalMonth || monthNames[parsed.getMonth()];
        finalDay = finalDay || String(parsed.getDate()).padStart(2, '0');
      } else {
        finalMonth = finalMonth || 'UK';
        finalDay = finalDay || '01';
      }
    }

    // Prepare variants with available counts
    const cleanVariants = variants.map((v) => ({
      name: v.name.trim(),
      price: Number(v.price),
      currency: v.currency || 'GBP',
      capacity: Number(v.capacity),
      available: v.available !== undefined ? Number(v.available) : Number(v.capacity),
      description: v.description || '',
    }));

    const cleanTags = Array.isArray(tags)
      ? tags
      : typeof tags === 'string'
      ? tags.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

    const newEvent = await Event.create({
      title: title.trim(),
      subtitle: (subtitle || '').trim(),
      description: (description || '').trim(),
      category: category.toUpperCase(),
      date,
      time: time || '19:00',
      displayMonth: finalMonth.toUpperCase(),
      displayDay: String(finalDay),
      venue: venue.trim(),
      city: city.trim(),
      address: (address || '').trim(),
      imageUrl: imageUrl.trim(),
      imagePublicId: imagePublicId || '',
      isFeatured: Boolean(isFeatured),
      status: status || 'published',
      variants: cleanVariants,
      tags: cleanTags,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Event created successfully',
        event: newEvent,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create event error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create event' },
      { status: 500 }
    );
  }
}
