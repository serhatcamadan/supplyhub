'use client'

import { useState } from 'react'
import { notFound } from 'next/navigation'
import { ShoppingCart, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react'
import { products, companies } from '@/lib/mock-data'
import { getUnitPrice, getTotalPrice, getNextTier } from '@/lib/pricing'
import { formatCurrency } from '@/lib/utils'

interface PageProps {
  params: { id: string }
}

export default function ProductDetailPage({ params }: PageProps) {
  const product = products.find((p) => p.id === params.id)
  if (!product) notFound()

  const seller = companies.find((c) => c.id === product.seller_id)!
  const [qty, setQty] = useState(product.min_order_qty)

  const unitPrice = getUnitPrice(qty, product.price_tiers)
  const totalPrice = getTotalPrice(qty, product.price_tiers)
  const nextTier = getNextTier(qty, product.price_tiers)

  const sortedTiers = [...product.price_tiers].sort((a, b) => a.min_qty - b.min_qty)
  const currentTierIndex = sortedTiers.findIndex(
    (t) => qty >= t.min_qty && (t.max_qty === null || qty <= t.max_qty)
  )

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-1">
        <span className="text-xs text-slate-400">{seller.name} · {product.category}</span>
      </div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">{product.name}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: description + tiers */}
        <div className="lg:col-span-2 space-y-5">
          {/* Image */}
          <div className="h-56 bg-slate-100 rounded-xl flex items-center justify-center">
            <span className="text-slate-400">Görsel yok</span>
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="text-sm font-semibold text-slate-700 mb-2">Ürün Açıklaması</h2>
            <p className="text-sm text-slate-600 leading-relaxed">{product.description}</p>
          </div>

          {/* Price tiers */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="text-sm font-semibold text-slate-700 mb-3">Kademeli Fiyatlandırma</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left py-2 text-xs text-slate-400 font-medium">Miktar</th>
                  <th className="text-right py-2 text-xs text-slate-400 font-medium">Birim Fiyat</th>
                  <th className="text-right py-2 text-xs text-slate-400 font-medium">Tasarruf</th>
                </tr>
              </thead>
              <tbody>
                {sortedTiers.map((tier, idx) => {
                  const isActive = idx === currentTierIndex
                  const baseTierPrice = sortedTiers[0]?.price ?? tier.price
                  const savings = baseTierPrice - tier.price
                  return (
                    <tr
                      key={idx}
                      className={`border-b border-slate-50 ${isActive ? 'bg-blue-50' : ''}`}
                    >
                      <td className={`py-2.5 ${isActive ? 'font-semibold text-[#1e3a5f]' : 'text-slate-600'}`}>
                        {tier.min_qty}
                        {tier.max_qty ? ` – ${tier.max_qty}` : '+'} adet
                        {isActive && (
                          <span className="ml-2 text-xs bg-[#1e3a5f] text-white px-1.5 py-0.5 rounded-full">
                            Seçili
                          </span>
                        )}
                      </td>
                      <td className={`py-2.5 text-right font-medium ${isActive ? 'text-[#1e3a5f]' : 'text-slate-900'}`}>
                        {formatCurrency(tier.price)}
                      </td>
                      <td className="py-2.5 text-right text-xs">
                        {savings > 0 ? (
                          <span className="text-green-600 font-medium">-{formatCurrency(savings)}</span>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: order box */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 sticky top-6">
            <div className="mb-4">
              {unitPrice ? (
                <>
                  <p className="text-3xl font-bold text-slate-900">{formatCurrency(unitPrice)}</p>
                  <p className="text-sm text-slate-400 mt-0.5">/ adet</p>
                  {totalPrice && (
                    <p className="text-sm font-medium text-slate-600 mt-2">
                      Toplam: {formatCurrency(totalPrice)}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-sm text-red-500">
                  Minimum {product.min_order_qty} adet sipariş verebilirsiniz.
                </p>
              )}
            </div>

            {/* Next tier nudge */}
            {nextTier && unitPrice && (
              <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-100">
                <p className="text-xs text-green-700">
                  <span className="font-semibold">{nextTier.min_qty - qty} adet</span> daha ekleyin
                  →{' '}
                  <span className="font-semibold">{formatCurrency(nextTier.price)}/adet</span>
                </p>
              </div>
            )}

            {/* Quantity control */}
            <div className="mb-4">
              <label className="text-xs font-medium text-slate-500 mb-1.5 block">Miktar</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQty(Math.max(product.min_order_qty, qty - 1))}
                  className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <ChevronDown size={16} />
                </button>
                <input
                  type="number"
                  value={qty}
                  min={product.min_order_qty}
                  onChange={(e) => setQty(Math.max(product.min_order_qty, Number(e.target.value)))}
                  className="flex-1 text-center px-3 py-2 rounded-lg border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
                />
                <button
                  onClick={() => setQty(qty + 1)}
                  className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <ChevronUp size={16} />
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-1">Min. {product.min_order_qty} adet</p>
            </div>

            <div className="space-y-2">
              <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#1e3a5f] text-white text-sm font-medium rounded-lg hover:bg-[#16304f] transition-colors">
                <ShoppingCart size={16} />
                Sepete Ekle
              </button>
              <button className="w-full flex items-center justify-center gap-2 py-2.5 border border-[#1e3a5f] text-[#1e3a5f] text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors">
                <MessageSquare size={16} />
                Özel Teklif İste
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
