import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Event from '@/models/Event';

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { eventId, variantId, quantity = 1, userName, userEmail, userPhone } = body;

    if (!eventId || !variantId) {
      return NextResponse.json(
        { success: false, error: 'Event ID and Ticket Variant ID are required' },
        { status: 400 }
      );
    }

    if (!userName || !userEmail) {
      return NextResponse.json(
        { success: false, error: 'Your name and email are required to receive your tickets' },
        { status: 400 }
      );
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    const variant = event.variants.id(variantId);
    if (!variant) {
      return NextResponse.json(
        { success: false, error: 'Ticket variant not found' },
        { status: 404 }
      );
    }

    const qty = Number(quantity);
    if (qty <= 0) {
      return NextResponse.json(
        { success: false, error: 'Quantity must be at least 1' },
        { status: 400 }
      );
    }

    if (variant.available < qty) {
      return NextResponse.json(
        { success: false, error: `Only ${variant.available} tickets available for ${variant.name}` },
        { status: 400 }
      );
    }

    // Decrement available capacity
    variant.available -= qty;
    await event.save();

    const bookingRef = 'MI-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const totalAmount = variant.price * qty;

    return NextResponse.json({
      success: true,
      message: 'Tickets booked successfully!',
      booking: {
        bookingRef,
        eventTitle: event.title,
        venue: event.venue,
        city: event.city,
        date: event.date,
        time: event.time,
        variantName: variant.name,
        unitPrice: variant.price,
        quantity: qty,
        totalAmount,
        currency: variant.currency,
        userName,
        userEmail,
      },
    });
  } catch (error) {
    console.error('Booking error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Ticket booking failed' },
      { status: 500 }
    );
  }
}
