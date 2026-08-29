import { NextResponse } from 'next/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

// getSetCookie() returns individual Set-Cookie headers as an array.
// Necessary because Expires dates contain commas (e.g. "Sat, 05 Sep 2026 ..."),
// which breaks naive comma-joined header forwarding.
function getSetCookies(headers: Headers): string[] {
  if (typeof (headers as unknown as { getSetCookie(): string[] }).getSetCookie === 'function') {
    return (headers as unknown as { getSetCookie(): string[] }).getSetCookie()
  }
  const combined = headers.get('set-cookie')
  return combined ? [combined] : []
}

export async function POST(request: Request) {
  const body = await request.json() as { email: string; password: string }

  const nestRes = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const data = await nestRes.json()

  if (!nestRes.ok) {
    return NextResponse.json(data, { status: nestRes.status })
  }

  const response = NextResponse.json(data)

  // Forward NestJS JWT cookies (access_token + refresh_token) — each as a separate header
  for (const cookie of getSetCookies(nestRes.headers)) {
    response.headers.append('Set-Cookie', cookie)
  }

  return response
}
