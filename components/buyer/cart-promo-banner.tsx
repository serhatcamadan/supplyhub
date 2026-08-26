'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import type { CartItem } from '@/components/buyer/cart-item'
import { IconTag } from '@tabler/icons-react'

interface CartPromoBannerProps {
  item: CartItem
  locale: string
}

export function CartPromoBanner({ item, locale }: CartPromoBannerProps) {
  const t = useTranslations('buyer')
  const toNextTier = Math.ceil(item.qty * 0.5)

  return (
    <div className="relative bg-surface-container rounded-xl px-5 py-4 overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-r from-primary/8 to-transparent pointer-events-none" />
      <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-start gap-3">
          <IconTag size={22} className="text-primary" />
          <div>
            <p className="text-sm font-semibold text-on-surface">{t('cart.promo.heading')}</p>
            <p className="text-sm text-on-surface-variant mt-0.5">
              {t('cart.promo.subtext', { name: item.name, count: toNextTier })}
            </p>
          </div>
        </div>
        <Link
          href={`/${locale}/buyer/discover/${encodeURIComponent('product-1')}`}
          className="text-xs font-bold uppercase tracking-wider text-primary border border-primary/30 hover:bg-primary/5 transition-colors px-3 py-2 rounded-lg whitespace-nowrap"
        >
          {t('cart.promo.cta')}
        </Link>
      </div>
    </div>
  )
}
