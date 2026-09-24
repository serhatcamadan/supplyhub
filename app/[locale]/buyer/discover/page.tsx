'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { getProducts, type ApiProduct } from '@/lib/api/products'
import { logSearchKeyword } from '@/lib/api/search-logs'
import { debounce } from '@/lib/debounce'
import { CATEGORY_UNIT_KEY, DEFAULT_UNIT_KEY } from '@/lib/category-meta'
import { useFavorites } from '@/lib/hooks/use-favorites'
import { Button } from '@/components/ui/button'
import { CategoryChips } from '@/components/buyer/category-chips'
import { ProductCard, type ProductBadge } from '@/components/buyer/product-card'
import { ProductGridSkeleton } from '@/components/skeletons/product-grid-skeleton'
import { IconAdjustments, IconSearch, IconSearchOff } from '@tabler/icons-react'

// DB category → badge translation key + colorScheme
const BADGE_BY_CATEGORY: Record<string, { key: string; colorScheme: ProductBadge['colorScheme'] }> = {
  'Yağlar':                { key: 'organic',     colorScheme: 'secondary' },
  'Doğal Ürünler':         { key: 'natural',     colorScheme: 'secondary' },
  'Tahıllar':              { key: 'fresh',        colorScheme: 'primary' },
  'Baklagiller & Makarna': { key: 'fastDelivery', colorScheme: 'primary' },
}

export default function BuyerDiscoverPage() {
  const t = useTranslations('buyer')
  const locale = useLocale()

  const ALL = t('discover.allCategory')
  const [category, setCategory] = useState(ALL)
  const [search, setSearch] = useState('')
  const [products, setProducts] = useState<ApiProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [draftMin, setDraftMin] = useState('')
  const [draftMax, setDraftMax] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const filterRef = useRef<HTMLDivElement>(null)
  const { isFavorited, toggleFavorite } = useFavorites()
  const logSearchRef = useRef(debounce((keyword: string) => {
    logSearchKeyword(keyword).catch(console.error)
  }, 500))

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const categories = [ALL, ...Array.from(new Set(products.map((p) => p.category)))]
  const priceFilterActive = minPrice !== '' || maxPrice !== ''

  const filtered = products.filter((p) => {
    const fromPrice = p.price_tiers[0]?.price ?? 0
    return (
      (category === ALL || p.category === category) &&
      (!search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())) &&
      (minPrice === '' || fromPrice >= Number(minPrice)) &&
      (maxPrice === '' || fromPrice <= Number(maxPrice))
    )
  })

  function openFilter() {
    setDraftMin(minPrice)
    setDraftMax(maxPrice)
    setFilterOpen((v) => !v)
  }

  function applyFilter() {
    setMinPrice(draftMin)
    setMaxPrice(draftMax)
    setFilterOpen(false)
  }

  function clearFilter() {
    setDraftMin('')
    setDraftMax('')
    setMinPrice('')
    setMaxPrice('')
    setFilterOpen(false)
  }

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
                onChange={(e) => {
                  setSearch(e.target.value)
                  if (e.target.value.trim().length >= 2) logSearchRef.current(e.target.value)
                }}
                className="h-10 pl-9 pr-4 bg-surface border border-outline-variant rounded-lg text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/60 w-56"
              />
            </div>
            <div className="relative" ref={filterRef}>
              <Button variant="ghost" onClick={openFilter} className={priceFilterActive ? 'text-primary' : ''}>
                <IconAdjustments size={18} />
                {t('discover.filter')}
                {priceFilterActive && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
              </Button>
              {filterOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-surface-container-lowest rounded-lg shadow-xl border border-outline-variant/20 p-4 z-20">
                  <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-3">
                    {t('discover.priceFilter.label')}
                  </p>
                  <div className="flex items-center gap-2 mb-4">
                    <input
                      type="number"
                      min={0}
                      value={draftMin}
                      onChange={(e) => setDraftMin(e.target.value)}
                      placeholder={t('discover.priceFilter.min')}
                      className="w-full h-9 px-3 bg-surface border border-outline-variant rounded-lg text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/60"
                    />
                    <span className="text-on-surface-variant">–</span>
                    <input
                      type="number"
                      min={0}
                      value={draftMax}
                      onChange={(e) => setDraftMax(e.target.value)}
                      placeholder={t('discover.priceFilter.max')}
                      className="w-full h-9 px-3 bg-surface border border-outline-variant rounded-lg text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/60"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="flex-1 justify-center" onClick={clearFilter}>
                      {t('discover.priceFilter.clear')}
                    </Button>
                    <Button variant="primary" size="sm" className="flex-1 justify-center" onClick={applyFilter}>
                      {t('discover.priceFilter.apply')}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <CategoryChips categories={categories} selected={category} onSelect={setCategory} />
      </div>

      {isLoading ? (
        <ProductGridSkeleton count={8} />
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product) => {
            const badgeDef = BADGE_BY_CATEGORY[product.category]
            const unitKey = CATEGORY_UNIT_KEY[product.category] ?? DEFAULT_UNIT_KEY
            return (
              <ProductCard
                key={product.id}
                product={product}
                locale={locale}
                sellerName={product.companies?.name ?? t('discover.unknownSupplier')}
                rating={product.avg_rating}
                unit={t(`discover.units.${unitKey}`)}
                badge={badgeDef
                  ? { label: t(`discover.badges.${badgeDef.key}`), colorScheme: badgeDef.colorScheme }
                  : undefined}
                favorited={isFavorited(product.id)}
                onToggleFavorite={toggleFavorite}
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
