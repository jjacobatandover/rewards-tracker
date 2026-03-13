import { NextRequest, NextResponse } from 'next/server';
import { kvGetCards, kvSetCards } from '@/lib/kv';

export async function GET() {
  const cards = await kvGetCards();
  if (cards === null) {
    return NextResponse.json({ cards: null, kvAvailable: false });
  }
  return NextResponse.json({ cards, kvAvailable: true });
}

export async function POST(req: NextRequest) {
  const { cards } = await req.json();
  if (!Array.isArray(cards)) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
  await kvSetCards(cards);
  return NextResponse.json({ ok: true });
}
