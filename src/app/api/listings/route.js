import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Listing from '@/models/Listing';

export async function GET() {
  try {
    await connectDB();
    const listings = await Listing.find().sort({ createdAt: 1 });
    return NextResponse.json({
      success: true,
      count: listings.length,
      listings,
    });
  } catch (error) {
    console.error('Fetch listings error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch listings' },
      { status: 500 }
    );
  }
}
