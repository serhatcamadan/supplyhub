import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_PATHS = ['/login', '/signup']

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public auth routes
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  // Read mock session cookie (will be replaced by Supabase session)
  const sessionCookie = request.cookies.get('mock-session')

  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  let session: { role: string; companyType: string } | null = null
  try {
    session = JSON.parse(sessionCookie.value) as { role: string; companyType: string }
  } catch {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Seller can only access /seller routes
  if (pathname.startsWith('/seller') && session.companyType !== 'seller') {
    return NextResponse.redirect(new URL('/buyer/discover', request.url))
  }

  // Buyer can only access /buyer routes
  if (pathname.startsWith('/buyer') && session.companyType !== 'buyer') {
    return NextResponse.redirect(new URL('/seller/dashboard', request.url))
  }

  // Approval page restricted to admin buyers
  if (pathname.startsWith('/buyer/approvals') && session.role !== 'admin') {
    return NextResponse.redirect(new URL('/buyer/orders', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
}
