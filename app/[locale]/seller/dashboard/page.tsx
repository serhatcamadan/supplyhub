import { getTranslations, getLocale } from 'next-intl/server'
import { serverApiFetch } from '@/lib/api/server-client'
import { Button } from '@/components/ui/button'
import { RevenueChart } from '@/components/seller/revenue-chart'
import { StatCards } from '@/components/seller/stat-cards'
import { TopProducts } from '@/components/seller/top-products'
import { ActivityFeed } from '@/components/seller/activity-feed'
import type { Product, OrderWithDetails, QuoteRequestWithDetails } from '@/types'
import { IconCalendar, IconChevronDown, IconDownload } from '@tabler/icons-react'

function buildMonthlyRevenue(
  orders: { status: string; total: number; created_at: string }[],
  monthNames: string[]
) {
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
          <Button variant="primary">
            <IconDownload size={20} />
            {t('dashboard.exportReport')}
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
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-on-surface">{t('dashboard.monthlyRevenue')}</h3>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">{t('dashboard.weekly')}</Button>
              <Button variant="primary" size="sm">{t('dashboard.monthly')}</Button>
            </div>
          </div>
          <RevenueChart data={monthlyRevenue} />
        </div>

        <TopProducts products={topProducts} locale={locale} />
      </div>

      <ActivityFeed orders={recentOrders} quote={firstPendingQuote} buyerNames={buyerNames} locale={locale} />

    </div>
  )
}
