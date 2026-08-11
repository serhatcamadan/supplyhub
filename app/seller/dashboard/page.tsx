import { orders, products, quoteRequests, companies } from '@/lib/mock-data'
import { formatCurrency, formatDate } from '@/lib/utils'
import { RevenueChart } from '@/components/seller/revenue-chart'

const SELLER_ID = 'company-seller-1'

const ORDER_STATUS_LABEL: Record<string, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  shipped: 'Shipping',
  delivered: 'Delivered',
}

const ORDER_STATUS_COLOR: Record<string, string> = {
  pending: 'bg-surface-variant text-on-surface-variant',
  confirmed: 'bg-primary-fixed text-primary',
  shipped: 'bg-tertiary-container/30 text-on-tertiary-container',
  delivered: 'bg-secondary-container/30 text-secondary',
}

function getCompanyName(companyId: string) {
  return companies.find((c) => c.id === companyId)?.name ?? companyId
}

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
  const activeOrders = shippingOrders.length + processingOrders.length
  const progressWidth = activeOrders > 0
    ? Math.round((shippingOrders.length / activeOrders) * 100)
    : 0

  const topProducts = activeProducts.slice(0, 3)
  const topProductUnits = [450, 320, 185]
  const topProductRevenue = [12000, 8500, 5200]

  const recentOrders = [...sellerOrders]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 2)

  const firstPendingQuote = pendingQuotes[0] ?? null

  return (
    <div className="p-8 flex flex-col gap-8">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-on-surface">Seller Dashboard</h1>
          <p className="text-sm text-on-surface-variant mt-2">
            Overview of your wholesale operations and performance metrics.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-surface-container-high text-on-surface hover:bg-surface-container-highest transition-colors rounded-xl flex items-center gap-2 text-sm">
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>calendar_month</span>
            Last 30 Days
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>expand_more</span>
          </button>
          <button className="px-4 py-2 bg-primary text-on-primary hover:bg-primary-container transition-colors rounded-xl flex items-center gap-2 text-sm shadow-sm">
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>download</span>
            Export Report
          </button>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Revenue — with sparkline */}
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                Total Revenue
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-on-surface mt-1">
                {formatCurrency(totalRevenue)}
              </h2>
            </div>
            <div className="p-2 bg-secondary-container/20 rounded-lg text-secondary shrink-0">
              <span className="material-symbols-outlined">payments</span>
            </div>
          </div>
          <div className="flex items-center gap-2 relative z-10">
            <span className="px-2 py-1 bg-secondary-container/30 text-secondary text-xs font-semibold rounded flex items-center gap-0.5">
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_upward</span>
              12%
            </span>
            <span className="text-xs text-on-surface-variant">vs last month</span>
          </div>
          <svg
            className="absolute bottom-0 left-0 w-full h-16 text-secondary-fixed opacity-20 group-hover:opacity-40 transition-opacity"
            preserveAspectRatio="none"
            viewBox="0 0 100 30"
          >
            <path
              d="M0,30 L0,25 L10,22 L20,26 L30,15 L40,18 L50,10 L60,15 L70,5 L80,12 L90,2 L100,8 L100,30 Z"
              fill="currentColor"
            />
            <path
              d="M0,25 L10,22 L20,26 L30,15 L40,18 L50,10 L60,15 L70,5 L80,12 L90,2 L100,8"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>

        {/* Pending Quotes */}
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                Pending Quotes
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-on-surface mt-1">
                {pendingQuotes.length}
              </h2>
            </div>
            <div className="p-2 bg-tertiary-container/20 rounded-lg text-on-tertiary-container shrink-0">
              <span className="material-symbols-outlined">request_quote</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-on-surface-variant">
              {Math.min(pendingQuotes.length, 3)} require immediate action
            </span>
            <a
              href="/seller/quotes"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-0.5 shrink-0 ml-2"
            >
              View All
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
            </a>
          </div>
        </div>

        {/* Active Orders */}
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                Active Orders
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-on-surface mt-1">{activeOrders}</h2>
            </div>
            <div className="p-2 bg-primary-container/20 rounded-lg text-on-primary-container shrink-0">
              <span className="material-symbols-outlined">local_shipping</span>
            </div>
          </div>
          <div>
            <div className="w-full bg-surface-container-high rounded-full h-1.5">
              <div
                className="bg-primary h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${progressWidth}%` }}
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs text-on-surface-variant">{shippingOrders.length} shipping</span>
              <span className="text-xs text-on-surface-variant">{processingOrders.length} processing</span>
            </div>
          </div>
        </div>

        {/* Total Products */}
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                Total Products
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-on-surface mt-1">
                {activeProducts.length}
              </h2>
            </div>
            <div className="p-2 bg-surface-variant rounded-lg text-on-surface-variant shrink-0">
              <span className="material-symbols-outlined">inventory_2</span>
            </div>
          </div>
          <span className="px-2 py-1 bg-surface-variant text-on-surface-variant text-xs font-semibold rounded flex items-center gap-1 w-fit">
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>warning</span>
            {draftProducts.length} in draft
          </span>
        </div>
      </div>

      {/* ── Chart + Top Products ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Monthly Revenue Chart */}
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-on-surface">Monthly Revenue</h3>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-xs font-semibold bg-surface-variant text-on-surface rounded-lg hover:bg-surface-container-high transition-colors">
                Weekly
              </button>
              <button className="px-3 py-1 text-xs font-semibold bg-primary text-on-primary rounded-lg shadow-sm">
                Monthly
              </button>
            </div>
          </div>
          <RevenueChart />
        </div>

        {/* Top Selling Products */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-on-surface">Top Selling</h3>
            <a href="/seller/products" className="text-xs font-semibold text-primary hover:underline">
              View Report
            </a>
          </div>

          <div className="flex-1 flex flex-col gap-1">
            {topProducts.map((product, i) => (
              <div
                key={product.id}
                className="flex items-center gap-3 p-2 hover:bg-surface-container-high rounded-lg transition-colors cursor-pointer"
              >
                <div className="w-11 h-11 rounded-lg bg-surface-container-low flex items-center justify-center shrink-0">
                  <span
                    className="material-symbols-outlined text-primary-container"
                    style={{ fontSize: '22px' }}
                  >
                    inventory_2
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-on-surface truncate">{product.name}</p>
                  <p className="text-xs text-on-surface-variant">{product.category}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-mono text-xs font-semibold text-on-surface">
                    {topProductUnits[i]}{' '}
                    <span className="text-on-surface-variant font-normal">units</span>
                  </p>
                  <p className="text-xs text-secondary">+{formatCurrency(topProductRevenue[i] ?? 0)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Category donut */}
          <div className="mt-6 pt-6 border-t border-surface-container-high flex items-center justify-center gap-6">
            <div className="relative w-14 h-14 shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-surface-variant"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="text-primary"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeDasharray="60, 100"
                  strokeWidth="4"
                />
                <path
                  className="text-secondary"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeDasharray="25, 100"
                  strokeDashoffset="-60"
                  strokeWidth="4"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
                Top Category
              </p>
              <p className="text-base font-semibold text-on-surface">
                {topProducts[0]?.category ?? '—'}{' '}
                <span className="text-on-surface-variant text-xs font-normal">(60%)</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Activity Feed ── */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-on-surface">Recent Activity</h3>
          <button className="w-8 h-8 rounded-full hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant transition-colors">
            <span className="material-symbols-outlined">more_vert</span>
          </button>
        </div>

        <div className="flex flex-col relative">
          <div className="absolute left-5 top-2 bottom-2 w-px bg-surface-container-high" />

          {recentOrders.map((order) => {
            const isDelivered = order.status === 'delivered'
            const icon = isDelivered
              ? 'check_circle'
              : order.status === 'shipped'
                ? 'local_shipping'
                : 'shopping_bag'
            const iconStyle = isDelivered
              ? 'bg-secondary-container text-secondary'
              : 'bg-primary-container text-on-primary-container'
            const verb = isDelivered ? 'delivered to' : 'placed by'
            const title = `Order #${order.id.slice(-4).toUpperCase()} ${isDelivered ? 'delivered successfully to' : 'placed by'}`

            return (
              <div
                key={order.id}
                className="flex gap-4 p-4 hover:bg-surface-container-high/50 rounded-xl transition-colors relative z-10 group"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-[0_0_0_4px_white] group-hover:shadow-[0_0_0_4px_#e5eeff] transition-shadow ${iconStyle}`}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                    {icon}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-on-surface">
                    <span className="font-semibold">{title}</span>{' '}
                    <span className="text-primary cursor-pointer hover:underline">
                      {getCompanyName(order.buyer_id)}
                    </span>
                  </p>
                  <p className="text-xs text-on-surface-variant mt-1">{formatDate(order.created_at)}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-mono text-sm font-semibold text-on-surface">
                    {formatCurrency(order.total)}
                  </p>
                  <span
                    className={`px-2 py-0.5 mt-1 text-[10px] font-semibold rounded inline-block ${ORDER_STATUS_COLOR[order.status]}`}
                  >
                    {ORDER_STATUS_LABEL[order.status]}
                  </span>
                </div>
              </div>
            )
          })}

          {firstPendingQuote && (
            <div className="flex gap-4 p-4 hover:bg-surface-container-high/50 rounded-xl transition-colors relative z-10 group">
              <div className="w-10 h-10 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center shrink-0 shadow-[0_0_0_4px_white] group-hover:shadow-[0_0_0_4px_#e5eeff] transition-shadow">
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                  mark_email_unread
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-on-surface">
                  <span className="font-semibold">Quote Request</span> received from{' '}
                  <span className="text-primary cursor-pointer hover:underline">
                    {getCompanyName(firstPendingQuote.buyer_id)}
                  </span>
                </p>
                {firstPendingQuote.buyer_note && (
                  <div className="bg-surface p-3 mt-2 rounded-lg border border-surface-container-high">
                    <p className="text-xs text-on-surface-variant italic line-clamp-2">
                      &ldquo;{firstPendingQuote.buyer_note}&rdquo;
                    </p>
                  </div>
                )}
                <p className="text-xs text-on-surface-variant mt-2">
                  {formatDate(firstPendingQuote.created_at)}
                </p>
              </div>
              <div className="shrink-0">
                <a
                  href="/seller/quotes"
                  className="px-3 py-1.5 bg-surface border border-outline-variant text-on-surface text-xs font-semibold rounded-lg hover:bg-surface-container-high transition-colors inline-block"
                >
                  Respond
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}
