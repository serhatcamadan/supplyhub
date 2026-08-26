'use client'

import { useState, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { CategoryChips } from '@/components/buyer/category-chips'
import { ProductCard, type ProductBadge } from '@/components/buyer/product-card'
import type { Product } from '@/types'
import { IconAdjustments, IconSearch, IconSearchOff } from '@tabler/icons-react'

// DB category → badge translation key + colorScheme
const BADGE_BY_CATEGORY: Record<string, { key: string; colorScheme: ProductBadge['colorScheme'] }> = {
  'Yağlar':                { key: 'organic',     colorScheme: 'secondary' },
  'Doğal Ürünler':         { key: 'natural',     colorScheme: 'secondary' },
  'Tahıllar':              { key: 'fresh',        colorScheme: 'primary' },
  'Baklagiller & Makarna': { key: 'fastDelivery', colorScheme: 'primary' },
}

// DB category → unit translation key
const UNIT_KEY_BY_CATEGORY: Record<string, string> = {
  'Yağlar':                'bottle',
  'Tahıllar':              'sack',
  'Doğal Ürünler':         'piece',
  'Baklagiller & Makarna': 'pack',
}

export default function BuyerDiscoverPage() {
  const t = useTranslations('buyer')
  const locale = useLocale()

  const ALL = t('discover.allCategory')
  const [category, setCategory] = useState(ALL)
  const [search, setSearch] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [sellerNames, setSellerNames] = useState<Record<string, string>>({})

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

  const filtered = products.filter(
    (p) =>
      (category === ALL || p.category === category) &&
      (!search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="p-8 flex flex-col gap-10">

      <div className="flex flex-col gap-6">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-on-surface">{t('discover.heading')}</h1>
            <p className="text-sm text-on-surface-variant mt-2 max-w-2xl">{t('discover.subHeading')}</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="relative">
              <IconSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input
                type="text"
                placeholder={t('discover.searchPlaceholder')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 pl-9 pr-4 bg-surface border border-outline-variant rounded-lg text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/60 w-56"
              />
            </div>
            <Button variant="ghost">
              <IconAdjustments size={18} />
              {t('discover.filter')}
            </Button>
          </div>
        </div>

        <CategoryChips categories={categories} selected={category} onSelect={setCategory} />
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product) => {
            const badgeDef = BADGE_BY_CATEGORY[product.category]
            const unitKey = UNIT_KEY_BY_CATEGORY[product.category] ?? 'piece'
            return (
              <ProductCard
                key={product.id}
                product={product}
                locale={locale}
                sellerName={sellerNames[product.seller_id] ?? t('discover.unknownSupplier')}
                rating={4.7}
                unit={t(`discover.units.${unitKey}`)}
                badge={badgeDef
                  ? { label: t(`discover.badges.${badgeDef.key}`), colorScheme: badgeDef.colorScheme }
                  : undefined}
              />
            )
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-on-surface-variant">
          <IconSearchOff size={48} />
          <p className="text-sm">{t('discover.noProducts')}</p>
        </div>
      )}

    </div>
  )
}
