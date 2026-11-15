import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Event from '@/models/Event';
import Listing from '@/models/Listing';
import Booking from '@/models/Booking';
import { getAuthAdmin } from '@/lib/auth';

export async function GET() {
  try {
    const admin = await getAuthAdmin();
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    const totalEvents = await Event.countDocuments();
    const featuredEvents = await Event.countDocuments({ isFeatured: true });
    const publishedEvents = await Event.countDocuments({ status: 'published' });
    const draftEvents = await Event.countDocuments({ status: 'draft' });
    const totalListings = await Listing.countDocuments();

    // Calculate total variants
    const events = await Event.find({}, 'variants');
    const totalVariants = events.reduce((sum, e) => sum + (e.variants?.length || 0), 0);

    // Bookings summary
    const bookings = await Booking.find({});
    const totalBookings = bookings.length;
    const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    const totalTicketsSold = bookings.reduce((sum, b) => sum + (b.quantity || 0), 0);

    return NextResponse.json({
      success: true,
      stats: {
        totalEvents,
        featuredEvents,
        publishedEvents,
        draftEvents,
        totalListings,
        totalVariants,
        totalBookings,
        totalRevenue,
        totalTicketsSold,
      },
    });
  } catch (error) {
    console.error('Fetch admin stats error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch admin stats' },
      { status: 500 }
    );
  }
}
