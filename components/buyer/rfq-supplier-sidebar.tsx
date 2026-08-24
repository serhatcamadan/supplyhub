'use client'

import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { Avatar } from '@/components/ui/avatar'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Company } from '@/types'

interface SupplierStat {
  label: string
  value: string
  accent?: boolean
}

interface RfqSupplierSidebarProps {
  seller: Company
  stats: SupplierStat[]
  rating?: string
  reviewCount?: number
}

export function RfqSupplierSidebar({
  seller,
  stats,
  rating = '4.8',
  reviewCount = 124,
}: RfqSupplierSidebarProps) {
  const t = useTranslations('buyer')
  const locale = useLocale()
  const fullStars = Math.floor(Number(rating))
  const hasHalf  = Number(rating) % 1 >= 0.5

  return (
    <div className="space-y-6">

      <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 p-6">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px]">storefront</span>
          {t('quotes.supplier.infoHeading')}
        </h3>

        <div className="flex items-start gap-4 mb-6">
          <Avatar name={seller.name} size="lg" colorScheme="primary" />
          <div>
            <h4 className="text-sm font-semibold text-on-surface mb-1">{seller.name}</h4>
            <div className="flex items-center gap-0.5 mb-1">
              {Array.from({ length: fullStars }, (_, i) => (
                <span
                  key={i}
                  className="material-symbols-outlined text-[15px] text-on-tertiary-container"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
              ))}
              {hasHalf && (
                <span className="material-symbols-outlined text-[15px] text-on-tertiary-container">
                  star_half
                </span>
              )}
              <span className="ml-1 text-xs font-medium text-on-surface-variant">
                {t('quotes.supplier.reviews', { rating, count: reviewCount })}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3 text-sm mb-5">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex justify-between border-b border-outline-variant/20 pb-2 last:border-0 last:pb-0"
            >
              <span className="text-on-surface-variant">{stat.label}</span>
              <span className={cn('font-semibold', stat.accent ? 'text-secondary' : 'text-on-surface')}>
                {stat.value}
              </span>
            </div>
          ))}
        </div>

        <Link
          href={`/${locale}/buyer/discover`}
          className={cn(buttonVariants({ variant: 'outline', size: 'md' }), 'w-full')}
        >
          <span className="material-symbols-outlined text-[18px]">person</span>
          {t('quotes.supplier.viewProfile')}
        </Link>
      </div>

      <div className="bg-primary text-on-primary rounded-2xl shadow-md p-6 relative overflow-hidden">
        <div className="absolute -right-8 -top-8 text-on-primary/10">
          <span
            className="material-symbols-outlined text-[120px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            verified_user
          </span>
        </div>
        <div className="relative z-10">
          <h3 className="text-sm font-semibold mb-2">{t('quotes.buyerProtection.heading')}</h3>
          <p className="text-xs text-on-primary/80 leading-relaxed mb-4">
            {t('quotes.buyerProtection.description')}
          </p>
          <a
            href="#"
            className="text-xs font-semibold text-secondary-fixed hover:text-secondary-fixed-dim underline underline-offset-2 transition-colors flex items-center gap-1 w-max"
          >
            {t('quotes.buyerProtection.learnMore')}
            <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
          </a>
        </div>
      </div>

    </div>
  )
}
