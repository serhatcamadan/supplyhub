import { jwtVerify } from 'jose'

export interface VerifiedJwtPayload {
  sub: string
  email: string
  companyId: string
  role: string
  companyType: string
}

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET ?? '')

// Cryptographically verifies the access_token — unlike getServerUser() (lib/auth/server.ts),
// which only base64-decodes the payload without checking the signature. Layouts can rely on
// proxy.ts having already verified the token before the request arrives, but proxy.ts's
// matcher excludes /api/*, so any API route handler that gates a privileged action must
// verify the token itself with this function instead.
export async function verifyAccessToken(token: string): Promise<VerifiedJwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as unknown as VerifiedJwtPayload
  } catch {
    return null
  }
}
