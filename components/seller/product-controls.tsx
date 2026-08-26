'use client'

import { useTranslations } from 'next-intl'
import { IconCategory, IconChevronDown, IconFilter, IconLayoutGrid, IconList, IconSearch } from '@tabler/icons-react'

interface ProductControlsProps {
  search: string
  onSearch: (value: string) => void
  totalCount: number
  filteredCount: number
}

export function ProductControls({
  search,
  onSearch,
  totalCount,
  filteredCount,
}: ProductControlsProps) {
  const t = useTranslations('seller')

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

        <button className="bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 border border-outline-variant shrink-0">
          <IconFilter size={18} />
          {t('products.controls.filters')}
        </button>

        <button className="bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-outline-variant shrink-0">
          <IconCategory size={18} />
          {t('products.controls.categoryAll')}
          <IconChevronDown size={18} />
        </button>
      </div>

      <div className="flex items-center gap-2 w-full md:w-auto justify-end">
        <span className="text-xs text-on-surface-variant mr-2">
          {t('products.controls.showing', { filtered: filteredCount, total: totalCount })}
        </span>
        <button className="p-2 hover:bg-surface-container rounded-lg transition-colors text-on-surface-variant">
          <IconList size={20} />
        </button>
        <button className="p-2 hover:bg-surface-container rounded-lg transition-colors text-on-surface-variant">
          <IconLayoutGrid size={20} />
        </button>
      </div>
    </div>
  )
}
