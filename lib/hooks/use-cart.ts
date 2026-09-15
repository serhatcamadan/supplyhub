'use client'

import { useState, useEffect } from 'react'
import { getUnitPrice } from '@/lib/pricing'
import { getStockBucket } from '@/lib/utils'
import type { Product } from '@/types'
import type { CartItem } from '@/components/buyer/cart-item'

export type StoredItem = {
  productId: string
  sellerId: string
  name: string
  imageUrl: string | null
  supplierName: string
  qty: number
  minQty: number
  priceTiers: Product['price_tiers']
  stockQuantity?: number
}

function toCartItem(s: StoredItem): CartItem {
  const sorted = [...s.priceTiers].sort((a, b) => a.min_qty - b.min_qty)
  const basePrice = sorted[0]?.price ?? 0
  const unitPrice = getUnitPrice(s.qty, s.priceTiers) ?? basePrice

  const activeIdx = sorted.findIndex(
    (t) => s.qty >= t.min_qty && (t.max_qty === null || s.qty <= t.max_qty)
  )
  const activeTier = sorted[activeIdx]
  const nextTier = sorted[activeIdx + 1]

  let tierPct = 100
  if (activeTier && nextTier) {
    const range = nextTier.min_qty - activeTier.min_qty
    tierPct = range > 0
      ? Math.round(((s.qty - activeTier.min_qty) / range) * 100)
      : 100
  }

  const discountPct =
    basePrice > 0 && activeTier && activeIdx > 0
      ? Math.round(((basePrice - activeTier.price) / basePrice) * 100)
      : 0

  const hasDiscountTier = activeIdx > 0 && !!activeTier
  const tierNumber = hasDiscountTier ? activeIdx + 1 : null
  const tierMinQty = hasDiscountTier ? activeTier.min_qty : null
  const tierDiscountPct = hasDiscountTier ? discountPct : null

  const sku = s.name
    .split(/\s+/)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
    .slice(0, 3) + '-' + s.productId.slice(-4).toUpperCase()

  return {
    id: s.productId,
    productId: s.productId,
    sellerId: s.sellerId,
    name: s.name,
    sku,
    supplierName: s.supplierName,
    imageUrl: s.imageUrl,
    qty: s.qty,
    unitPrice,
    originalUnitPrice: basePrice,
    tierNumber,
    tierMinQty,
    tierDiscountPct,
    stockStatus: getStockBucket(s.stockQuantity ?? Infinity),
    tierPct: Math.min(100, Math.max(0, tierPct)),
    minQty: s.minQty,
    nextTierMinQty: nextTier ? nextTier.min_qty : null,
    nextTierNumber: nextTier ? activeIdx + 2 : null,
    stockQuantity: s.stockQuantity ?? null,
  }
}

const STORAGE_KEY = 'supplyhub_cart'

function readStorage(): StoredItem[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  } catch {
    return []
  }
}

function writeStorage(items: StoredItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {}
}

export function useCart() {
  const [stored, setStored] = useState<StoredItem[]>([])

  useEffect(() => {
    // Deliberately deferred: localStorage is unavailable during SSR, so state
    // starts empty and is populated post-hydration to avoid a markup mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStored(readStorage())
  }, [])

  function persist(items: StoredItem[]) {
    setStored(items)
    writeStorage(items)
  }

  function addItem(product: Product, qty: number, supplierName: string) {
    const current = readStorage()
    const idx = current.findIndex((i) => i.productId === product.id)
    if (idx >= 0) {
      current[idx] = { ...current[idx], qty, stockQuantity: product.stock_quantity }
    } else {
      current.push({
        productId: product.id,
        sellerId: product.seller_id,
        name: product.name,
        imageUrl: product.image_url,
        supplierName,
        qty,
        minQty: product.min_order_qty,
        priceTiers: product.price_tiers,
        stockQuantity: product.stock_quantity,
      })
    }
    persist(current)
  }

  function removeItem(productId: string) {
    persist(stored.filter((i) => i.productId !== productId))
  }

  function updateQty(productId: string, qty: number) {
    persist(stored.map((i) => (i.productId === productId ? { ...i, qty } : i)))
  }

  function clearCart() {
    persist([])
  }

  function replaceCart(items: StoredItem[]) {
    persist(items)
  }

  const items: CartItem[] = stored.map(toCartItem)
  const count = stored.reduce((sum, i) => sum + i.qty, 0)

  return { items, storedItems: stored, count, addItem, removeItem, updateQty, clearCart, replaceCart }
}
