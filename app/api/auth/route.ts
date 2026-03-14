import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { timingSafeEqual } from 'crypto';

const LOCKOUT_TTL = 60 * 15; // 15 minutes

function getIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  );
}

function safeCompare(a: string, b: string): boolean {
  try {
    const aBuf = Buffer.from(a);
    const bBuf = Buffer.from(b);
    if (aBuf.length !== bBuf.length) return false;
    return timingSafeEqual(aBuf, bBuf);
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const { password, from } = await req.json();

  const sitePassword = process.env.SITE_PASSWORD;
  const authSecret = process.env.AUTH_SECRET;

  if (!sitePassword || !authSecret) {
    return NextResponse.json({ error: 'Auth not configured' }, { status: 500 });
  }

  const ip = getIp(req);
  const lockoutKey = `auth:lockout:${ip}`;

  // Check if IP is locked out
  try {
    const locked = await kv.get(lockoutKey);
    if (locked) {
      return NextResponse.json(
        { error: 'Access locked. Try again in 15 minutes.' },
        { status: 429 }
      );
    }
  } catch {
    // KV unavailable — fail open so local dev still works
  }

  if (!safeCompare(password, sitePassword)) {
    // Lock this IP immediately on first wrong attempt
    try {
      await kv.set(lockoutKey, 1, { ex: LOCKOUT_TTL });
    } catch {
      // KV unavailable — still reject the password
    }
    return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 });
  }

  // Correct — clear any lockout and set auth cookie
  try {
    await kv.del(lockoutKey);
  } catch {}

  const res = NextResponse.json({ ok: true, redirect: from || '/' });
  res.cookies.set('auth_token', authSecret, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
