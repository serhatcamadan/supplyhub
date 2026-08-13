import { orders, products, quoteRequests } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { RevenueChart } from '@/components/seller/revenue-chart'
import { StatCards } from '@/components/seller/stat-cards'
import { TopProducts } from '@/components/seller/top-products'
import { ActivityFeed } from '@/components/seller/activity-feed'

const SELLER_ID = 'company-seller-1'

export default function SellerDashboardPage() {
  const sellerOrders = orders.filter((o) => o.seller_id === SELLER_ID)
  const activeProducts = products.filter((p) => p.seller_id === SELLER_ID && p.status === 'active')
  const draftProducts = products.filter((p) => p.seller_id === SELLER_ID && p.status === 'draft')
  const pendingQuotes = quoteRequests.filter((q) => q.status === 'pending')

  const totalRevenue = sellerOrders
    .filter((o) => o.status === 'delivered')
    .reduce((sum, o) => sum + o.total, 0)

  const shippingOrders = sellerOrders.filter((o) => o.status === 'shipped')
  const processingOrders = sellerOrders.filter((o) => o.status === 'confirmed')

  const topProducts = activeProducts.slice(0, 3)

  const recentOrders = [...sellerOrders]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 2)

  const firstPendingQuote = pendingQuotes[0] ?? null

  return (
    <div className="p-8 flex flex-col gap-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-on-surface">Seller Dashboard</h1>
          <p className="text-sm text-on-surface-variant mt-2">
            Overview of your wholesale operations and performance metrics.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost">
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>calendar_month</span>
            Last 30 Days
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>expand_more</span>
          </Button>
          <Button variant="primary">
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>download</span>
            Export Report
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
      />

      {/* Chart + Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-on-surface">Monthly Revenue</h3>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">Weekly</Button>
              <Button variant="primary" size="sm">Monthly</Button>
            </div>
          </div>
          <RevenueChart />
        </div>

        <TopProducts products={topProducts} />
      </div>

      <ActivityFeed orders={recentOrders} quote={firstPendingQuote} />

    </div>
  )
}
