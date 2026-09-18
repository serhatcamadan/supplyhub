'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { StatCards } from './stat-cards'
import { RevenueChartCard } from './revenue-chart-card'
import { TopProducts, type ProductSalesStat } from './top-products'
import { ActivityFeed } from './activity-feed'
import type { OrderWithDetails, QuoteRequestWithDetails } from '@/types'
import { IconCalendar, IconChevronDown } from '@tabler/icons-react'

type DateFilter = 'last7' | 'last30' | 'last90' | 'all'
const DATE_FILTERS: DateFilter[] = ['last7', 'last30', 'last90', 'all']

function matchesDateFilter(createdAt: string, filter: DateFilter): boolean {
  if (filter === 'all') return true
  const days = filter === 'last7' ? 7 : filter === 'last30' ? 30 : 90
  return Date.now() - new Date(createdAt).getTime() <= days * 86_400_000
}

// The period immediately preceding the selected window (e.g. days 8-14 ago for "last7"),
// used to compute a genuine period-over-period revenue comparison.
function matchesPreviousPeriod(createdAt: string, filter: DateFilter): boolean {
  if (filter === 'all') return false
  const days = filter === 'last7' ? 7 : filter === 'last30' ? 30 : 90
  const ageMs = Date.now() - new Date(createdAt).getTime()
  return ageMs > days * 86_400_000 && ageMs <= days * 2 * 86_400_000
}

interface DashboardContentProps {
  allOrders: OrderWithDetails[]
  allQuotes: QuoteRequestWithDetails[]
  pendingQuotesCount: number
  activeOrdersCount: number
  shippingCount: number
  processingCount: number
  activeProductsCount: number
  draftProductsCount: number
  buyerNames: Record<string, string>
  locale: string
  monthlyRevenue: { month: string; revenue: number }[]
  weeklyRevenue: { month: string; revenue: number }[]
}

export function DashboardContent({
  allOrders,
  allQuotes,
  pendingQuotesCount,
  activeOrdersCount,
  shippingCount,
  processingCount,
  activeProductsCount,
  draftProductsCount,
  buyerNames,
  locale,
  monthlyRevenue,
  weeklyRevenue,
}: DashboardContentProps) {
  const t = useTranslations('seller')
  const [dateFilter, setDateFilter] = useState<DateFilter>('last30')
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredOrders = useMemo(
    () => allOrders.filter((o) => matchesDateFilter(o.created_at, dateFilter)),
    [allOrders, dateFilter]
  )

  const totalRevenue = filteredOrders
    .filter((o) => o.status === 'delivered')
    .reduce((sum, o) => sum + o.total, 0)

  const previousRevenue = allOrders
    .filter((o) => o.status === 'delivered' && matchesPreviousPeriod(o.created_at, dateFilter))
    .reduce((sum, o) => sum + o.total, 0)

  const revenueChangePct =
    previousRevenue > 0 ? Math.round(((totalRevenue - previousRevenue) / previousRevenue) * 100) : null

  const recentOrders = [...filteredOrders]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 2)

  const firstPendingQuote =
    allQuotes.find((q) => q.status === 'pending' && matchesDateFilter(q.created_at, dateFilter)) ?? null

  const productStats = useMemo(() => {
    const map = new Map<string, ProductSalesStat>()
    filteredOrders
      .filter((o) => o.status === 'delivered')
      .forEach((o) => {
        o.items.forEach((item) => {
          const revenue = item.quantity * item.unit_price
          const existing = map.get(item.product_id)
          if (existing) {
            existing.unitsSold += item.quantity
            existing.revenue += revenue
          } else {
            map.set(item.product_id, {
              id: item.product_id,
              name: item.product.name,
              category: item.product.category,
              unitsSold: item.quantity,
              revenue,
            })
          }
        })
      })
    return Array.from(map.values()).sort((a, b) => b.revenue - a.revenue)
  }, [filteredOrders])

  const topProducts = productStats.slice(0, 3)

  const categoryRevenue = useMemo(() => {
    const map = new Map<string, number>()
    productStats.forEach((p) => map.set(p.category, (map.get(p.category) ?? 0) + p.revenue))
    const total = Array.from(map.values()).reduce((sum, v) => sum + v, 0)
    return Array.from(map, ([category, revenue]) => ({
      category,
      pct: total > 0 ? Math.round((revenue / total) * 100) : 0,
    })).sort((a, b) => b.pct - a.pct)
  }, [productStats])

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-on-surface">{t('dashboard.heading')}</h1>
          <p className="text-sm text-on-surface-variant mt-2">{t('dashboard.subHeading')}</p>
        </div>
        <div className="relative" ref={ref}>
          <Button variant="ghost" onClick={() => setIsOpen((v) => !v)}>
            <IconCalendar size={20} />
            {t(`dashboard.dateFilter.${dateFilter}`)}
            <IconChevronDown size={16} />
          </Button>
          {isOpen && (
            <div className="absolute right-0 top-full mt-2 w-44 bg-surface-container-lowest rounded-lg shadow-xl border border-outline-variant/20 overflow-hidden z-20">
              {DATE_FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => {
                    setDateFilter(f)
                    setIsOpen(false)
                  }}
                  className={cn(
                    'w-full text-left px-4 py-2.5 text-sm transition-colors',
                    dateFilter === f
                      ? 'bg-primary-container text-on-primary-container font-semibold'
                      : 'text-on-surface hover:bg-surface-container-high'
                  )}
                >
                  {t(`dashboard.dateFilter.${f}`)}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <StatCards
        totalRevenue={totalRevenue}
        revenueChangePct={revenueChangePct}
        pendingQuotesCount={pendingQuotesCount}
        activeOrdersCount={activeOrdersCount}
        shippingCount={shippingCount}
        processingCount={processingCount}
        activeProductsCount={activeProductsCount}
        draftProductsCount={draftProductsCount}
        locale={locale}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <RevenueChartCard weeklyData={weeklyRevenue} monthlyData={monthlyRevenue} />
        <TopProducts
          products={topProducts}
          topCategoryPct={categoryRevenue[0]?.pct ?? 0}
          secondCategoryPct={categoryRevenue[1]?.pct ?? 0}
          topCategoryName={categoryRevenue[0]?.category ?? null}
          locale={locale}
        />
      </div>

      <ActivityFeed orders={recentOrders} quote={firstPendingQuote} buyerNames={buyerNames} locale={locale} />
    </>
  )
}
