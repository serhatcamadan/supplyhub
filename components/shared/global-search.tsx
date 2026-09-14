'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { getProducts, getSellerProducts } from '@/lib/api/products'
import { getQuoteRequests } from '@/lib/api/quotes'
import { IconFileInvoice, IconPackage, IconSearch } from '@tabler/icons-react'

interface GlobalSearchProps {
  portal: 'seller' | 'buyer'
}

interface SearchResult {
  type: 'product' | 'quote'
  id: string
  title: string
  subtitle: string
  href: string
}

const MIN_QUERY_LENGTH = 2
const MAX_RESULTS_PER_TYPE = 5

export function GlobalSearch({ portal }: GlobalSearchProps) {
  const t = useTranslations('common')
  const locale = useLocale()
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [products, setProducts] = useState<{ id: string; name: string; category: string }[]>([])
  const [quotes, setQuotes] = useState<{ id: string; productName: string; buyerName: string }[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadProducts = portal === 'seller' ? getSellerProducts() : getProducts()
    loadProducts
      .then((data) => setProducts(data.map((p) => ({ id: p.id, name: p.name, category: p.category }))))
      .catch(() => {})
    getQuoteRequests()
      .then((data) => setQuotes(data.map((q) => ({ id: q.id, productName: q.product.name, buyerName: q.buyer.name }))))
      .catch(() => {})
  }, [portal])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setIsOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const q = query.trim().toLowerCase()
  const showResults = isOpen && q.length >= MIN_QUERY_LENGTH

  const results: SearchResult[] = !showResults ? [] : [
    ...products
      .filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
      .slice(0, MAX_RESULTS_PER_TYPE)
      .map((p) => ({
        type: 'product' as const,
        id: p.id,
        title: p.name,
        subtitle: p.category,
        href: portal === 'seller' ? `/${locale}/seller/products/${p.id}` : `/${locale}/buyer/discover/${p.id}`,
      })),
    ...quotes
      .filter(
        (qt) =>
          qt.productName.toLowerCase().includes(q) ||
          qt.buyerName.toLowerCase().includes(q) ||
          qt.id.toLowerCase().includes(q)
      )
      .slice(0, MAX_RESULTS_PER_TYPE)
      .map((qt) => ({
        type: 'quote' as const,
        id: qt.id,
        title: qt.productName,
        subtitle: qt.buyerName,
        href: `/${locale}/${portal}/quotes/${qt.id}`,
      })),
  ]

  return (
    <div className="relative flex items-center group" ref={containerRef}>
      <IconSearch size={20} className="absolute left-3 text-on-surface-variant group-focus-within:text-primary transition-colors" />
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setIsOpen(true)
        }}
        onFocus={() => setIsOpen(true)}
        className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
        placeholder={t('searchPlaceholder')}
        type="text"
      />
      {showResults && (
        <div className="absolute left-0 top-full mt-2 w-full bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant/30 z-50 py-2 max-h-96 overflow-auto">
          {results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-on-surface-variant">{t('searchNoResults')}</p>
          ) : (
            results.map((r) => (
              <Link
                key={`${r.type}-${r.id}`}
                href={r.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 hover:bg-surface-container transition-colors"
              >
                {r.type === 'product' ? (
                  <IconPackage size={18} className="text-on-surface-variant shrink-0" />
                ) : (
                  <IconFileInvoice size={18} className="text-on-surface-variant shrink-0" />
                )}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-on-surface truncate">{r.title}</p>
                  <p className="text-xs text-on-surface-variant truncate">{r.subtitle}</p>
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  )
}
