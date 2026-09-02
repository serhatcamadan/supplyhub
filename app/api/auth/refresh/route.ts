import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

const ACCESS_MAX_AGE = 15 * 60 // 15 minutes in seconds

export async function POST() {
  try {
    const cookieStore = await cookies()
    const refreshToken = cookieStore.get('refresh_token')?.value

    if (!refreshToken) {
      return NextResponse.json({ message: 'No refresh token' }, { status: 401 })
    }

    const nestRes = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { Cookie: `refresh_token=${refreshToken}` },
    })

    const data = await nestRes.json() as { access_token?: string }

    if (!nestRes.ok) {
      return NextResponse.json(data, { status: nestRes.status })
    }

    const response = NextResponse.json(data)

    // NestJS refresh returns the new token in the body (not as a Set-Cookie header).
    // Set it as a cookie here so server components pick it up on next render.
    if (data.access_token) {
      response.cookies.set('access_token', data.access_token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: ACCESS_MAX_AGE,
        path: '/',
      })
    }

    return response
  } catch {
    return NextResponse.json({ message: 'Sunucuya bağlanılamadı.' }, { status: 503 })
  }
}
