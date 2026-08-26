'use client'

import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { formatCurrency } from '@/lib/utils'
import type { Product } from '@/types'
import { IconBuildingStore, IconPhoto, IconHeart, IconHeartFilled, IconStarFilled } from '@tabler/icons-react'

export type ProductBadge = {
  label: string
  colorScheme: 'secondary' | 'primary'
}

interface ProductCardProps {
  product: Product
  locale?: string
  sellerName: string
  rating: number
  unit?: string
  badge?: ProductBadge
  favorited?: boolean
}

const BADGE_CLASS: Record<ProductBadge['colorScheme'], string> = {
  secondary: 'bg-secondary-container text-on-secondary-container',
  primary:   'bg-primary-container text-on-primary-container',
}

export function ProductCard({
  product,
  sellerName,
  rating,
  unit,
  badge,
  favorited = false,
}: ProductCardProps) {
  const t = useTranslations('buyer')
  const locale = useLocale()
  const fromPrice = product.price_tiers[0]?.price ?? 0

  return (
    <div className="group bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col relative">

      {badge && (
        <div className="absolute top-4 left-4 z-10">
          <span className={`${BADGE_CLASS[badge.colorScheme]} px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider shadow-sm`}>
            {badge.label}
          </span>
        </div>
      )}

      <button
        className={`absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-surface/80 backdrop-blur-sm rounded-full transition-colors shadow-sm ${
          favorited ? 'text-error' : 'text-on-surface-variant hover:text-error'
        }`}
        aria-label={t('productCard.favoriteLabel')}
      >
        {favorited ? <IconHeartFilled size={18} /> : <IconHeart size={18} />}
      </button>

      <Link href={`/${locale}/buyer/discover/${product.id}`} className="flex flex-col flex-1">

        <div className="relative w-full h-52 bg-surface-container overflow-hidden">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <IconPhoto size={52} className="text-on-surface-variant/20" />
            </div>
          )}
        </div>

        <div className="p-5 flex flex-col flex-1 gap-4">
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <IconBuildingStore size={14} className="text-primary" />
              <span className="text-xs text-on-surface-variant line-clamp-1">{sellerName}</span>
            </div>
            <h3 className="text-sm font-semibold text-on-surface line-clamp-2 leading-5">{product.name}</h3>
          </div>

          <div className="mt-auto pt-3 border-t border-surface-container flex flex-col gap-2">
            <div className="flex items-baseline gap-1">
              <span className="text-xs text-on-surface-variant uppercase font-semibold tracking-wider">{t('productCard.from')}</span>
              <span className="text-xl font-bold text-primary">{formatCurrency(fromPrice)}</span>
              <span className="text-xs text-on-surface-variant">{unit ?? t('productCard.perUnit')}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-on-surface-variant bg-surface-container px-2 py-1 rounded-lg">
                {t('productCard.min')} {product.min_order_qty} {t('productCard.pieces')}
              </span>
              <div className="flex items-center gap-1">
                <IconStarFilled size={16} className="text-tertiary-container" />
                <span className="text-xs font-semibold text-on-surface">{rating.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}
