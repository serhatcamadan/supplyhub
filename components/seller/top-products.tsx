'use client'

import { useTranslations } from 'next-intl'
import { formatCurrency } from '@/lib/utils'
import { IconPackage, IconTrendingUp } from '@tabler/icons-react'

export interface ProductSalesStat {
  id: string
  name: string
  category: string
  unitsSold: number
  revenue: number
}

interface TopProductsProps {
  products: ProductSalesStat[]
  topCategoryPct: number
  secondCategoryPct: number
  topCategoryName: string | null
  locale: string
}

export function TopProducts({ products, topCategoryPct, secondCategoryPct, topCategoryName, locale }: TopProductsProps) {
  const t = useTranslations('seller')

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm p-6 flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-on-surface">{t('dashboard.topProducts.heading')}</h3>
        <a href={`/${locale}/seller/products`} className="text-xs font-semibold text-primary hover:underline">
          {t('dashboard.topProducts.viewReport')}
        </a>
      </div>

      {products.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-8 gap-2">
          <IconTrendingUp size={28} className="text-outline-variant" />
          <p className="text-sm text-on-surface-variant">{t('dashboard.topProducts.empty')}</p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col gap-1">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex items-center gap-3 p-2 hover:bg-surface-container-high rounded-lg transition-colors"
            >
              <div className="w-11 h-11 rounded-lg bg-surface-container-low flex items-center justify-center shrink-0">
                <IconPackage size={22} className="text-primary-container" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-on-surface truncate">{product.name}</p>
                <p className="text-xs text-on-surface-variant">{product.category}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-mono text-xs font-semibold text-on-surface">
                  {product.unitsSold}{' '}
                  <span className="text-on-surface-variant font-normal">{t('dashboard.topProducts.units')}</span>
                </p>
                <p className="text-xs text-secondary">+{formatCurrency(product.revenue, locale)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Category donut */}
      <div className="mt-6 pt-6 border-t border-surface-container-high flex items-center justify-center gap-6">
        <div className="relative w-14 h-14 shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-surface-variant"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="text-primary"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeDasharray={`${topCategoryPct}, 100`}
              strokeWidth="4"
            />
            <path
              className="text-secondary"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeDasharray={`${secondCategoryPct}, 100`}
              strokeDashoffset={-topCategoryPct}
              strokeWidth="4"
            />
          </svg>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
            {t('dashboard.topProducts.topCategory')}
          </p>
          <p className="text-base font-semibold text-on-surface">
            {topCategoryName ?? '—'}{' '}
            {topCategoryName && (
              <span className="text-on-surface-variant text-xs font-normal">({topCategoryPct}%)</span>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}
