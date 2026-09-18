'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { getCurrentUserFromCookie } from '@/lib/auth/client'
import { Button, buttonVariants } from '@/components/ui/button'
import { GlobalSearch } from '@/components/shared/global-search'
import { IconAlertTriangle, IconLayoutGrid, IconRefresh } from '@tabler/icons-react'

interface ErrorContentProps {
  error: Error & { digest?: string }
  reset: () => void
}

export function ErrorContent({ error, reset }: ErrorContentProps) {
  const t = useTranslations('common')
  const locale = useLocale()
  const [portal, setPortal] = useState<'seller' | 'buyer' | null>(null)

  useEffect(() => {
    // JWT cookie is only readable client-side, so this can't run during SSR/first render
    const user = getCurrentUserFromCookie()
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPortal(user?.companyType === 'seller' ? 'seller' : user?.companyType === 'buyer' ? 'buyer' : null)
  }, [])

  useEffect(() => {
    console.error(error)
  }, [error])

  const homeHref =
    portal === 'seller'
      ? `/${locale}/seller/dashboard`
      : portal === 'buyer'
        ? `/${locale}/buyer/discover`
        : `/${locale}/login`

  return (
    <div className="relative min-h-screen bg-surface overflow-hidden flex items-center justify-center px-4 py-16">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-linear-to-br from-error-container/10 to-surface-container-low/20" />
      </div>

      <div className="relative z-10 w-full max-w-2xl flex flex-col items-center text-center gap-8">
        <Link href={`/${locale}`} className="text-2xl font-bold tracking-tight text-primary">
          SupplyHub
        </Link>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-error-container/30 text-error shadow-sm">
          <IconAlertTriangle size={16} />
          <span className="text-xs font-semibold uppercase tracking-wider">{t('errorPage.eyebrow')}</span>
        </div>

        <div>
          <h1 className="text-4xl font-bold tracking-tight text-on-surface mb-3 text-balance">
            {t('errorPage.heading')}
          </h1>
          <p className="text-base text-on-surface-variant max-w-xl mx-auto text-balance">
            {t('errorPage.description')}
          </p>
        </div>

        {portal && (
          <div className="w-full max-w-md">
            <GlobalSearch portal={portal} />
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button variant="primary" size="lg" onClick={reset}>
            <IconRefresh size={18} />
            {t('errorPage.tryAgain')}
          </Button>
          <Link href={homeHref} className={buttonVariants({ variant: 'outline', size: 'lg' })}>
            <IconLayoutGrid size={18} />
            {t('notFound.backToPanel')}
          </Link>
        </div>

        {error.digest && (
          <p className="text-xs font-mono text-on-surface-variant">
            {t('errorPage.errorRef')}: {error.digest}
          </p>
        )}
      </div>
    </div>
  )
}
