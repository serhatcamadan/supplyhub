'use client'

import { cn } from '@/lib/utils'
import type { OrderStatus } from '@/types'

export type OrderTab = 'all' | OrderStatus

const TABS: { value: OrderTab; label: string }[] = [
  { value: 'all', label: 'All Orders' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
]

interface OrderControlsProps {
  tab: OrderTab
  onTab: (t: OrderTab) => void
  search: string
  onSearch: (s: string) => void
}

export function OrderControls({ tab, onTab, search, onSearch }: OrderControlsProps) {
  return (
    <div className="px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-outline-variant/30 bg-surface/50">
      <div className="flex gap-1 p-1 bg-surface-container-low rounded-lg overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => onTab(t.value)}
            className={cn(
              'px-4 py-2 text-sm transition-all rounded-md whitespace-nowrap',
              tab === t.value
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
          <span
            className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors"
            style={{ fontSize: '18px' }}
          >
            search
          </span>
          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-surface text-sm border border-outline-variant/50 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            placeholder="Search order ID, buyer..."
            type="text"
          />
        </div>
        <button className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-colors border border-outline-variant/50">
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>filter_list</span>
        </button>
      </div>
    </div>
  )
}
