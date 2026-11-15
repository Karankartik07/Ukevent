import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { getAuthAdmin } from '@/lib/auth';

export async function GET(request) {
  try {
    const admin = await getAuthAdmin();
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin authentication required' },
        { status: 401 }
      );
    }

    await connectDB();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    const filter = {};
    if (search && search.trim() !== '') {
      const q = search.trim();
      filter.$or = [
        { bookingRef: { $regex: q, $options: 'i' } },
        { userName: { $regex: q, $options: 'i' } },
        { userEmail: { $regex: q, $options: 'i' } },
        { eventTitle: { $regex: q, $options: 'i' } },
        { variantName: { $regex: q, $options: 'i' } },
      ];
    }

    const bookings = await Booking.find(filter).sort({ createdAt: -1 });

    const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    const totalTicketsSold = bookings.reduce((sum, b) => sum + (b.quantity || 0), 0);

    return NextResponse.json({
      success: true,
      count: bookings.length,
      totalRevenue,
      totalTicketsSold,
      bookings,
    });
  } catch (error) {
    console.error('Fetch bookings error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch booked tickets' },
      { status: 500 }
    );
  }
}
