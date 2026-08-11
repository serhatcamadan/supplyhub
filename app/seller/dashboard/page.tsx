import { TrendingUp, Package, MessageSquare, ShoppingCart } from 'lucide-react'
import { RevenueChart } from '@/components/seller/revenue-chart'
import { orders, products, quoteRequests } from '@/lib/mock-data'
import { formatCurrency, formatDate } from '@/lib/utils'

function StatCard({
  label,
  value,
  sub,
  icon,
  accent,
}: {
  label: string
  value: string
  sub: string
  icon: React.ReactNode
  accent: string
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
          <p className="text-xs text-slate-400 mt-1">{sub}</p>
        </div>
        <div className={`p-2.5 rounded-lg ${accent}`}>{icon}</div>
      </div>
    </div>
  )
}

const STATUS_LABEL: Record<string, string> = {
  pending: 'Bekliyor',
  confirmed: 'Onaylandı',
  shipped: 'Kargoda',
  delivered: 'Teslim Edildi',
}

const STATUS_COLOR: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700',
  confirmed: 'bg-blue-50 text-blue-700',
  shipped: 'bg-purple-50 text-purple-700',
  delivered: 'bg-green-50 text-green-700',
}

export default function SellerDashboardPage() {
  const activeProducts = products.filter(
    (p) => p.seller_id === 'company-seller-1' && p.status === 'active'
  )
  const pendingQuotes = quoteRequests.filter((q) => q.status === 'pending')
  const sellerOrders = orders.filter((o) => o.seller_id === 'company-seller-1')
  const totalRevenue = sellerOrders
    .filter((o) => o.status === 'delivered')
    .reduce((sum, o) => sum + o.total, 0)

  const recentOrders = [...sellerOrders]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Satış özeti ve son aktiviteler</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Toplam Gelir"
          value={formatCurrency(totalRevenue)}
          sub="Teslim edilen siparişler"
          icon={<TrendingUp size={20} className="text-[#1e3a5f]" />}
          accent="bg-blue-50"
        />
        <StatCard
          label="Aktif Ürün"
          value={String(activeProducts.length)}
          sub="Satışta olan ürünler"
          icon={<Package size={20} className="text-green-700" />}
          accent="bg-green-50"
        />
        <StatCard
          label="Bekleyen Teklif"
          value={String(pendingQuotes.length)}
          sub="Yanıt bekliyor"
          icon={<MessageSquare size={20} className="text-amber-700" />}
          accent="bg-amber-50"
        />
        <StatCard
          label="Toplam Sipariş"
          value={String(sellerOrders.length)}
          sub="Tüm zamanlar"
          icon={<ShoppingCart size={20} className="text-purple-700" />}
          accent="bg-purple-50"
        />
      </div>

      {/* Revenue chart */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
        <h2 className="text-base font-semibold text-slate-900 mb-4">Aylık Gelir (₺)</h2>
        <RevenueChart />
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-base font-semibold text-slate-900 mb-4">Son Siparişler</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left py-2 px-3 text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Sipariş No
                </th>
                <th className="text-left py-2 px-3 text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Tarih
                </th>
                <th className="text-right py-2 px-3 text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Tutar
                </th>
                <th className="text-center py-2 px-3 text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Durum
                </th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="py-3 px-3 font-mono text-slate-600 text-xs">
                    #{order.id.slice(-6).toUpperCase()}
                  </td>
                  <td className="py-3 px-3 text-slate-600">{formatDate(order.created_at)}</td>
                  <td className="py-3 px-3 text-right font-medium text-slate-900">
                    {formatCurrency(order.total)}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLOR[order.status]}`}
                    >
                      {STATUS_LABEL[order.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
