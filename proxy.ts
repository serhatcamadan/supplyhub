import createIntlMiddleware from 'next-intl/middleware'
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { routing } from './i18n/routing'

const handleI18nRouting = createIntlMiddleware(routing)

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Extract locale prefix from URL (/tr/... or /en/...)
  const localeMatch = pathname.match(/^\/(tr|en)(\/|$)/)
  const locale = localeMatch?.[1] ?? routing.defaultLocale
  const pathWithoutLocale = localeMatch
    ? pathname.slice(locale.length + 1) || '/'
    : pathname

  // Supabase session refresh — must run on every request
  let supabaseResponse = NextResponse.next({ request })
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const isAuthPage =
    pathWithoutLocale === '/login' ||
    pathWithoutLocale === '/signup' ||
    pathWithoutLocale.startsWith('/login/') ||
    pathWithoutLocale.startsWith('/signup/')

  // Carry Supabase auth cookies into any redirect response
  function redirectWithCookies(url: string) {
    const res = NextResponse.redirect(new URL(url, request.url))
    supabaseResponse.cookies.getAll().forEach((c) => res.cookies.set(c.name, c.value))
    return res
  }

  // Unauthenticated → login
  if (!user && !isAuthPage) {
    return redirectWithCookies(`/${locale}/login`)
  }

  // Authenticated on auth page → portal home
  if (user && isAuthPage) {
    const companyType = user.user_metadata?.company_type as string | undefined
    const dest = companyType === 'seller'
      ? `/${locale}/seller/dashboard`
      : `/${locale}/buyer/discover`
    return redirectWithCookies(dest)
  }

  if (user) {
    const companyType = user.user_metadata?.company_type as string | undefined
    const role = user.user_metadata?.role as string | undefined

    if (pathWithoutLocale.startsWith('/seller') && companyType !== 'seller') {
      return redirectWithCookies(`/${locale}/buyer/discover`)
    }

    if (pathWithoutLocale.startsWith('/buyer') && companyType !== 'buyer') {
      return redirectWithCookies(`/${locale}/seller/dashboard`)
    }

    if (pathWithoutLocale.startsWith('/buyer/approvals') && role !== 'admin') {
      return redirectWithCookies(`/${locale}/buyer/orders`)
    }
  }

  // Locale routing: adds prefix if missing, normalises
  const i18nResponse = handleI18nRouting(request)

  // Merge Supabase auth cookies into the locale response
  supabaseResponse.cookies.getAll().forEach((c) =>
    i18nResponse.cookies.set(c.name, c.value)
  )

  return i18nResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
}
