import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth-token';

const PUBLIC_PATHS = ['/login', '/api/auth'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public paths through
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const secret = process.env.AUTH_SECRET;

  // If no secret is set, skip auth (local dev without env var)
  if (!secret) return NextResponse.next();

  const token = req.cookies.get('auth_token')?.value ?? '';
  const valid = token ? await verifyToken(token, secret) : false;

  if (valid) return NextResponse.next();

  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = '/login';
  loginUrl.searchParams.set('from', pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
