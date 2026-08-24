'use client'

import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { SectionHeading } from '@/components/ui/section-heading'
import type { PriceTier } from '@/types'

interface ProductPricingTiersProps {
  tiers: PriceTier[]
  onAdd: () => void
  onRemove: (idx: number) => void
  onUpdateMax: (idx: number, value: number | null) => void
  onUpdatePrice: (idx: number, value: number) => void
}

const CELL = 'w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant/30 rounded font-mono text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary'

export function ProductPricingTiers({ tiers, onAdd, onRemove, onUpdateMax, onUpdatePrice }: ProductPricingTiersProps) {
  const t = useTranslations('seller')

  const displayTiers = tiers.map((tier, i) => ({
    ...tier,
    min_qty: i === 0 ? 1 : (tiers[i - 1].max_qty ?? 0) + 1,
  }))

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm p-8 border border-outline-variant/20">
      <div className="flex items-center justify-between mb-4">
        <SectionHeading icon="payments" label={t('products.pricing.heading')} className="mb-0" />
        <button type="button" onClick={onAdd} className="flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
          <span className="material-symbols-outlined text-[16px]">add</span>
          {t('products.pricing.addTier')}
        </button>
      </div>
      <p className="text-xs text-on-surface-variant mb-6">
        {t('products.pricing.hint')}
      </p>

      <div className="w-full border border-outline-variant/20 rounded-lg overflow-hidden">
        <div className="grid grid-cols-12 bg-surface-container-low px-4 py-3 border-b border-outline-variant/20 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
          <div className="col-span-4">{t('products.pricing.minQty')}</div>
          <div className="col-span-4">{t('products.pricing.maxQty')}</div>
          <div className="col-span-3 text-right">{t('products.pricing.unitPrice')}</div>
          <div className="col-span-1" />
        </div>

        {displayTiers.map((tier, idx) => {
          const isFirst = idx === 0
          const isLast = idx === displayTiers.length - 1
          return (
            <div
              key={idx}
              className={cn('grid grid-cols-12 items-center px-4 py-3 hover:bg-surface transition-colors', !isLast && 'border-b border-outline-variant/10')}
            >
              <div className="col-span-4 pr-4">
                <input type="number" readOnly value={tier.min_qty} className={CELL} />
              </div>

              <div className="col-span-4 pr-4">
                {isLast ? (
                  <input type="text" readOnly value="+" className="w-full px-3 py-2 bg-surface-container-low border border-transparent rounded font-mono text-sm text-on-surface-variant text-center" />
                ) : (
                  <input
                    type="number"
                    min={tier.min_qty + 1}
                    value={tier.max_qty ?? ''}
                    onChange={(e) => onUpdateMax(idx, e.target.value ? Number(e.target.value) : null)}
                    className={CELL}
                  />
                )}
              </div>

              <div className="col-span-3 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xs">₺</span>
                <input
                  type="number"
                  step="0.01"
                  min={0}
                  value={tier.price || ''}
                  onChange={(e) => onUpdatePrice(idx, Number(e.target.value))}
                  placeholder="0.00"
                  className={`${CELL} pl-7 text-right`}
                />
              </div>

              <div className="col-span-1 flex justify-end">
                <button
                  type="button"
                  onClick={() => onRemove(idx)}
                  disabled={isFirst}
                  className="p-1.5 text-outline hover:text-error hover:bg-error-container rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
