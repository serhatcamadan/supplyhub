import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { RevenueChart } from '@/components/seller/revenue-chart'
import { StatCards } from '@/components/seller/stat-cards'
import { TopProducts } from '@/components/seller/top-products'
import { ActivityFeed } from '@/components/seller/activity-feed'

const MONTH_NAMES = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara']

function buildMonthlyRevenue(orders: { status: string; total: number; created_at: string }[]) {
  const map: Record<number, number> = {}
  for (const order of orders) {
    if (order.status !== 'delivered') continue
    const month = new Date(order.created_at).getMonth()
    map[month] = (map[month] ?? 0) + order.total
  }
  const now = new Date()
  return Array.from({ length: 7 }, (_, i) => {
    const month = (now.getMonth() - 6 + i + 12) % 12
    return { month: MONTH_NAMES[month], revenue: map[month] ?? 0 }
  })
}

export default async function SellerDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const companyId = user?.user_metadata?.company_id as string

  const [productsRes, ordersRes] = await Promise.all([
    supabase.from('products').select('*').eq('seller_id', companyId),
    supabase.from('orders').select('*').eq('seller_id', companyId),
  ])

  const allProducts = productsRes.data ?? []
  const allOrders = ordersRes.data ?? []

  const productIds = allProducts.map((p) => p.id)
  const [quotesRes, buyerCompaniesRes] = await Promise.all([
    productIds.length > 0
      ? supabase.from('quote_requests').select('*').in('product_id', productIds)
      : Promise.resolve({ data: [] }),
    supabase
      .from('companies')
      .select('id, name')
      .in('id', [...new Set(allOrders.map((o) => o.buyer_id))]),
  ])

  const allQuotes = quotesRes.data ?? []
  const buyerNames = Object.fromEntries((buyerCompaniesRes.data ?? []).map((c) => [c.id, c.name]))

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
  const monthlyRevenue = buildMonthlyRevenue(allOrders)

  return (
    <div className="p-8 flex flex-col gap-8">

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-on-surface">Monthly Revenue</h3>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">Weekly</Button>
              <Button variant="primary" size="sm">Monthly</Button>
            </div>
          </div>
          <RevenueChart data={monthlyRevenue} />
        </div>

        <TopProducts products={topProducts} />
      </div>

      <ActivityFeed orders={recentOrders} quote={firstPendingQuote} buyerNames={buyerNames} />

    </div>
  )
}
