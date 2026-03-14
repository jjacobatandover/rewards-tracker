/**
 * HMAC-SHA256 token helpers using Web Crypto API.
 * Compatible with both Edge Runtime (middleware) and Node.js 18+ (API routes).
 *
 * The cookie stores an HMAC of a fixed payload signed with AUTH_SECRET,
 * so even if someone reads the cookie value they cannot derive the secret.
 */

const PAYLOAD = 'perks-auth-v1';

async function importKey(secret: string, usage: 'sign' | 'verify') {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    [usage]
  );
}

/** Generate the HMAC token from AUTH_SECRET. Set this as the cookie value. */
export async function generateToken(secret: string): Promise<string> {
  const key = await importKey(secret, 'sign');
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(PAYLOAD));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/** Verify a cookie value against AUTH_SECRET. Constant-time via Web Crypto. */
export async function verifyToken(token: string, secret: string): Promise<boolean> {
  try {
    const key = await importKey(secret, 'verify');
    const bytes = new Uint8Array(token.match(/.{2}/g)!.map((b) => parseInt(b, 16)));
    return await crypto.subtle.verify('HMAC', key, bytes, new TextEncoder().encode(PAYLOAD));
  } catch {
    return false;
  }
}
