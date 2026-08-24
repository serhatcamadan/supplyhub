'use client'

import { useTranslations } from 'next-intl'
import { formatCurrency } from '@/lib/utils'
import type { Product } from '@/types'

interface TopProductsProps {
  products: Product[]
  locale: string
}

const MOCK_UNITS = [450, 320, 185]
const MOCK_REVENUE = [12000, 8500, 5200]

export function TopProducts({ products, locale }: TopProductsProps) {
  const t = useTranslations('seller')

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm p-6 flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-on-surface">{t('dashboard.topProducts.heading')}</h3>
        <a href={`/${locale}/seller/products`} className="text-xs font-semibold text-primary hover:underline">
          {t('dashboard.topProducts.viewReport')}
        </a>
      </div>

      <div className="flex-1 flex flex-col gap-1">
        {products.map((product, i) => (
          <div
            key={product.id}
            className="flex items-center gap-3 p-2 hover:bg-surface-container-high rounded-lg transition-colors cursor-pointer"
          >
            <div className="w-11 h-11 rounded-lg bg-surface-container-low flex items-center justify-center shrink-0">
              <span
                className="material-symbols-outlined text-primary-container"
                style={{ fontSize: '22px' }}
              >
                inventory_2
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-on-surface truncate">{product.name}</p>
              <p className="text-xs text-on-surface-variant">{product.category}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="font-mono text-xs font-semibold text-on-surface">
                {MOCK_UNITS[i]}{' '}
                <span className="text-on-surface-variant font-normal">{t('dashboard.topProducts.units')}</span>
              </p>
              <p className="text-xs text-secondary">+{formatCurrency(MOCK_REVENUE[i] ?? 0)}</p>
            </div>
          </div>
        ))}
      </div>

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
              strokeDasharray="60, 100"
              strokeWidth="4"
            />
            <path
              className="text-secondary"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeDasharray="25, 100"
              strokeDashoffset="-60"
              strokeWidth="4"
            />
          </svg>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
            {t('dashboard.topProducts.topCategory')}
          </p>
          <p className="text-base font-semibold text-on-surface">
            {products[0]?.category ?? '—'}{' '}
            <span className="text-on-surface-variant text-xs font-normal">(60%)</span>
          </p>
        </div>
      </div>
    </div>
  )
}
