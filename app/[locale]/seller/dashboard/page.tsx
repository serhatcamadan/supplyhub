import { getTranslations, getLocale } from 'next-intl/server'
import { serverApiFetch } from '@/lib/api/server-client'
import { Button } from '@/components/ui/button'
import { RevenueChartCard } from '@/components/seller/revenue-chart-card'
import { StatCards } from '@/components/seller/stat-cards'
import { TopProducts } from '@/components/seller/top-products'
import { ActivityFeed } from '@/components/seller/activity-feed'
import type { Product, OrderWithDetails, QuoteRequestWithDetails } from '@/types'
import { IconCalendar, IconChevronDown } from '@tabler/icons-react'

type OrderForChart = { status: string; total: number; created_at: string }

function buildMonthlyRevenue(orders: OrderForChart[], monthNames: string[]) {
  const map: Record<number, number> = {}
  for (const order of orders) {
    if (order.status !== 'delivered') continue
    const month = new Date(order.created_at).getMonth()
    map[month] = (map[month] ?? 0) + order.total
  }
  const now = new Date()
  return Array.from({ length: 7 }, (_, i) => {
    const month = (now.getMonth() - 6 + i + 12) % 12
    return { month: monthNames[month], revenue: map[month] ?? 0 }
  })
}

function buildWeeklyRevenue(orders: OrderForChart[], locale: string) {
  const now = new Date()
  const dayOfWeek = now.getDay() === 0 ? 6 : now.getDay() - 1 // Mon=0
  const currentMonday = new Date(now)
  currentMonday.setDate(now.getDate() - dayOfWeek)
  currentMonday.setHours(0, 0, 0, 0)

  const fmt = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short' })

  return Array.from({ length: 7 }, (_, i) => {
    const weekStart = new Date(currentMonday)
    weekStart.setDate(currentMonday.getDate() - (6 - i) * 7)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 7)

    const revenue = orders
      .filter((o) => {
        if (o.status !== 'delivered') return false
        const d = new Date(o.created_at)
        return d >= weekStart && d < weekEnd
      })
      .reduce((sum, o) => sum + o.total, 0)

    return { month: fmt.format(weekStart), revenue }
  })
}

export default async function SellerDashboardPage() {
  const [t, locale] = await Promise.all([
    getTranslations('seller'),
    getLocale(),
  ])

  const [allProducts, allOrders, allQuotes] = await Promise.all([
    serverApiFetch<Product[]>('/seller/products').catch(() => [] as Product[]),
    serverApiFetch<OrderWithDetails[]>('/orders').catch(() => [] as OrderWithDetails[]),
    serverApiFetch<QuoteRequestWithDetails[]>('/quote-requests').catch(() => [] as QuoteRequestWithDetails[]),
  ])

  const buyerNames = Object.fromEntries(
    allOrders.map((o) => [o.buyer_id, o.buyer.name])
  )

  const activeProducts = allProducts.filter((p) => p.status === 'active')
  const draftProducts = allProducts.filter((p) => p.status === 'draft')
  const pendingQuotes = allQuotes.filter((q) => q.status === 'pending')
  const totalRevenue = allOrders.filter((o) => o.status === 'delivered').reduce((sum, o) => sum + o.total, 0)
  const shippingOrders = allOrders.filter((o) => o.status === 'shipped')
  const processingOrders = allOrders.filter((o) => o.status === 'confirmed')

  const topProducts = activeProducts.slice(0, 3)
  const recentOrders = [...allOrders]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 2)
  const firstPendingQuote = pendingQuotes[0] ?? null

  const monthNames = t.raw('dashboard.months') as string[]
  const monthlyRevenue = buildMonthlyRevenue(allOrders, monthNames)
  const weeklyRevenue = buildWeeklyRevenue(allOrders, locale)

  return (
    <div className="p-8 flex flex-col gap-8">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-on-surface">{t('dashboard.heading')}</h1>
          <p className="text-sm text-on-surface-variant mt-2">{t('dashboard.subHeading')}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost">
            <IconCalendar size={20} />
            {t('dashboard.last30Days')}
            <IconChevronDown size={16} />
          </Button>
        </div>
      </div>

      <StatCards
        totalRevenue={totalRevenue}
        pendingQuotesCount={pendingQuotes.length}
        activeOrdersCount={shippingOrders.length + processingOrders.length}
        shippingCount={shippingOrders.length}
        processingCount={processingOrders.length}
        activeProductsCount={activeProducts.length}
        draftProductsCount={draftProducts.length}
        locale={locale}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <RevenueChartCard weeklyData={weeklyRevenue} monthlyData={monthlyRevenue} />
        <TopProducts products={topProducts} locale={locale} />
      </div>

      <ActivityFeed orders={recentOrders} quote={firstPendingQuote} buyerNames={buyerNames} locale={locale} />

    </div>
  )
}
