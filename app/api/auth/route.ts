import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import { timingSafeEqual } from 'crypto';
import { generateToken } from '@/lib/auth-token';

const LOCKOUT_TTL = 60 * 15; // 15 minutes

function getRedis() {
  return new Redis({
    url: (process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL)!,
    token: (process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN)!,
  });
}

function isKvAvailable(): boolean {
  return !!(
    (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) ||
    (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
  );
}

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
  if (isKvAvailable()) {
    try {
      const locked = await getRedis().get(lockoutKey);
      if (locked) {
        return NextResponse.json(
          { error: 'Access locked. Try again in 15 minutes.' },
          { status: 429 }
        );
      }
    } catch {
      // KV unavailable — fail open
    }
  }

  if (!safeCompare(password, sitePassword)) {
    // Lock this IP on first wrong attempt
    if (isKvAvailable()) {
      try {
        await getRedis().set(lockoutKey, 1, { ex: LOCKOUT_TTL });
      } catch {}
    }
    return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 });
  }

  // Correct — clear lockout and set HMAC-signed cookie
  if (isKvAvailable()) {
    try {
      await getRedis().del(lockoutKey);
    } catch {}
  }

  const token = await generateToken(authSecret);

  const res = NextResponse.json({ ok: true, redirect: from || '/' });
  res.cookies.set('auth_token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
