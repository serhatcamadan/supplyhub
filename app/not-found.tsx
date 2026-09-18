import { Inter } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import { NotFoundContent } from '@/components/shared/not-found-content'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

// Renders whenever no route matches at all (typo'd URL, unknown sub-path) and
// also when app/[locale]/layout.tsx itself throws notFound() for a malformed
// locale segment. Both cases land above [locale]/layout.tsx, so this boundary
// has to supply its own <html>/<body> and its own next-intl provider — next-intl
// still resolves a sensible locale (falls back to the default) even here.
export default async function RootNotFound() {
  const [locale, messages] = await Promise.all([getLocale(), getMessages()])

  return (
    <html lang={locale} className={`${inter.className} h-full antialiased`}>
      <body className="min-h-full bg-surface">
        <NextIntlClientProvider messages={messages}>
          <NotFoundContent />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
