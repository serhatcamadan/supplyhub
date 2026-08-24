'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { formatCurrency } from '@/lib/utils'
import { getUnitPrice, getTotalPrice, getNextTier } from '@/lib/pricing'
import { Button } from '@/components/ui/button'
import { TierRow } from '@/components/buyer/tier-row'
import type { Product } from '@/types'

interface ProductOrderPanelProps {
  product: Product
  sellerName: string
  rating?: number
}

export function ProductOrderPanel({
  product,
  sellerName,
  rating = 4.8,
}: ProductOrderPanelProps) {
  const t = useTranslations('buyer')
  const [qty, setQty] = useState(product.min_order_qty)

  const sortedTiers = [...product.price_tiers].sort((a, b) => a.min_qty - b.min_qty)
  const baseTierPrice = sortedTiers[0]?.price ?? 0
  const unitPrice = getUnitPrice(qty, product.price_tiers)
  const totalPrice = getTotalPrice(qty, product.price_tiers)
  const nextTier = getNextTier(qty, product.price_tiers)

  const activeIndex = sortedTiers.findIndex(
    (tier) => qty >= tier.min_qty && (tier.max_qty === null || qty <= tier.max_qty)
  )

  function decrement() {
    setQty((q) => Math.max(product.min_order_qty, q - 1))
  }
  function increment() {
    setQty((q) => q + 1)
  }
  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    setQty(Math.max(product.min_order_qty, Number(e.target.value) || product.min_order_qty))
  }

  const displayPrice = unitPrice ?? baseTierPrice

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-md p-6 flex flex-col gap-6">

      <div className="flex justify-between items-start">
        <span className="inline-flex items-center px-2 py-1 bg-surface-container-high text-on-surface-variant text-xs font-semibold rounded-md uppercase tracking-wider">
          {product.category}
        </span>
        <div className="flex items-center gap-1">
          <span
            className="material-symbols-outlined text-tertiary-container"
            style={{ fontSize: '16px', fontVariationSettings: "'FILL' 1" }}
          >
            star
          </span>
          <span className="text-sm font-semibold text-on-surface">{rating.toFixed(1)}</span>
          <span className="text-xs text-on-surface-variant ml-0.5">(24)</span>
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-on-surface leading-tight">{product.name}</h1>
        <p className="text-sm text-on-surface-variant mt-1">
          {t('orderPanel.minUnitsWithSeller', { count: product.min_order_qty, seller: sellerName })}
        </p>
      </div>

      <div className="pt-4 border-t border-outline-variant/30">
        <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest mb-1">
          {t('orderPanel.listPrice')}
        </p>
        <div className="flex items-end gap-2">
          <span className="text-4xl font-bold text-on-surface">{formatCurrency(displayPrice)}</span>
          <span className="text-sm text-on-surface-variant mb-1.5">{t('orderPanel.perUnit')}</span>
        </div>
        {totalPrice && (
          <p className="text-sm text-on-surface-variant mt-1">
            {t('orderPanel.total')}{' '}
            <span className="font-semibold text-on-surface">{formatCurrency(totalPrice)}</span>
          </p>
        )}
        <p className="text-xs text-secondary mt-2 flex items-center gap-1">
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>inventory_2</span>
          {t('orderPanel.inStock')}
        </p>
      </div>

      <div className="bg-surface-container-lowest rounded-lg overflow-hidden shadow-sm border border-outline-variant/20">
        <div className="bg-primary-container/10 px-4 py-2 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary" style={{ fontSize: '18px' }}>sell</span>
          <span className="text-sm font-semibold text-primary">{t('orderPanel.bulkDiscount')}</span>
        </div>
        <div className="divide-y divide-outline-variant/20">
          {sortedTiers.map((tier, idx) => (
            <TierRow
              key={idx}
              tier={tier}
              isActive={idx === activeIndex}
              baseTierPrice={baseTierPrice}
            />
          ))}
        </div>
      </div>

      {nextTier && (
        <div className="flex items-center gap-2 px-3 py-2 bg-secondary/5 rounded-lg border border-secondary/20 text-xs text-secondary">
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>trending_down</span>
          <span>
            {t('orderPanel.nextTierHint', {
              count: nextTier.min_qty - qty,
              price: formatCurrency(nextTier.price),
            })}
          </span>
        </div>
      )}

      <div className="pt-4 border-t border-outline-variant/30 flex flex-col gap-4">
        <div>
          <label className="block text-sm font-semibold text-on-surface mb-2">{t('orderPanel.quantity')}</label>
          <div className="flex items-center w-36 border border-outline-variant rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-all bg-surface-container-lowest shadow-sm">
            <button
              onClick={decrement}
              aria-label={t('orderPanel.decrement')}
              className="px-3 py-2 text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors border-r border-outline-variant/30"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>remove</span>
            </button>
            <input
              type="number"
              value={qty}
              min={product.min_order_qty}
              onChange={handleInput}
              className="w-full text-center bg-transparent border-none focus:outline-none text-sm font-semibold text-on-surface h-10 appearance-none"
            />
            <button
              onClick={increment}
              aria-label={t('orderPanel.increment')}
              className="px-3 py-2 text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors border-l border-outline-variant/30"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add</span>
            </button>
          </div>
          <p className="text-xs text-on-surface-variant mt-1">
            {t('orderPanel.minQuantity', { count: product.min_order_qty })}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Button variant="primary" size="lg" className="w-full justify-center">
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add_shopping_cart</span>
            {t('orderPanel.addToCart')}
          </Button>
          <Button variant="outline" size="lg" className="w-full justify-center text-primary">
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>request_quote</span>
            {t('orderPanel.requestQuote')}
          </Button>
        </div>

        <p className="text-xs text-on-surface-variant text-center flex items-center justify-center gap-1">
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>local_shipping</span>
          {t('orderPanel.freeShipping')}
        </p>
      </div>
    </div>
  )
}
