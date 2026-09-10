import { NextResponse } from 'next/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

export async function POST(request: Request) {
  try {
    const body = await request.json() as { token: string; newPassword: string }
    const nestRes = await fetch(`${API_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await nestRes.json()
    return NextResponse.json(data, { status: nestRes.status })
  } catch {
    return NextResponse.json(
      { message: 'Sunucuya bağlanılamadı. Lütfen tekrar deneyin.' },
      { status: 503 }
    )
  }
}
