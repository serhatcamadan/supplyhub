'use client'

import { useTranslations } from 'next-intl'
import { formatCurrency } from '@/lib/utils'
import type { Company, Product } from '@/types'

interface RfqProductCardProps {
  product: Product
  seller: Company
}

export function RfqProductCard({ product, seller }: RfqProductCardProps) {
  const t = useTranslations('buyer')
  const listPrice = product.price_tiers[0]?.price ?? 0
  const sku = `PRD-${product.id.split('-')[1].padStart(3, '0')}`

  return (
    <div className="bg-surface-container-low rounded-xl p-4 flex gap-6 items-center shadow-sm">
      <div className="w-24 h-24 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0 shadow-sm">
        <span className="material-symbols-outlined text-primary text-[40px]">inventory_2</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-1">
          <span className="inline-block px-2 py-1 bg-surface-container-high text-on-surface-variant text-xs font-semibold rounded-md tracking-widest uppercase mb-2">
            SKU: {sku}
          </span>
          <span className="text-sm font-semibold text-secondary bg-secondary/10 px-3 py-1 rounded-full">
            {t('quotes.productCard.inStock')}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-on-surface truncate mb-1">{product.name}</h3>
        <p className="text-sm text-on-surface-variant truncate">
          {t('quotes.productCard.manufacturedBy')}{' '}
          <span className="font-medium text-primary">{seller.name}</span>
        </p>
        <p className="text-xs text-on-surface-variant mt-1">
          {t('quotes.productCard.listPrice', {
            price: formatCurrency(listPrice),
            qty: product.min_order_qty,
          })}
        </p>
      </div>
    </div>
  )
}
