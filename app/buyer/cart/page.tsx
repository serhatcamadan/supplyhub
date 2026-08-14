'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CartItemCard, type CartItem } from '@/components/buyer/cart-item'
import { OrderSummary } from '@/components/buyer/order-summary'

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

function PromoBanner({ item }: { item: CartItem }) {
  const toNextTier = Math.ceil(item.qty * 0.5)
  return (
    <div className="relative bg-surface-container rounded-xl px-5 py-4 overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-r from-primary/8 to-transparent pointer-events-none" />
      <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="material-symbols-outlined text-primary" style={{ fontSize: '22px' }}>
            local_offer
          </span>
          <div>
            <p className="text-sm font-semibold text-on-surface">Toplu İndirim Fırsatı</p>
            <p className="text-sm text-on-surface-variant mt-0.5">
              <span className="font-semibold text-primary">{item.name}</span> için{' '}
              <span className="font-semibold">{toNextTier} adet</span> daha ekleyerek Tier 3 fiyatına ulaşın.
            </p>
          </div>
        </div>
        <Link
          href={`/buyer/discover/${encodeURIComponent('product-1')}`}
          className="text-xs font-bold uppercase tracking-wider text-primary border border-primary/30 hover:bg-primary/5 transition-colors px-3 py-2 rounded-lg whitespace-nowrap"
        >
          Hemen Ekle
        </Link>
      </div>
    </div>
  )
}

export default function BuyerCartPage() {
  const [items, setItems] = useState<CartItem[]>(INITIAL_ITEMS)

  function handleQtyChange(id: string, qty: number) {
    setItems((prev) => prev.map((item) => item.id === id ? { ...item, qty } : item))
  }

  function handleRemove(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  function handleClearCart() {
    setItems([])
  }

  const subtotal = items.reduce((sum, item) => sum + item.originalUnitPrice * item.qty, 0)
  const volumeDiscount = items.reduce(
    (sum, item) => sum + (item.originalUnitPrice - item.unitPrice) * item.qty,
    0
  )

  const nuggingItem = items.find((item) => item.tierPct < 50)

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)]">

      {/* ── Left: scrollable cart area ── */}
      <div className="flex-1 overflow-y-auto px-4 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-6">

          {/* Page header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-on-surface">Alışveriş Sepeti</h1>
              <p className="text-sm text-on-surface-variant mt-0.5">{items.length} ürün türü</p>
            </div>
            {items.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearCart}
                className="text-error hover:bg-error/10 hover:text-error"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete_sweep</span>
                Sepeti Temizle
              </Button>
            )}
          </div>

          {items.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
              <div className="w-24 h-24 rounded-full bg-surface-container flex items-center justify-center">
                <span className="material-symbols-outlined text-on-surface-variant/40" style={{ fontSize: '48px' }}>
                  shopping_cart
                </span>
              </div>
              <div>
                <p className="text-lg font-semibold text-on-surface">Sepetiniz boş</p>
                <p className="text-sm text-on-surface-variant mt-1">
                  Tedarikçi ürünlerini keşfetmek için aşağıdaki butona tıklayın.
                </p>
              </div>
              <Link
                href="/buyer/discover"
                className="inline-flex items-center gap-2 font-semibold text-sm bg-primary text-on-primary px-6 py-3 rounded-xl hover:bg-primary-container transition-colors shadow-sm"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>explore</span>
                Ürünleri Keşfet
              </Link>
            </div>
          ) : (
            <>
              {/* Upsell banner */}
              {nuggingItem && <PromoBanner item={nuggingItem} />}

              {/* Cart items */}
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

              {/* Save as template link */}
              <div className="flex items-center justify-center pt-2">
                <button className="flex items-center gap-1.5 text-sm text-on-surface-variant hover:text-primary transition-colors">
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>bookmark_add</span>
                  Bu sepeti şablon olarak kaydet
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Right: fixed order summary sidebar ── */}
      <div className="w-full lg:w-96 bg-surface-container-lowest border-t lg:border-t-0 lg:border-l border-outline-variant/30 shadow-xl flex flex-col shrink-0 overflow-y-auto">
        <OrderSummary
          subtotal={subtotal}
          volumeDiscount={volumeDiscount}
          itemCount={items.length}
          onCheckout={() => alert('Ödeme akışı yakında ekleniyor…')}
          onRequestQuote={() => alert('Teklif talebi yakında ekleniyor…')}
        />
      </div>
    </div>
  )
}
