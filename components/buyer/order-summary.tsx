'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'

interface OrderSummaryProps {
  subtotal: number
  volumeDiscount: number
  itemCount: number
  onCheckout: () => void
  onRequestQuote: () => void
}

const TAX_RATE = 0.20
const SHIPPING_THRESHOLD = 10_000

function SummaryRow({
  label,
  value,
  subtext,
  highlight,
}: {
  label: string
  value: string
  subtext?: string
  highlight?: 'discount' | 'neutral'
}) {
  return (
    <div className="flex justify-between items-baseline">
      <div>
        <span className="text-sm text-on-surface-variant">{label}</span>
        {subtext && <p className="text-xs text-on-surface-variant/60 mt-0.5">{subtext}</p>}
      </div>
      <span
        className={`text-sm font-semibold ${
          highlight === 'discount' ? 'text-secondary' : 'text-on-surface'
        }`}
      >
        {value}
      </span>
    </div>
  )
}

export function OrderSummary({
  subtotal,
  volumeDiscount,
  itemCount,
  onCheckout,
  onRequestQuote,
}: OrderSummaryProps) {
  const [promo, setPromo] = useState('')
  const [applied, setApplied] = useState(false)

  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : 450
  const taxable = subtotal - volumeDiscount
  const tax = Math.round(taxable * TAX_RATE)
  const total = taxable + shipping + tax

  function handleApply() {
    if (promo.trim()) setApplied(true)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-outline-variant/30">
        <h2 className="text-lg font-bold text-on-surface">Sipariş Özeti</h2>
        <p className="text-xs text-on-surface-variant mt-0.5">{itemCount} ürün türü</p>
      </div>

      {/* Cost breakdown */}
      <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
        <div className="space-y-3">
          <SummaryRow label="Ara Toplam" value={formatCurrency(subtotal)} />
          {volumeDiscount > 0 && (
            <SummaryRow
              label="Hacim İndirimi"
              value={`-${formatCurrency(volumeDiscount)}`}
              highlight="discount"
            />
          )}
          <SummaryRow
            label="Kargo"
            value={shipping === 0 ? 'Ücretsiz' : formatCurrency(shipping)}
            subtext={shipping > 0 ? `${formatCurrency(SHIPPING_THRESHOLD - subtotal)} daha ekleyin, kargo ücretsiz` : undefined}
          />
          <SummaryRow
            label={`KDV (%${TAX_RATE * 100})`}
            value={formatCurrency(tax)}
          />
        </div>

        {/* Divider + Total */}
        <div className="border-t border-outline-variant/40 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-on-surface">Toplam Tutar</span>
            <span className="text-2xl font-bold text-primary">{formatCurrency(total)}</span>
          </div>
          {volumeDiscount > 0 && (
            <p className="text-xs text-secondary text-right mt-1">
              {formatCurrency(volumeDiscount)} tasarruf ettiniz
            </p>
          )}
        </div>

        {/* Promo / PO Number */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
            Promosyon Kodu / Sipariş No
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="PROMO veya PO-XXXX"
              value={promo}
              onChange={(e) => { setPromo(e.target.value); setApplied(false) }}
              className="flex-1 bg-surface-container rounded-lg px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/50 border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/60"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleApply}
              disabled={!promo.trim() || applied}
              className="shrink-0"
            >
              {applied ? 'Uygulandı' : 'Uygula'}
            </Button>
          </div>
          {applied && (
            <p className="text-xs text-secondary font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>check_circle</span>
              Kod uygulandı
            </p>
          )}
        </div>

        {/* CTA buttons */}
        <div className="space-y-3">
          <Button
            variant="secondary"
            size="lg"
            onClick={onCheckout}
            className="w-full"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>shopping_bag</span>
            Siparişi Tamamla
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={onRequestQuote}
            className="w-full"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>request_quote</span>
            Resmi Teklif Talep Et
          </Button>
        </div>

        {/* Trust indicators */}
        <div className="pt-2 border-t border-outline-variant/30 space-y-2">
          {[
            { icon: 'lock', label: 'SSL korumalı ödeme' },
            { icon: 'verified_user', label: 'Doğrulanmış tedarikçiler' },
            { icon: 'support_agent', label: 'B2B destek hattı' },
          ].map(({ icon, label }) => (
            <div key={icon} className="flex items-center gap-2 text-on-surface-variant">
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>{icon}</span>
              <span className="text-xs">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
