'use client'

import { useState } from 'react'
import { formatCurrency } from '@/lib/utils'
import { getUnitPrice, getTotalPrice, getNextTier } from '@/lib/pricing'
import { Button } from '@/components/ui/button'
import type { Product, PriceTier } from '@/types'

function TierRow({
  tier,
  isActive,
  baseTierPrice,
}: {
  tier: PriceTier
  isActive: boolean
  baseTierPrice: number
}) {
  const savingsPct =
    baseTierPrice > 0
      ? Math.round(((baseTierPrice - tier.price) / baseTierPrice) * 100)
      : 0
  const rangeLabel = tier.max_qty
    ? `${tier.min_qty} – ${tier.max_qty} adet`
    : `${tier.min_qty}+ adet`

  return (
    <div
      className={`flex justify-between items-center px-4 py-3 transition-colors ${
        isActive ? 'bg-surface-container-low' : 'hover:bg-surface-container-high'
      }`}
    >
      <span className="text-sm text-on-surface">{rangeLabel}</span>
      <div className="text-right">
        <span className="text-sm font-semibold text-on-surface">
          {formatCurrency(tier.price)}{' '}
          <span className="text-xs font-normal text-on-surface-variant">/adet</span>
        </span>
        {savingsPct > 0 && (
          <p className="text-xs text-secondary">%{savingsPct} indirim</p>
        )}
      </div>
    </div>
  )
}

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
  const [qty, setQty] = useState(product.min_order_qty)

  const sortedTiers = [...product.price_tiers].sort((a, b) => a.min_qty - b.min_qty)
  const baseTierPrice = sortedTiers[0]?.price ?? 0
  const unitPrice = getUnitPrice(qty, product.price_tiers)
  const totalPrice = getTotalPrice(qty, product.price_tiers)
  const nextTier = getNextTier(qty, product.price_tiers)

  const activeIndex = sortedTiers.findIndex(
    (t) => qty >= t.min_qty && (t.max_qty === null || qty <= t.max_qty)
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

      {/* Category badge + rating */}
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

      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-on-surface leading-tight">{product.name}</h1>
        <p className="text-sm text-on-surface-variant mt-1">
          Min. {product.min_order_qty} adet · {sellerName}
        </p>
      </div>

      {/* Price */}
      <div className="pt-4 border-t border-outline-variant/30">
        <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest mb-1">
          Liste Fiyatı
        </p>
        <div className="flex items-end gap-2">
          <span className="text-4xl font-bold text-on-surface">{formatCurrency(displayPrice)}</span>
          <span className="text-sm text-on-surface-variant mb-1.5">/ adet</span>
        </div>
        {totalPrice && (
          <p className="text-sm text-on-surface-variant mt-1">
            Toplam:{' '}
            <span className="font-semibold text-on-surface">{formatCurrency(totalPrice)}</span>
          </p>
        )}
        <p className="text-xs text-secondary mt-2 flex items-center gap-1">
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>inventory_2</span>
          Stokta mevcut
        </p>
      </div>

      {/* Volume discounts */}
      <div className="bg-surface-container-lowest rounded-lg overflow-hidden shadow-sm border border-outline-variant/20">
        <div className="bg-primary-container/10 px-4 py-2 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary" style={{ fontSize: '18px' }}>sell</span>
          <span className="text-sm font-semibold text-primary">Toplu Alım İndirimleri</span>
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

      {/* Next tier nudge */}
      {nextTier && (
        <div className="flex items-center gap-2 px-3 py-2 bg-secondary/5 rounded-lg border border-secondary/20 text-xs text-secondary">
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>trending_down</span>
          <span>
            <strong>{nextTier.min_qty - qty} adet</strong> daha ekleyin →{' '}
            <strong>{formatCurrency(nextTier.price)}/adet</strong>
          </span>
        </div>
      )}

      {/* Quantity + CTA */}
      <div className="pt-4 border-t border-outline-variant/30 flex flex-col gap-4">
        <div>
          <label className="block text-sm font-semibold text-on-surface mb-2">Miktar</label>
          <div className="flex items-center w-36 border border-outline-variant rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-all bg-surface-container-lowest shadow-sm">
            <button
              onClick={decrement}
              aria-label="Azalt"
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
              aria-label="Artır"
              className="px-3 py-2 text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors border-l border-outline-variant/30"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add</span>
            </button>
          </div>
          <p className="text-xs text-on-surface-variant mt-1">Min. {product.min_order_qty} adet</p>
        </div>

        <div className="flex flex-col gap-3">
          <Button variant="primary" size="lg" className="w-full justify-center">
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add_shopping_cart</span>
            Sepete Ekle
          </Button>
          <Button variant="outline" size="lg" className="w-full justify-center text-primary">
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>request_quote</span>
            Özel Teklif İste
          </Button>
        </div>

        <p className="text-xs text-on-surface-variant text-center flex items-center justify-center gap-1">
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>local_shipping</span>
          500₺ üzeri siparişlerde ücretsiz kargo · 24 saat içinde kargoda
        </p>
      </div>
    </div>
  )
}
