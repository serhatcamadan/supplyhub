'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { createOrder } from '@/lib/api/orders'
import { useCart } from '@/lib/hooks/use-cart'
import { CartItemCard } from '@/components/buyer/cart-item'
import { OrderSummary } from '@/components/buyer/order-summary'
import { CartPromoBanner } from '@/components/buyer/cart-promo-banner'
import { IconBookmarkPlus, IconCompass, IconShoppingCart, IconTrashX } from '@tabler/icons-react'

const TAX_RATE = 0.20
const SHIPPING_THRESHOLD = 10_000
const SHIPPING_COST = 450

export default function BuyerCartPage() {
  const router = useRouter()
  const t = useTranslations('buyer')
  const locale = useLocale()
  const { items, updateQty, removeItem, clearCart } = useCart()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)

  async function handleCheckout() {
    setIsCheckingOut(true)
    setCheckoutError(null)

    const sellerId = items.find((i) => i.sellerId)?.sellerId
    if (!sellerId) {
      setCheckoutError(t('cart.checkoutError.noSeller'))
      setIsCheckingOut(false)
      return
    }

    const orderItems = items
      .filter((i) => i.productId)
      .map((i) => ({ productId: i.productId!, quantity: i.qty }))

    try {
      await createOrder({ sellerId, items: orderItems })
      clearCart()
      router.push(`/${locale}/buyer/orders`)
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : t('cart.checkoutError.orderFailed'))
      setIsCheckingOut(false)
    }
  }

  const subtotal = items.reduce((sum, item) => sum + item.originalUnitPrice * item.qty, 0)
  const volumeDiscount = items.reduce(
    (sum, item) => sum + (item.originalUnitPrice - item.unitPrice) * item.qty,
    0
  )

  const nuggingItem = items.find((item) => item.tierPct < 50)

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)]">

      <div className="flex-1 overflow-y-auto px-4 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-6">

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-on-surface">{t('cart.heading')}</h1>
              <p className="text-sm text-on-surface-variant mt-0.5">{t('cart.itemCount', { count: items.length })}</p>
            </div>
            {items.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearCart}
                className="text-error hover:bg-error/10 hover:text-error"
              >
                <IconTrashX size={18} />
                {t('cart.clearCart')}
              </Button>
            )}
          </div>

          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
              <div className="w-24 h-24 rounded-full bg-surface-container flex items-center justify-center">
                <IconShoppingCart size={48} className="text-on-surface-variant/40" />
              </div>
              <div>
                <p className="text-lg font-semibold text-on-surface">{t('cart.empty.heading')}</p>
                <p className="text-sm text-on-surface-variant mt-1">{t('cart.empty.subtext')}</p>
              </div>
              <Link
                href={`/${locale}/buyer/discover`}
                className="inline-flex items-center gap-2 font-semibold text-sm bg-primary text-on-primary px-6 py-3 rounded-xl hover:bg-primary-container transition-colors shadow-sm"
              >
                <IconCompass size={20} />
                {t('cart.empty.cta')}
              </Link>
            </div>
          ) : (
            <>
              {nuggingItem && <CartPromoBanner item={nuggingItem} locale={locale} />}

              <div className="space-y-4">
                {items.map((item) => (
                  <CartItemCard
                    key={item.id}
                    item={item}
                    onQtyChange={(id, qty) => updateQty(id, qty)}
                    onRemove={(id) => removeItem(id)}
                  />
                ))}
              </div>

              <div className="flex items-center justify-center pt-2">
                <button className="flex items-center gap-1.5 text-sm text-on-surface-variant hover:text-primary transition-colors">
                  <IconBookmarkPlus size={18} />
                  {t('cart.saveAsTemplate')}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="w-full lg:w-96 bg-surface-container-lowest border-t lg:border-t-0 lg:border-l border-outline-variant/30 shadow-xl flex flex-col shrink-0 overflow-y-auto">
        {checkoutError && (
          <p className="px-6 pt-4 text-sm text-error">{checkoutError}</p>
        )}
        <OrderSummary
          subtotal={subtotal}
          volumeDiscount={volumeDiscount}
          itemCount={items.length}
          onCheckout={handleCheckout}
          isCheckingOut={isCheckingOut}
          onRequestQuote={() => router.push(`/${locale}/buyer/quotes/new`)}
        />
      </div>
    </div>
  )
}
