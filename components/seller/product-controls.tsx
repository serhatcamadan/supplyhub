'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { cn, type StockBucket } from '@/lib/utils'
import type { ProductStatus } from '@/types'
import {
  IconCategory,
  IconCheck,
  IconChevronDown,
  IconFilter,
  IconLayoutGrid,
  IconList,
  IconSearch,
} from '@tabler/icons-react'

export interface ProductFilters {
  category: string | null
  status: Set<ProductStatus>
  stock: Set<StockBucket>
}

export const EMPTY_FILTERS: ProductFilters = {
  category: null,
  status: new Set(),
  stock: new Set(),
}

const STATUS_OPTIONS: ProductStatus[] = ['active', 'draft']
const STOCK_OPTIONS: StockBucket[] = ['in_stock', 'low_stock', 'out_of_stock']

interface ProductControlsProps {
  search: string
  onSearch: (value: string) => void
  totalCount: number
  filteredCount: number
  categories: string[]
  filters: ProductFilters
  onFiltersChange: (filters: ProductFilters) => void
  view: 'list' | 'grid'
  onViewChange: (view: 'list' | 'grid') => void
}

export function ProductControls({
  search,
  onSearch,
  totalCount,
  filteredCount,
  categories,
  filters,
  onFiltersChange,
  view,
  onViewChange,
}: ProductControlsProps) {
  const t = useTranslations('seller')

  const [categoryOpen, setCategoryOpen] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const categoryRef = useRef<HTMLDivElement>(null)
  const filtersRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) {
        setCategoryOpen(false)
      }
      if (filtersRef.current && !filtersRef.current.contains(e.target as Node)) {
        setFiltersOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const activeFilterCount = filters.status.size + filters.stock.size

  function toggleStatus(status: ProductStatus) {
    const next = new Set(filters.status)
    if (next.has(status)) next.delete(status)
    else next.add(status)
    onFiltersChange({ ...filters, status: next })
  }

  function toggleStock(bucket: StockBucket) {
    const next = new Set(filters.stock)
    if (next.has(bucket)) next.delete(bucket)
    else next.add(bucket)
    onFiltersChange({ ...filters, stock: next })
  }

  return (
    <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
      <div className="flex flex-1 gap-3 w-full md:w-auto">
        <div className="relative flex-1 max-w-md group">
          <IconSearch size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors" />
          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-surface-container border border-outline-variant rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            placeholder={t('products.controls.searchPlaceholder')}
            type="text"
          />
        </div>

        <div className="relative shrink-0" ref={filtersRef}>
          <button
            type="button"
            onClick={() => setFiltersOpen((v) => !v)}
            className={cn(
              'relative bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 border border-outline-variant',
              filtersOpen && 'ring-2 ring-primary/40'
            )}
          >
            <IconFilter size={18} />
            {t('products.controls.filters')}
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 flex items-center justify-center rounded-full bg-primary text-on-primary text-[10px]">
                {activeFilterCount}
              </span>
            )}
          </button>
          {filtersOpen && (
            <div className="absolute left-0 top-full mt-1 w-64 bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant/30 z-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-2">
                {t('products.controls.filterStatus')}
              </p>
              <div className="flex flex-col gap-1 mb-3">
                {STATUS_OPTIONS.map((status) => (
                  <label
                    key={status}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-surface-container cursor-pointer text-sm text-on-surface"
                  >
                    <input
                      type="checkbox"
                      checked={filters.status.has(status)}
                      onChange={() => toggleStatus(status)}
                      className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary"
                    />
                    {t(`products.status.${status}`)}
                  </label>
                ))}
              </div>

              <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-2">
                {t('products.controls.filterStock')}
              </p>
              <div className="flex flex-col gap-1 mb-3">
                {STOCK_OPTIONS.map((bucket) => (
                  <label
                    key={bucket}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-surface-container cursor-pointer text-sm text-on-surface"
                  >
                    <input
                      type="checkbox"
                      checked={filters.stock.has(bucket)}
                      onChange={() => toggleStock(bucket)}
                      className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary"
                    />
                    {t(`products.controls.stock.${bucket}`)}
                  </label>
                ))}
              </div>

              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={() => onFiltersChange({ ...filters, status: new Set(), stock: new Set() })}
                  className="w-full text-center text-xs font-semibold text-primary hover:underline py-1"
                >
                  {t('products.controls.clearFilters')}
                </button>
              )}
            </div>
          )}
        </div>

        <div className="relative shrink-0" ref={categoryRef}>
          <button
            type="button"
            onClick={() => setCategoryOpen((v) => !v)}
            className={cn(
              'bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-outline-variant max-w-48',
              categoryOpen && 'ring-2 ring-primary/40'
            )}
          >
            <IconCategory size={18} className="shrink-0" />
            <span className="truncate">
              {filters.category ?? t('products.controls.categoryAll')}
            </span>
            <IconChevronDown size={18} className="shrink-0" />
          </button>
          {categoryOpen && (
            <div className="absolute left-0 top-full mt-1 w-56 bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant/30 z-50 py-1 max-h-72 overflow-auto">
              <button
                type="button"
                onClick={() => {
                  onFiltersChange({ ...filters, category: null })
                  setCategoryOpen(false)
                }}
                className="w-full flex items-center justify-between gap-2 px-4 py-2 text-sm text-on-surface hover:bg-surface-container transition-colors"
              >
                {t('products.controls.categoryAll')}
                {filters.category === null && <IconCheck size={16} className="text-primary" />}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    onFiltersChange({ ...filters, category: cat })
                    setCategoryOpen(false)
                  }}
                  className="w-full flex items-center justify-between gap-2 px-4 py-2 text-sm text-on-surface hover:bg-surface-container transition-colors"
                >
                  <span className="truncate">{cat}</span>
                  {filters.category === cat && <IconCheck size={16} className="text-primary shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 w-full md:w-auto justify-end">
        <span className="text-xs text-on-surface-variant mr-2">
          {t('products.controls.showing', { filtered: filteredCount, total: totalCount })}
        </span>
        <button
          type="button"
          onClick={() => onViewChange('list')}
          aria-pressed={view === 'list'}
          title={t('products.controls.listView')}
          className={cn(
            'p-2 rounded-lg transition-colors',
            view === 'list' ? 'bg-primary-container text-on-primary-container' : 'hover:bg-surface-container text-on-surface-variant'
          )}
        >
          <IconList size={20} />
        </button>
        <button
          type="button"
          onClick={() => onViewChange('grid')}
          aria-pressed={view === 'grid'}
          title={t('products.controls.gridView')}
          className={cn(
            'p-2 rounded-lg transition-colors',
            view === 'grid' ? 'bg-primary-container text-on-primary-container' : 'hover:bg-surface-container text-on-surface-variant'
          )}
        >
          <IconLayoutGrid size={20} />
        </button>
      </div>
    </div>
  )
}
