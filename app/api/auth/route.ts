import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { password, from } = await req.json();

  const sitePassword = process.env.SITE_PASSWORD;
  const authSecret = process.env.AUTH_SECRET;

  if (!sitePassword || !authSecret) {
    return NextResponse.json({ error: 'Auth not configured' }, { status: 500 });
  }

  if (password !== sitePassword) {
    return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true, redirect: from || '/' });
  res.cookies.set('auth_token', authSecret, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    // No maxAge = session cookie; add maxAge: 60 * 60 * 24 * 30 for 30-day persistence
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
