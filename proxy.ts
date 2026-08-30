import createIntlMiddleware from 'next-intl/middleware'
import { jwtVerify } from 'jose'
import { NextResponse, type NextRequest } from 'next/server'
import { routing } from './i18n/routing'

const handleI18nRouting = createIntlMiddleware(routing)

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET ?? '')

interface JwtPayload {
  sub: string
  email: string
  companyId: string
  role: string
  companyType: string
}

async function verifyToken(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as unknown as JwtPayload
  } catch {
    return null
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const localeMatch = pathname.match(/^\/(tr|en)(\/|$)/)
  const locale = localeMatch?.[1] ?? routing.defaultLocale
  const pathWithoutLocale = localeMatch
    ? pathname.slice(locale.length + 1) || '/'
    : pathname

  const accessToken = request.cookies.get('access_token')?.value
  const user = accessToken ? await verifyToken(accessToken) : null

  const isAuthPage =
    pathWithoutLocale === '/login' ||
    pathWithoutLocale === '/signup' ||
    pathWithoutLocale.startsWith('/login/') ||
    pathWithoutLocale.startsWith('/signup/')

  function redirect(url: string) {
    return NextResponse.redirect(new URL(url, request.url))
  }

  // Giriş yapılmamış → login
  if (!user && !isAuthPage) {
    return redirect(`/${locale}/login`)
  }

  // Giriş yapılmış → portal anasayfasına yönlendir
  if (user && isAuthPage) {
    const dest = user.companyType === 'seller'
      ? `/${locale}/seller/dashboard`
      : `/${locale}/buyer/discover`
    return redirect(dest)
  }

  if (user) {
    if (pathWithoutLocale.startsWith('/seller') && user.companyType !== 'seller') {
      return redirect(`/${locale}/buyer/discover`)
    }
    if (pathWithoutLocale.startsWith('/buyer') && user.companyType !== 'buyer') {
      return redirect(`/${locale}/seller/dashboard`)
    }
    if (pathWithoutLocale.startsWith('/buyer/approvals') && user.role !== 'admin') {
      return redirect(`/${locale}/buyer/orders`)
    }
  }

  return handleI18nRouting(request)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
}
