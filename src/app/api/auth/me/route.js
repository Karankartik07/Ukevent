import { NextResponse } from 'next/server';
import { getAuthAdmin } from '@/lib/auth';

export async function GET() {
  try {
    const admin = await getAuthAdmin();
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      admin,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Authentication check failed' },
      { status: 500 }
    );
  }
}
