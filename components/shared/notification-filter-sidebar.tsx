'use client'

import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { IconBell, IconSearch, IconInbox, IconMailFast, IconShoppingBag, IconFileInvoice, IconSpeakerphone } from '@tabler/icons-react'
import type { ElementType } from 'react'

export type FilterType = 'all' | 'unread' | 'orders' | 'quotes' | 'system'

const FILTER_ICONS: Record<FilterType, ElementType> = {
  all:    IconInbox,
  unread: IconMailFast,
  orders: IconShoppingBag,
  quotes: IconFileInvoice,
  system: IconSpeakerphone,
}

const FILTER_ORDER: FilterType[] = ['all', 'unread', 'orders', 'quotes', 'system']

interface NotificationFilterSidebarProps {
  activeFilter: FilterType
  onFilterChange: (f: FilterType) => void
  countByFilter: Record<FilterType, number>
  search: string
  onSearchChange: (s: string) => void
}

export function NotificationFilterSidebar({
  activeFilter,
  onFilterChange,
  countByFilter,
  search,
  onSearchChange,
}: NotificationFilterSidebarProps) {
  const t = useTranslations('common')

  return (
    <aside className="w-full xl:w-64 shrink-0 flex flex-col gap-4">

      <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-primary-container/10 to-transparent pointer-events-none opacity-50" />
        <h3 className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-4 relative z-10">
          {t('notifications.page.filtersLabel')}
        </h3>

        <div className="relative mb-4 z-10">
          <IconSearch size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t('notifications.page.searchPlaceholder')}
            className="w-full pl-10 pr-4 py-2 bg-surface-container border border-outline-variant/50 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>

        <nav className="flex flex-col gap-1 relative z-10">
          {FILTER_ORDER.map((value) => {
            const count = countByFilter[value]
            const active = activeFilter === value
            const FIcon = FILTER_ICONS[value]
            return (
              <button
                key={value}
                onClick={() => onFilterChange(value)}
                className={cn(
                  'flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors w-full text-left',
                  active
                    ? 'bg-primary-container text-on-primary-container font-semibold'
                    : 'hover:bg-surface-container-high text-on-surface-variant'
                )}
              >
                <div className="flex items-center gap-3">
                  <FIcon size={20} />
                  {t(`notifications.filters.${value}`)}
                </div>
                {count > 0 && (
                  <span
                    className={cn(
                      'px-2 py-0.5 rounded-full text-xs font-semibold',
                      value === 'unread'
                        ? 'bg-error/10 text-error'
                        : active
                          ? 'bg-primary/20 text-on-primary-container'
                          : 'bg-surface-container-high text-on-surface-variant'
                    )}
                  >
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </nav>
      </div>

      <div className="bg-secondary-container text-on-secondary-container rounded-xl p-6 shadow-sm relative overflow-hidden">
        <div className="absolute -right-4 -bottom-4 w-32 h-32 text-on-secondary-container/10">
          <IconBell size={120} />
        </div>
        <h4 className="text-sm font-semibold mb-2 relative z-10">{t('notifications.page.settingsTitle')}</h4>
        <p className="text-xs mb-4 relative z-10 opacity-90 leading-relaxed">
          {t('notifications.page.settingsBody')}
        </p>
        <button className="px-4 py-2 bg-on-secondary-container text-secondary-container rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity relative z-10">
          {t('notifications.page.managePreferences')}
        </button>
      </div>

    </aside>
  )
}
