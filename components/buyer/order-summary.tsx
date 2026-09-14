'use client'

import { useTranslations, useLocale } from 'next-intl'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import { IconFileInvoice, IconHeadset, IconLock, IconRosetteDiscountCheck, IconShoppingBag } from '@tabler/icons-react'
import type { ElementType } from 'react'

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

  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : 450
  const taxable = subtotal - volumeDiscount
  const tax = Math.round(taxable * TAX_RATE)
  const total = taxable + shipping + tax

  const TRUST_ITEMS: { icon: ElementType; label: string }[] = [
    { icon: IconLock,                  label: t('cart.summary.trust.ssl') },
    { icon: IconRosetteDiscountCheck,  label: t('cart.summary.trust.verified') },
    { icon: IconHeadset,               label: t('cart.summary.trust.support') },
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

        <div className="space-y-3">
          <Button
            variant="secondary"
            size="lg"
            onClick={onCheckout}
            disabled={isCheckingOut}
            className="w-full"
            data-testid="checkout"
          >
            <IconShoppingBag size={20} />
            {isCheckingOut ? t('cart.summary.checkoutLoading') : t('cart.summary.checkout')}
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={onRequestQuote}
            className="w-full"
          >
            <IconFileInvoice size={20} />
            {t('cart.summary.requestQuote')}
          </Button>
        </div>

        <div className="pt-2 border-t border-outline-variant/30 space-y-2">
          {TRUST_ITEMS.map(({ icon: TIcon, label }) => (
            <div key={label} className="flex items-center gap-2 text-on-surface-variant">
              <TIcon size={16} />
              <span className="text-xs">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
