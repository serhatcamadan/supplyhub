'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { getOrders, updateOrderStatus } from '@/lib/api/orders'
import { formatCurrency, cn } from '@/lib/utils'
import type { OrderStatus, OrderWithDetails } from '@/types'
import { TableControls } from '@/components/seller/table-controls'
import { OrderTable } from '@/components/seller/order-table'
import { PageHeaderSkeleton } from '@/components/skeletons/page-header-skeleton'
import { StatCardsSkeleton } from '@/components/skeletons/stat-cards-skeleton'
import { TableSkeleton } from '@/components/skeletons/table-skeleton'
import { IconClock, IconDownload, IconFilter, IconTruck } from '@tabler/icons-react'

type OrderTab = 'all' | 'pending' | 'confirmed' | 'shipped' | 'delivered'
type DateFilter = 'all' | 'last7' | 'last30' | 'thisMonth'

const DATE_FILTERS: DateFilter[] = ['all', 'last7', 'last30', 'thisMonth']

function matchesDateFilter(order: OrderWithDetails, filter: DateFilter): boolean {
  if (filter === 'all') return true
  const created = new Date(order.created_at)
  const now = new Date()
  if (filter === 'last7') return now.getTime() - created.getTime() <= 7 * 86_400_000
  if (filter === 'last30') return now.getTime() - created.getTime() <= 30 * 86_400_000
  return created.getFullYear() === now.getFullYear() && created.getMonth() === now.getMonth()
}

function toCsv(orders: OrderWithDetails[], headers: Record<string, string>, locale: string): string {
  const cols = [headers.orderId, headers.buyer, headers.date, headers.items, headers.total, headers.status]
  const rows = orders.map((o) => [
    o.id,
    o.buyer.name,
    new Date(o.created_at).toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-US'),
    String(o.items.length),
    String(o.total),
    o.status,
  ].map((v) => `"${v.replace(/"/g, '""')}"`).join(','))
  return [cols.join(','), ...rows].join('\n')
}

export default function SellerOrdersPage() {
  const t = useTranslations('seller')
  const locale = useLocale()
  const [tab, setTab]             = useState<OrderTab>('all')
  const [search, setSearch]       = useState('')
  const [allOrders, setAllOrders] = useState<OrderWithDetails[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [dateFilter, setDateFilter]     = useState<DateFilter>('all')
  const [filterOpen, setFilterOpen]     = useState(false)
  const filterRef = useRef<HTMLDivElement>(null)

  const TABS = [
    { value: 'all',       label: t('orders.tabs.all') },
    { value: 'pending',   label: t('orders.tabs.pending') },
    { value: 'confirmed', label: t('orders.tabs.confirmed') },
    { value: 'shipped',   label: t('orders.tabs.shipped') },
    { value: 'delivered', label: t('orders.tabs.delivered') },
  ]

  useEffect(() => {
    getOrders()
      .then(setAllOrders)
      .catch(() => {})
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

  const pendingCount = allOrders.filter((o) => o.status === 'pending').length
  const shippedCount = allOrders.filter((o) => o.status === 'shipped').length
  const totalRevenue = allOrders.reduce((sum, o) => sum + o.total, 0)

  async function handleStatusChange(orderId: string, newStatus: OrderStatus) {
    try {
      const updated = await updateOrderStatus(orderId, newStatus)
      setAllOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)))
    } catch {
      // noop
    }
  }

  if (isLoading) {
    return (
      <div className="p-8 flex flex-col gap-8">
        <PageHeaderSkeleton actionCount={2} />
        <StatCardsSkeleton count={4} />
        <div className="bg-surface-container-lowest rounded-xl shadow-md flex flex-col overflow-hidden">
          <TableSkeleton rows={7} cols={5} />
        </div>
      </div>
    )
  }

  const byTab  = allOrders.filter((o) => tab === 'all' || o.status === tab)
  const byDate = byTab.filter((o) => matchesDateFilter(o, dateFilter))
  const filtered = search
    ? byDate.filter(
        (o) =>
          o.id.includes(search.toLowerCase()) ||
          o.buyer.name.toLowerCase().includes(search.toLowerCase())
      )
    : byDate

  function handleExport() {
    const csv = toCsv(filtered, {
      orderId: t('orders.table.orderId'),
      buyer: t('orders.table.buyer'),
      date: t('orders.table.date'),
      items: t('orders.table.items'),
      total: t('orders.table.total'),
      status: t('orders.table.status'),
    }, locale)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'supplyhub-orders.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-8 flex flex-col gap-8">

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-on-surface">{t('orders.heading')}</h1>
          <p className="text-sm text-on-surface-variant mt-2">{t('orders.subHeading')}</p>
        </div>
        <div className="flex gap-3">
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setFilterOpen((v) => !v)}
              className={cn(
                'h-10 px-4 inline-flex items-center gap-2 border border-outline-variant rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-surface-container-low transition-colors shadow-sm',
                dateFilter !== 'all' ? 'bg-primary-container text-on-primary-container border-primary/30' : 'bg-surface text-on-surface'
              )}
            >
              <IconFilter size={18} />
              {t('orders.filter')}
              {dateFilter !== 'all' && (
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </button>
            {filterOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-surface-container-lowest rounded-lg shadow-xl border border-outline-variant/20 overflow-hidden z-20">
                {DATE_FILTERS.map((f) => (
                  <button
                    key={f}
                    onClick={() => { setDateFilter(f); setFilterOpen(false) }}
                    className={cn(
                      'w-full text-left px-4 py-2.5 text-sm transition-colors',
                      dateFilter === f
                        ? 'bg-primary-container text-on-primary-container font-semibold'
                        : 'text-on-surface hover:bg-surface-container-high'
                    )}
                  >
                    {t(`orders.dateFilter.${f}`)}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={handleExport}
            disabled={filtered.length === 0}
            className="h-10 px-4 inline-flex items-center gap-2 bg-surface text-primary border border-outline-variant rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-surface-container-low transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-surface"
          >
            <IconDownload size={18} />
            {t('orders.exportCsv')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
          <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-2">{t('orders.stats.totalOrders')}</p>
          <p className="text-4xl font-bold text-on-surface">{allOrders.length}</p>
        </div>

        <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-tertiary-container/20 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-2">{t('orders.stats.awaitingAction')}</p>
              <p className="text-4xl font-bold text-on-surface">{pendingCount}</p>
            </div>
            <IconClock className="text-on-tertiary-container bg-tertiary-container/30 p-2 rounded-lg shrink-0" />
          </div>
        </div>

        <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-primary-fixed-dim/20 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-2">{t('orders.stats.inTransit')}</p>
              <p className="text-4xl font-bold text-on-surface">{shippedCount}</p>
            </div>
            <IconTruck className="text-on-primary-fixed-variant bg-primary-fixed-dim/30 p-2 rounded-lg shrink-0" />
          </div>
        </div>

        <div className="bg-primary p-5 rounded-xl shadow-md relative overflow-hidden text-on-primary">
          <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-xl -mr-10 -mt-10" />
          <p className="text-xs font-semibold uppercase tracking-wider mb-2 text-on-primary/80">{t('orders.stats.totalRevenue')}</p>
          <p className="text-4xl font-bold tracking-tight relative z-10">{formatCurrency(totalRevenue, locale)}</p>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-md flex flex-col overflow-hidden">
        <TableControls
          tabs={TABS}
          activeTab={tab}
          onTabChange={(v) => setTab(v as OrderTab)}
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder={t('orders.searchPlaceholder')}
        />
        <OrderTable orders={filtered} onStatusChange={handleStatusChange} />
      </div>

    </div>
  )
}
