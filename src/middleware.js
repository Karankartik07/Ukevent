import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'meraindia_uk_events_jwt_secret_secure_key_2026_x89f';
const COOKIE_NAME = 'meraindia_admin_token';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // 1. Check if path is in admin portal
  const isAdminRoute = pathname.startsWith('/admin');
  const isLoginPage = pathname === '/admin/login';
  const isAdminApiRoute = pathname.startsWith('/api/admin') || pathname.startsWith('/api/upload');

  const token = request.cookies.get(COOKIE_NAME)?.value;
  let isAuthenticated = false;

  if (token) {
    try {
      const secret = new TextEncoder().encode(JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      if (payload && payload.id) {
        isAuthenticated = true;
      }
    } catch (e) {
      isAuthenticated = false;
    }
  }

  // 2. Handle /admin/login: If already logged in, redirect to /admin dashboard
  if (isLoginPage) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return NextResponse.next();
  }

  // 3. Handle protected /admin/* routes: If not logged in, redirect to /admin/login
  if (isAdminRoute && !isAuthenticated) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 4. Handle protected Admin API routes
  if (isAdminApiRoute && !isAuthenticated) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized: Admin authentication required' },
      { status: 401 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*', '/api/upload/:path*'],
};
