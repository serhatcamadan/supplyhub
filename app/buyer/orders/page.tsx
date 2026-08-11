import { getOrdersWithDetails } from '@/lib/mock-data'
import { formatCurrency, formatDate } from '@/lib/utils'

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

export default function BuyerOrdersPage() {
  const orders = getOrdersWithDetails().filter((o) => o.buyer_id === 'company-buyer-1')

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Siparişlerim</h1>
        <p className="text-sm text-slate-500 mt-1">{orders.length} sipariş</p>
      </div>

      <div className="space-y-3">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-mono text-xs text-slate-400">
                    #{order.id.slice(-6).toUpperCase()}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLOR[order.status]}`}
                  >
                    {STATUS_LABEL[order.status]}
                  </span>
                  {order.needs_approval && !order.approved_by && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
                      Onay Bekliyor
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-500">
                  {order.seller.name} · {formatDate(order.created_at)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-slate-900">{formatCurrency(order.total)}</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Oluşturan: {order.created_by_user.name}
                </p>
              </div>
            </div>

            {/* Items */}
            <div className="border-t border-slate-100 pt-3 space-y-1.5">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <span className="text-slate-700">{item.product.name}</span>
                  <div className="text-right">
                    <span className="text-slate-500 text-xs">{item.quantity} adet × </span>
                    <span className="font-medium text-slate-900">{formatCurrency(item.unit_price)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex gap-2">
              <button className="px-3 py-1.5 text-xs font-medium border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors">
                Tekrar Sipariş Ver
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
