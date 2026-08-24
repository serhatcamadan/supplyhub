'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { formatCurrency } from '@/lib/utils'

interface StatCardsProps {
  totalRevenue: number
  pendingQuotesCount: number
  activeOrdersCount: number
  shippingCount: number
  processingCount: number
  activeProductsCount: number
  draftProductsCount: number
  locale: string
}

export function StatCards({
  totalRevenue,
  pendingQuotesCount,
  activeOrdersCount,
  shippingCount,
  processingCount,
  activeProductsCount,
  draftProductsCount,
  locale,
}: StatCardsProps) {
  const t = useTranslations('seller')
  const progressWidth =
    activeOrdersCount > 0 ? Math.round((shippingCount / activeOrdersCount) * 100) : 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

      {/* Revenue — sparkline */}
      <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow relative overflow-hidden">
        <div className="flex justify-between items-start mb-6 relative z-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
              {t('dashboard.stats.totalRevenue')}
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-on-surface mt-1">
              {formatCurrency(totalRevenue)}
            </h2>
          </div>
          <div className="p-2 bg-secondary-container/20 rounded-lg text-secondary shrink-0">
            <span className="material-symbols-outlined">payments</span>
          </div>
        </div>
        <div className="flex items-center gap-2 relative z-10">
          <span className="px-2 py-1 bg-secondary-container/30 text-secondary text-xs font-semibold rounded flex items-center gap-0.5">
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_upward</span>
            12%
          </span>
          <span className="text-xs text-on-surface-variant">{t('dashboard.stats.vsLastMonth')}</span>
        </div>
        <svg
          className="absolute bottom-0 left-0 w-full h-16 text-secondary-fixed opacity-20 group-hover:opacity-40 transition-opacity"
          preserveAspectRatio="none"
          viewBox="0 0 100 30"
        >
          <path
            d="M0,30 L0,25 L10,22 L20,26 L30,15 L40,18 L50,10 L60,15 L70,5 L80,12 L90,2 L100,8 L100,30 Z"
            fill="currentColor"
          />
          <path
            d="M0,25 L10,22 L20,26 L30,15 L40,18 L50,10 L60,15 L70,5 L80,12 L90,2 L100,8"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      {/* Pending Quotes */}
      <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
              {t('dashboard.stats.pendingQuotes')}
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-on-surface mt-1">
              {pendingQuotesCount}
            </h2>
          </div>
          <div className="p-2 bg-tertiary-container/20 rounded-lg text-on-tertiary-container shrink-0">
            <span className="material-symbols-outlined">request_quote</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-on-surface-variant">
            {t('dashboard.stats.immediateAction', { count: Math.min(pendingQuotesCount, 3) })}
          </span>
          <Link
            href={`/${locale}/seller/quotes`}
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-0.5 shrink-0 ml-2"
          >
            {t('dashboard.stats.viewAll')}
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
          </Link>
        </div>
      </div>

      {/* Active Orders */}
      <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
              {t('dashboard.stats.activeOrders')}
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-on-surface mt-1">
              {activeOrdersCount}
            </h2>
          </div>
          <div className="p-2 bg-primary-container/20 rounded-lg text-on-primary-container shrink-0">
            <span className="material-symbols-outlined">local_shipping</span>
          </div>
        </div>
        <div>
          <div className="w-full bg-surface-container-high rounded-full h-1.5">
            <div
              className="bg-primary h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${progressWidth}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-on-surface-variant">{t('dashboard.stats.shipping', { count: shippingCount })}</span>
            <span className="text-xs text-on-surface-variant">{t('dashboard.stats.processing', { count: processingCount })}</span>
          </div>
        </div>
      </div>

      {/* Total Products */}
      <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
              {t('dashboard.stats.totalProducts')}
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-on-surface mt-1">
              {activeProductsCount}
            </h2>
          </div>
          <div className="p-2 bg-surface-variant rounded-lg text-on-surface-variant shrink-0">
            <span className="material-symbols-outlined">inventory_2</span>
          </div>
        </div>
        <span className="px-2 py-1 bg-surface-variant text-on-surface-variant text-xs font-semibold rounded flex items-center gap-1 w-fit">
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>warning</span>
          {t('dashboard.stats.inDraft', { count: draftProductsCount })}
        </span>
      </div>

    </div>
  )
}
