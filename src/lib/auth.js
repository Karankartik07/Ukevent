import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'meraindia_uk_events_jwt_secret_secure_key_2026_x89f';
export const COOKIE_NAME = 'meraindia_admin_token';
const TOKEN_EXPIRY = '7d';

export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

/**
 * Edge-compatible JWT verification for Next.js Middleware
 */
export async function verifyTokenEdge(token) {
  try {
    const secretKey = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secretKey);
    return payload;
  } catch (error) {
    return null;
  }
}

/**
 * Get current logged in admin user from cookies (Next.js Server context)
 */
export async function getAuthAdmin() {
  try {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const decoded = verifyToken(token);
    if (!decoded || !decoded.id) return null;

    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Set HTTP-only auth cookie (Next.js Server context)
 */
export async function setAuthCookie(token) {
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
  });
}

/**
 * Clear auth cookie on logout (Next.js Server context)
 */
export async function removeAuthCookie() {
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
