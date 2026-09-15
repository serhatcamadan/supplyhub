'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { cn, formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { OrderStatCards } from './order-stat-cards'
import { OrderHistoryTable } from './order-history-table'
import { OrdersCsvButton } from './orders-csv-button'
import type { OrderWithDetails, OrderStatus } from '@/types'
import { IconFilter } from '@tabler/icons-react'

type DateFilter = 'all' | 'last7' | 'last30' | 'thisMonth'
const DATE_FILTERS: DateFilter[] = ['all', 'last7', 'last30', 'thisMonth']
const STATUSES: OrderStatus[] = ['pending', 'confirmed', 'shipped', 'delivered']

function matchesDateFilter(createdAt: string, filter: DateFilter): boolean {
  if (filter === 'all') return true
  const created = new Date(createdAt)
  const now = new Date()
  if (filter === 'last7') return now.getTime() - created.getTime() <= 7 * 86_400_000
  if (filter === 'last30') return now.getTime() - created.getTime() <= 30 * 86_400_000
  return created.getFullYear() === now.getFullYear() && created.getMonth() === now.getMonth()
}

interface BuyerOrdersContentProps {
  orders: OrderWithDetails[]
}

export function BuyerOrdersContent({ orders }: BuyerOrdersContentProps) {
  const t = useTranslations('buyer')
  const tCommon = useTranslations('common')
  const locale = useLocale()
  const [statusFilter, setStatusFilter] = useState<Set<OrderStatus>>(new Set())
  const [dateFilter, setDateFilter] = useState<DateFilter>('all')
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filtered = useMemo(
    () =>
      orders.filter((o) => {
        if (statusFilter.size > 0 && !statusFilter.has(o.status)) return false
        if (!matchesDateFilter(o.created_at, dateFilter)) return false
        return true
      }),
    [orders, statusFilter, dateFilter]
  )

  const totalSpend = filtered.reduce((sum, o) => sum + o.total, 0)
  const inTransit = filtered.filter((o) => o.status === 'shipped').length
  const activeFilterCount = statusFilter.size + (dateFilter !== 'all' ? 1 : 0)

  function toggleStatus(status: OrderStatus) {
    setStatusFilter((prev) => {
      const next = new Set(prev)
      if (next.has(status)) next.delete(status)
      else next.add(status)
      return next
    })
  }

  function clearFilters() {
    setStatusFilter(new Set())
    setDateFilter('all')
  }

  return (
    <>
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-bold text-on-surface">{t('orders.heading')}</h1>
          <p className="text-sm text-on-surface-variant mt-2">{t('orders.subHeading')}</p>
        </div>
        <div className="flex gap-3">
          <OrdersCsvButton orders={filtered} />
          <div className="relative" ref={ref}>
            <Button variant="primary" size="md" onClick={() => setIsOpen((v) => !v)}>
              <IconFilter size={18} />
              {t('orders.filter')}
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 flex items-center justify-center rounded-full bg-on-primary/20 text-[10px]">
                  {activeFilterCount}
                </span>
              )}
            </Button>
            {isOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant/30 z-20 p-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-2">
                  {t('orders.filterStatus')}
                </p>
                <div className="flex flex-col gap-1 mb-3">
                  {STATUSES.map((status) => (
                    <label
                      key={status}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-surface-container cursor-pointer text-sm text-on-surface"
                    >
                      <input
                        type="checkbox"
                        checked={statusFilter.has(status)}
                        onChange={() => toggleStatus(status)}
                        className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary"
                      />
                      {tCommon(`status.${status}`)}
                    </label>
                  ))}
                </div>

                <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-2">
                  {t('orders.filterDate')}
                </p>
                <div className="flex flex-col gap-1 mb-3">
                  {DATE_FILTERS.map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setDateFilter(f)}
                      className={cn(
                        'w-full text-left px-2 py-1.5 rounded-lg text-sm transition-colors',
                        dateFilter === f
                          ? 'bg-primary-container text-on-primary-container font-semibold'
                          : 'text-on-surface hover:bg-surface-container'
                      )}
                    >
                      {t(`orders.dateFilter.${f}`)}
                    </button>
                  ))}
                </div>

                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="w-full text-center text-xs font-semibold text-primary hover:underline py-1"
                  >
                    {t('orders.clearFilters')}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <OrderStatCards
        totalOrders={filtered.length}
        totalSpend={formatCurrency(totalSpend, locale)}
        inTransit={inTransit}
      />

      <OrderHistoryTable orders={filtered} />
    </>
  )
}
