import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import Event from '@/models/Event';
import { getAuthAdmin } from '@/lib/auth';
import { deleteFromCloudinary } from '@/lib/cloudinary';

export async function GET(request, context) {
  try {
    await connectDB();
    const { id } = await context.params;

    let event = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      event = await Event.findById(id);
    }
    if (!event) {
      event = await Event.findOne({ slug: id });
    }

    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      event,
    });
  } catch (error) {
    console.error('Get event error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch event details' },
      { status: 500 }
    );
  }
}

export async function PUT(request, context) {
  try {
    const admin = await getAuthAdmin();
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin login required' },
        { status: 401 }
      );
    }

    await connectDB();
    const { id } = await context.params;

    const event = await Event.findById(id);
    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

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

    // Validation
    const errors = [];
    if (!title || !title.trim()) errors.push('Title is required');
    if (!category) errors.push('Category is required');
    if (!date) errors.push('Date is required');
    if (!venue || !venue.trim()) errors.push('Venue is required');
    if (!city || !city.trim()) errors.push('City is required');

    if (variants && Array.isArray(variants)) {
      if (variants.length === 0) {
        errors.push('At least one ticket variant is required');
      } else {
        variants.forEach((v, index) => {
          if (!v.name || !v.name.trim()) {
            errors.push(`Variant #${index + 1} must have a name`);
          }
          if (v.price === undefined || isNaN(v.price) || Number(v.price) < 0) {
            errors.push(`Variant #${index + 1} must have a valid price (0 or more)`);
          }
          if (!v.capacity || isNaN(v.capacity) || Number(v.capacity) < 1) {
            errors.push(`Variant #${index + 1} must have a capacity of at least 1`);
          }
        });
      }
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, error: errors.join(', '), errors },
        { status: 400 }
      );
    }

    // Auto extract displayMonth / displayDay if not manually set
    let finalMonth = displayMonth || event.displayMonth;
    let finalDay = displayDay || event.displayDay;
    if (date && (!displayMonth || !displayDay)) {
      const parsed = new Date(date);
      if (!isNaN(parsed.getTime())) {
        const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        finalMonth = displayMonth || monthNames[parsed.getMonth()];
        finalDay = displayDay || String(parsed.getDate()).padStart(2, '0');
      }
    }

    // If new image uploaded and old one has public id, remove old one from cloudinary
    if (imagePublicId && event.imagePublicId && event.imagePublicId !== imagePublicId) {
      deleteFromCloudinary(event.imagePublicId).catch(console.error);
    }

    event.title = title.trim();
    if (subtitle !== undefined) event.subtitle = subtitle.trim();
    if (description !== undefined) event.description = description.trim();
    if (category) event.category = category.toUpperCase();
    if (date) event.date = date;
    if (time !== undefined) event.time = time;
    if (finalMonth) event.displayMonth = finalMonth.toUpperCase();
    if (finalDay) event.displayDay = String(finalDay);
    if (venue) event.venue = venue.trim();
    if (city) event.city = city.trim();
    if (address !== undefined) event.address = address.trim();
    if (imageUrl) event.imageUrl = imageUrl.trim();
    if (imagePublicId) event.imagePublicId = imagePublicId;
    if (isFeatured !== undefined) event.isFeatured = Boolean(isFeatured);
    if (status) event.status = status;

    if (variants && Array.isArray(variants)) {
      event.variants = variants.map((v) => ({
        name: v.name.trim(),
        price: Number(v.price),
        currency: v.currency || 'GBP',
        capacity: Number(v.capacity),
        available: v.available !== undefined ? Number(v.available) : Number(v.capacity),
        description: v.description || '',
      }));
    }

    if (tags !== undefined) {
      event.tags = Array.isArray(tags)
        ? tags
        : typeof tags === 'string'
        ? tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [];
    }

    await event.save();

    return NextResponse.json({
      success: true,
      message: 'Event updated successfully',
      event,
    });
  } catch (error) {
    console.error('Update event error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update event' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, context) {
  try {
    const admin = await getAuthAdmin();
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin login required' },
        { status: 401 }
      );
    }

    await connectDB();
    const { id } = await context.params;

    const event = await Event.findById(id);
    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    // Delete image from Cloudinary if stored there
    if (event.imagePublicId) {
      deleteFromCloudinary(event.imagePublicId).catch(console.error);
    }

    await Event.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Event deleted successfully',
    });
  } catch (error) {
    console.error('Delete event error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete event' },
      { status: 500 }
    );
  }
}
