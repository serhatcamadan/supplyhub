'use client'

import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { buttonVariants } from '@/components/ui/button'

export function QuoteSentScreen() {
  const t = useTranslations('seller')
  const locale = useLocale()

  return (
    <div className="flex-1 flex flex-col bg-surface-container-lowest rounded-2xl shadow-xl overflow-hidden border border-outline-variant/20 items-center justify-center gap-5">
      <div className="w-20 h-20 rounded-full bg-secondary-container flex items-center justify-center">
        <span
          className="material-symbols-outlined text-secondary"
          style={{ fontSize: '40px', fontVariationSettings: "'FILL' 1" }}
        >
          check_circle
        </span>
      </div>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-on-surface">{t('quotes.sent.heading')}</h2>
        <p className="text-sm text-on-surface-variant mt-2 max-w-xs">
          {t('quotes.sent.description')}
        </p>
      </div>
      <Link href={`/${locale}/seller/quotes`} className={buttonVariants({ variant: 'primary' }) + ' mt-2'}>
        {t('quotes.sent.backToQuotes')}
      </Link>
    </div>
  )
}
