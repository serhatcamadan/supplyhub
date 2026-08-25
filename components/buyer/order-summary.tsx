'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'

interface OrderSummaryProps {
  subtotal: number
  volumeDiscount: number
  itemCount: number
  onCheckout: () => void
  onRequestQuote: () => void
  isCheckingOut?: boolean
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
  isCheckingOut = false,
}: OrderSummaryProps) {
  const t = useTranslations('buyer')
  const locale = useLocale()
  const [promo, setPromo] = useState('')
  const [applied, setApplied] = useState(false)

  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : 450
  const taxable = subtotal - volumeDiscount
  const tax = Math.round(taxable * TAX_RATE)
  const total = taxable + shipping + tax

  function handleApply() {
    if (promo.trim()) setApplied(true)
  }

  const TRUST_ITEMS = [
    { icon: 'lock',           label: t('cart.summary.trust.ssl') },
    { icon: 'verified_user',  label: t('cart.summary.trust.verified') },
    { icon: 'support_agent',  label: t('cart.summary.trust.support') },
  ]

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 pt-6 pb-4 border-b border-outline-variant/30">
        <h2 className="text-lg font-bold text-on-surface">{t('cart.summary.heading')}</h2>
        <p className="text-xs text-on-surface-variant mt-0.5">{t('cart.itemCount', { count: itemCount })}</p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
        <div className="space-y-3">
          <SummaryRow label={t('cart.summary.subtotal')} value={formatCurrency(subtotal, locale)} />
          {volumeDiscount > 0 && (
            <SummaryRow
              label={t('cart.summary.volumeDiscount')}
              value={`-${formatCurrency(volumeDiscount, locale)}`}
              highlight="discount"
            />
          )}
          <SummaryRow
            label={t('cart.summary.shipping')}
            value={shipping === 0 ? t('cart.summary.shippingFree') : formatCurrency(shipping, locale)}
            subtext={
              shipping > 0
                ? t('cart.summary.shippingNudge', { amount: formatCurrency(SHIPPING_THRESHOLD - subtotal, locale) })
                : undefined
            }
          />
          <SummaryRow
            label={t('cart.summary.tax', { rate: TAX_RATE * 100 })}
            value={formatCurrency(tax, locale)}
          />
        </div>

        <div className="border-t border-outline-variant/40 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-on-surface">{t('cart.summary.total')}</span>
            <span className="text-2xl font-bold text-primary">{formatCurrency(total, locale)}</span>
          </div>
          {volumeDiscount > 0 && (
            <p className="text-xs text-secondary text-right mt-1">
              {t('cart.summary.saved', { amount: formatCurrency(volumeDiscount, locale) })}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
            {t('cart.summary.promoLabel')}
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder={t('cart.summary.promoPlaceholder')}
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
              {applied ? t('cart.summary.promoApplied') : t('cart.summary.promoApply')}
            </Button>
          </div>
          {applied && (
            <p className="text-xs text-secondary font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>check_circle</span>
              {t('cart.summary.promoAppliedMsg')}
            </p>
          )}
        </div>

        <div className="space-y-3">
          <Button
            variant="secondary"
            size="lg"
            onClick={onCheckout}
            disabled={isCheckingOut}
            className="w-full"
            data-testid="checkout"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>shopping_bag</span>
            {isCheckingOut ? t('cart.summary.checkoutLoading') : t('cart.summary.checkout')}
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={onRequestQuote}
            className="w-full"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>request_quote</span>
            {t('cart.summary.requestQuote')}
          </Button>
        </div>

        <div className="pt-2 border-t border-outline-variant/30 space-y-2">
          {TRUST_ITEMS.map(({ icon, label }) => (
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
