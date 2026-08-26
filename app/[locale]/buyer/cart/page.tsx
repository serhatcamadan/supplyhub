'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { CartItemCard, type CartItem } from '@/components/buyer/cart-item'
import { OrderSummary } from '@/components/buyer/order-summary'
import { CartPromoBanner } from '@/components/buyer/cart-promo-banner'
import { IconBookmarkPlus, IconCompass, IconShoppingCart, IconTrashX } from '@tabler/icons-react'

const TAX_RATE = 0.20
const SHIPPING_THRESHOLD = 10_000
const SHIPPING_COST = 450
const APPROVAL_THRESHOLD = 50_000

const INITIAL_ITEMS: CartItem[] = [
  {
    id: 'ci-1',
    name: 'Organik Zeytinyağı (5L)',
    sku: 'ZT-001',
    supplierName: 'FreshFarm Gıda A.Ş.',
    imageUrl: null,
    qty: 100,
    unitPrice: 165,
    originalUnitPrice: 185,
    tierLabel: 'Tier 2 (min 50 adet — %11 indirim uygulandı)',
    stockStatus: 'in_stock',
    tierPct: 72,
    minQty: 10,
  },
  {
    id: 'ci-2',
    name: 'Tam Buğday Unu (25kg)',
    sku: 'UN-025',
    supplierName: 'FreshFarm Gıda A.Ş.',
    imageUrl: null,
    qty: 20,
    unitPrice: 42,
    originalUnitPrice: 42,
    tierLabel: null,
    stockStatus: 'low_stock',
    tierPct: 8,
    minQty: 20,
  },
]

export default function BuyerCartPage() {
  const router = useRouter()
  const t = useTranslations('buyer')
  const locale = useLocale()
  const [items, setItems] = useState<CartItem[]>(INITIAL_ITEMS)
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)

  useEffect(() => {
    async function enrich() {
      const supabase = createClient()
      const { data: products } = await supabase
        .from('products')
        .select('id, seller_id')
        .eq('status', 'active')
        .limit(2)
      if (!products || products.length === 0) return
      setItems((prev) =>
        prev.map((item, i) =>
          products[i] ? { ...item, productId: products[i].id, sellerId: products[i].seller_id } : item
        )
      )
    }
    enrich()
  }, [])

  function handleQtyChange(id: string, qty: number) {
    setItems((prev) => prev.map((item) => item.id === id ? { ...item, qty } : item))
  }

  function handleRemove(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  function handleClearCart() {
    setItems([])
  }

  async function handleCheckout() {
    setIsCheckingOut(true)
    setCheckoutError(null)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setIsCheckingOut(false); return }

    const companyId = user.user_metadata?.company_id as string
    const role = user.user_metadata?.role as string
    const sellerId = items.find((i) => i.sellerId)?.sellerId

    if (!sellerId) {
      setCheckoutError(t('cart.checkoutError.noSeller'))
      setIsCheckingOut(false)
      return
    }

    const taxable = subtotal - volumeDiscount
    const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
    const tax = Math.round(taxable * TAX_RATE)
    const grandTotal = taxable + shipping + tax
    const needsApproval = role === 'staff' && grandTotal > APPROVAL_THRESHOLD

    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .insert({
        buyer_id: companyId,
        seller_id: sellerId,
        status: 'pending',
        total: grandTotal,
        needs_approval: needsApproval,
        created_by: user.id,
      })
      .select('id')
      .single()

    if (orderErr || !order) {
      setCheckoutError(orderErr?.message ?? t('cart.checkoutError.orderFailed'))
      setIsCheckingOut(false)
      return
    }

    const orderItems = items
      .filter((i) => i.productId)
      .map((i) => ({
        order_id: order.id,
        product_id: i.productId!,
        quantity: i.qty,
        unit_price: i.unitPrice,
      }))

    if (orderItems.length > 0) {
      await supabase.from('order_items').insert(orderItems)
    }

    router.push(`/${locale}/buyer/orders`)
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
                onClick={handleClearCart}
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
                    onQtyChange={handleQtyChange}
                    onRemove={handleRemove}
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
