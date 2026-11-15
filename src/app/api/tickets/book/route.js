import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import Event from '@/models/Event';
import Booking from '@/models/Booking';
import { sendTicketEmail } from '@/lib/mail';

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { eventId, variantId, quantity = 1, userName, userEmail, userPhone } = body;

    // 1. Basic parameter validation
    if (!eventId || !variantId) {
      return NextResponse.json(
        { success: false, error: 'Event ID and Ticket Variant ID are required' },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid Event ID provided' },
        { status: 400 }
      );
    }

    if (!userName || typeof userName !== 'string' || !userName.trim()) {
      return NextResponse.json(
        { success: false, error: 'Please provide your full name' },
        { status: 400 }
      );
    }

    if (!userEmail || typeof userEmail !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid email address to receive your tickets' },
        { status: 400 }
      );
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(userEmail.trim())) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address (e.g. name@domain.co.uk)' },
        { status: 400 }
      );
    }

    // 2. Validate quantity is an integer
    const qty = Number(quantity);
    if (!Number.isInteger(qty) || qty < 1) {
      return NextResponse.json(
        { success: false, error: 'Ticket quantity must be a positive whole number (at least 1)' },
        { status: 400 }
      );
    }

    if (qty > 20) {
      return NextResponse.json(
        { success: false, error: 'Maximum 20 tickets allowed per single transaction' },
        { status: 400 }
      );
    }

    // 3. Find event first to inspect variant details
    const existingEvent = await Event.findById(eventId);
    if (!existingEvent) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    const variant = existingEvent.variants.id(variantId);
    if (!variant) {
      return NextResponse.json(
        { success: false, error: 'Ticket variant tier not found for this event' },
        { status: 404 }
      );
    }

    if (variant.available < qty) {
      return NextResponse.json(
        {
          success: false,
          error: variant.available <= 0
            ? `Sorry, "${variant.name}" tickets are sold out!`
            : `Only ${variant.available} ticket(s) left for "${variant.name}". Please adjust quantity.`,
        },
        { status: 400 }
      );
    }

    // 4. ATOMIC DECREMENT to prevent race conditions & overselling
    const updatedEvent = await Event.findOneAndUpdate(
      {
        _id: eventId,
        'variants._id': variantId,
        'variants.available': { $gte: qty },
      },
      {
        $inc: { 'variants.$.available': -qty },
      },
      { new: true }
    );

    if (!updatedEvent) {
      return NextResponse.json(
        { success: false, error: 'Tickets are no longer available in the requested quantity. Please try again.' },
        { status: 400 }
      );
    }

    const bookingRef = 'MI-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const totalAmount = variant.price * qty;

    const bookingData = {
      bookingRef,
      eventId: existingEvent._id,
      eventTitle: existingEvent.title,
      venue: existingEvent.venue,
      city: existingEvent.city,
      date: existingEvent.date,
      time: existingEvent.time || '19:00',
      variantId: variant._id.toString(),
      variantName: variant.name,
      unitPrice: variant.price,
      quantity: qty,
      totalAmount,
      currency: variant.currency || 'GBP',
      userName: userName.trim(),
      userEmail: userEmail.toLowerCase().trim(),
      userPhone: (userPhone || '').trim(),
      status: 'confirmed',
    };

    // 5. Store in Booking collection
    const savedBooking = await Booking.create(bookingData);

    // 6. Send Ticket Email via Nodemailer (asynchronously without blocking)
    sendTicketEmail(bookingData).catch((mailErr) => {
      console.error('Non-blocking email notification error:', mailErr);
    });

    return NextResponse.json({
      success: true,
      message: 'Tickets booked successfully! Confirmation email has been sent.',
      booking: {
        id: savedBooking._id,
        bookingRef,
        eventTitle: existingEvent.title,
        venue: existingEvent.venue,
        city: existingEvent.city,
        date: existingEvent.date,
        time: existingEvent.time || '19:00',
        variantName: variant.name,
        unitPrice: variant.price,
        quantity: qty,
        totalAmount,
        currency: variant.currency || 'GBP',
        userName: userName.trim(),
        userEmail: userEmail.toLowerCase().trim(),
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
