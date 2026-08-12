import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
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

  // Session yenile — her zaman ilk çalıştırılmalı
  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup')

  // Giriş yapılmamış → login'e yönlendir
  if (!user && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Giriş yapılmış → auth sayfalarına izin verme
  if (user && isAuthPage) {
    const companyType = user.user_metadata?.company_type as string | undefined
    const dest = companyType === 'seller' ? '/seller/dashboard' : '/buyer/discover'
    return NextResponse.redirect(new URL(dest, request.url))
  }

  if (user) {
    const companyType = user.user_metadata?.company_type as string | undefined
    const role = user.user_metadata?.role as string | undefined

    // Satıcı portal koruması
    if (pathname.startsWith('/seller') && companyType !== 'seller') {
      return NextResponse.redirect(new URL('/buyer/discover', request.url))
    }

    // Alıcı portal koruması
    if (pathname.startsWith('/buyer') && companyType !== 'buyer') {
      return NextResponse.redirect(new URL('/seller/dashboard', request.url))
    }

    // Onay sayfası sadece admin
    if (pathname.startsWith('/buyer/approvals') && role !== 'admin') {
      return NextResponse.redirect(new URL('/buyer/orders', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
}
