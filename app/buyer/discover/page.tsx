'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { CategoryChips } from '@/components/buyer/category-chips'
import { ProductCard, type ProductBadge } from '@/components/buyer/product-card'
import type { Product } from '@/types'

const ALL = 'Tümü'

const BADGE_BY_CATEGORY: Record<string, ProductBadge> = {
  'Yağlar':                 { label: 'Organik',         colorScheme: 'secondary' },
  'Doğal Ürünler':          { label: 'Doğal',           colorScheme: 'secondary' },
  'Tahıllar':               { label: 'Taze',            colorScheme: 'primary' },
  'Baklagiller & Makarna':  { label: 'Hızlı Teslimat',  colorScheme: 'primary' },
}

const UNIT_BY_CATEGORY: Record<string, string> = {
  'Yağlar':                '/ şişe',
  'Tahıllar':              '/ çuval',
  'Doğal Ürünler':         '/ adet',
  'Baklagiller & Makarna': '/ paket',
}

export default function BuyerDiscoverPage() {
  const [category, setCategory]                   = useState(ALL)
  const [products, setProducts]                   = useState<Product[]>([])
  const [sellerNames, setSellerNames]             = useState<Record<string, string>>({})

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: productData } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active')

      const prods = (productData as Product[]) ?? []
      setProducts(prods)

      const sellerIds = [...new Set(prods.map((p) => p.seller_id))]
      if (sellerIds.length === 0) return

      const { data: companies } = await supabase
        .from('companies')
        .select('id, name')
        .in('id', sellerIds)

      setSellerNames(Object.fromEntries((companies ?? []).map((c) => [c.id, c.name])))
    }
    load()
  }, [])

  const categories = [ALL, ...Array.from(new Set(products.map((p) => p.category)))]

  const filtered = products.filter((p) => category === ALL || p.category === category)

  return (
    <div className="p-8 flex flex-col gap-10">

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

        <CategoryChips categories={categories} selected={category} onSelect={setCategory} />
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              sellerName={sellerNames[product.seller_id] ?? 'Bilinmeyen Tedarikçi'}
              rating={4.7}
              unit={UNIT_BY_CATEGORY[product.category] ?? '/ adet'}
              badge={BADGE_BY_CATEGORY[product.category]}
            />
          ))}
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
