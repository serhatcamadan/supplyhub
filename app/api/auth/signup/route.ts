import { NextResponse } from 'next/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

function getSetCookies(headers: Headers): string[] {
  if (typeof (headers as unknown as { getSetCookie(): string[] }).getSetCookie === 'function') {
    return (headers as unknown as { getSetCookie(): string[] }).getSetCookie()
  }
  const combined = headers.get('set-cookie')
  return combined ? [combined] : []
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const nestRes = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const data = await nestRes.json()

    if (!nestRes.ok) {
      return NextResponse.json(data, { status: nestRes.status })
    }

    const response = NextResponse.json(data)

    for (const cookie of getSetCookies(nestRes.headers)) {
      response.headers.append('Set-Cookie', cookie)
    }

    return response
  } catch {
    return NextResponse.json(
      { message: 'Sunucuya bağlanılamadı. Lütfen tekrar deneyin.' },
      { status: 503 }
    )
  }
}
