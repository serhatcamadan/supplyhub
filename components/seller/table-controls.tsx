'use client'

import { cn } from '@/lib/utils'
import { IconFilter, IconSearch } from '@tabler/icons-react'

export interface TabItem {
  value: string
  label: string
}

interface TableControlsProps {
  tabs: TabItem[]
  activeTab: string
  onTabChange: (tab: string) => void
  search: string
  onSearchChange: (s: string) => void
  searchPlaceholder?: string
}

export function TableControls({
  tabs,
  activeTab,
  onTabChange,
  search,
  onSearchChange,
  searchPlaceholder = 'Ara...',
}: TableControlsProps) {
  return (
    <div className="px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-outline-variant/30 bg-surface/50">
      <div className="flex gap-1 p-1 bg-surface-container-low rounded-lg overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.value}
            onClick={() => onTabChange(t.value)}
            className={cn(
              'px-4 py-2 text-sm transition-all rounded-md whitespace-nowrap',
              activeTab === t.value
                ? 'bg-surface-container-lowest text-on-surface shadow-sm font-medium'
                : 'text-on-surface-variant hover:text-on-surface'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className="relative flex-1 sm:w-64 group">
          <IconSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors" />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-surface text-sm border border-outline-variant/50 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            placeholder={searchPlaceholder}
            type="text"
          />
        </div>
        <button className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-colors border border-outline-variant/50">
          <IconFilter size={20} />
        </button>
      </div>
    </div>
  )
}
