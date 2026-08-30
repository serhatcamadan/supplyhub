import { cookies } from 'next/headers'

interface JwtPayload {
  sub: string
  email: string
  name: string
  companyId: string
  role: string
  companyType: string
  iat?: number
  exp?: number
}

export async function getServerUser(): Promise<JwtPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value
  if (!token) return null

  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf-8')) as JwtPayload
    if (payload.exp && payload.exp * 1000 < Date.now()) return null
    return payload
  } catch {
    return null
  }
}
