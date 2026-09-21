import { NextResponse } from 'next/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const nestRes = await fetch(`${API_URL}/auth/send-verification`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(15000),
    })

    const data = await nestRes.json()
    return NextResponse.json(data, { status: nestRes.status })
  } catch {
    // No message here — the UI is locale-aware and picks its own copy for a 503 status.
    return NextResponse.json({}, { status: 503 })
  }
}
