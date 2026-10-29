import { NextResponse } from 'next/server';
import { seedInitialData } from '@/lib/seed';
import { getAuthAdmin } from '@/lib/auth';

export async function POST() {
  try {
    const admin = await getAuthAdmin();
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin login required' },
        { status: 401 }
      );
    }

    await seedInitialData(true);

    return NextResponse.json({
      success: true,
      message: 'Initial events and listings seeded successfully',
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to seed data' },
      { status: 500 }
    );
  }
}
