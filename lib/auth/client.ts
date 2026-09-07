interface JwtPayload {
  sub: string
  email: string
  name: string
  companyId: string
  role: string
  companyType: string
  exp?: number
}

export function getCurrentUserFromCookie(): JwtPayload | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(/(?:^|;\s*)access_token=([^;]*)/)
  const token = match?.[1]
  if (!token) return null

  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const json = new TextDecoder().decode(Uint8Array.from(atob(base64), (c) => c.charCodeAt(0)))
    const payload = JSON.parse(json) as JwtPayload
    if (payload.exp && payload.exp * 1000 < Date.now()) return null
    return payload
  } catch {
    return null
  }
}
