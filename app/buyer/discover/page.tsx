'use client'

import { useState } from 'react'
import { products, companies } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { CategoryChips } from '@/components/buyer/category-chips'
import { ProductCard, type ProductBadge } from '@/components/buyer/product-card'

const ALL = 'Tümü'
const CATEGORIES = [ALL, ...Array.from(new Set(products.map((p) => p.category)))]

const RATINGS: Record<string, number> = {
  'product-1': 4.8,
  'product-2': 4.6,
  'product-3': 5.0,
  'product-4': 4.9,
  'product-5': 4.7,
}

const BADGES: Record<string, ProductBadge> = {
  'product-1': { label: 'Organik', colorScheme: 'secondary' },
  'product-3': { label: 'Doğal', colorScheme: 'secondary' },
  'product-5': { label: 'Hızlı Teslimat', colorScheme: 'primary' },
}

const UNITS: Record<string, string> = {
  'product-1': '/ şişe',
  'product-2': '/ çuval',
  'product-3': '/ adet',
  'product-4': '/ paket',
  'product-5': '/ adet',
}

export default function BuyerDiscoverPage() {
  const [category, setCategory] = useState(ALL)

  const filtered = products
    .filter((p) => p.status === 'active')
    .filter((p) => category === ALL || p.category === category)

  return (
    <div className="p-8 flex flex-col gap-10">

      {/* Header */}
      <div className="flex flex-col gap-6">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-on-surface">Ürün Keşfi</h1>
            <p className="text-sm text-on-surface-variant mt-2 max-w-2xl">
              Onaylı toptan tedarikçilerden yüksek kaliteli ürünleri keşfedin ve tedarik zincirinizi güçlendirin.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Button variant="ghost">
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>filter_list</span>
              Filtrele
            </Button>
            <Button variant="primary">
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>tune</span>
              Sırala
            </Button>
          </div>
        </div>

        <CategoryChips categories={CATEGORIES} selected={category} onSelect={setCategory} />
      </div>

      {/* Product grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product) => {
            const seller = companies.find((c) => c.id === product.seller_id)
            return (
              <ProductCard
                key={product.id}
                product={product}
                sellerName={seller?.name ?? 'Bilinmeyen Tedarikçi'}
                rating={RATINGS[product.id] ?? 4.5}
                unit={UNITS[product.id]}
                badge={BADGES[product.id]}
              />
            )
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-on-surface-variant">
          <span className="material-symbols-outlined" style={{ fontSize: '48px' }}>search_off</span>
          <p className="text-sm">Bu kategoride ürün bulunamadı.</p>
        </div>
      )}

    </div>
  )
}
