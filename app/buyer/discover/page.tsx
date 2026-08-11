'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Filter } from 'lucide-react'
import { products, companies } from '@/lib/mock-data'
import { formatCurrency } from '@/lib/utils'

const CATEGORIES = ['Tümü', ...Array.from(new Set(products.map((p) => p.category)))]

export default function BuyerDiscoverPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Tümü')

  const filtered = products
    .filter((p) => p.status === 'active')
    .filter((p) =>
      category === 'Tümü' ? true : p.category === category
    )
    .filter((p) =>
      search.trim() === ''
        ? true
        : p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase())
    )

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Ürün Keşfi</h1>
        <p className="text-sm text-slate-500 mt-1">Tedarikçilerden toptan ürün alın</p>
      </div>

      {/* Search + filter */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Ürün ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] bg-white"
          />
        </div>
        <div className="flex gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                category === cat
                  ? 'bg-[#1e3a5f] text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((product) => {
          const seller = companies.find((c) => c.id === product.seller_id)!
          const basePrice = product.price_tiers[0]?.price ?? 0
          const bestPrice = product.price_tiers[product.price_tiers.length - 1]?.price ?? 0

          return (
            <Link
              key={product.id}
              href={`/buyer/discover/${product.id}`}
              className="bg-white rounded-xl border border-slate-200 p-5 hover:border-[#1e3a5f]/40 hover:shadow-md transition-all group"
            >
              {/* Image placeholder */}
              <div className="h-36 bg-slate-100 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-slate-400 text-sm">Görsel yok</span>
              </div>

              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900 group-hover:text-[#1e3a5f] transition-colors line-clamp-1">
                    {product.name}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">{seller.name}</p>
                </div>
                <span className="shrink-0 text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                  {product.category}
                </span>
              </div>

              <p className="text-xs text-slate-400 mt-2 line-clamp-2">{product.description}</p>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-end justify-between">
                <div>
                  <p className="text-xs text-slate-400">Birim fiyat</p>
                  <div className="flex items-baseline gap-1.5">
                    <p className="text-lg font-bold text-slate-900">{formatCurrency(bestPrice)}</p>
                    {bestPrice !== basePrice && (
                      <p className="text-sm text-slate-400 line-through">{formatCurrency(basePrice)}</p>
                    )}
                  </div>
                </div>
                <p className="text-xs text-slate-400">Min. {product.min_order_qty} adet</p>
              </div>
            </Link>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-slate-400">Arama kriterlerinize uygun ürün bulunamadı.</p>
        </div>
      )}
    </div>
  )
}
