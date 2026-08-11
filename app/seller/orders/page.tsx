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

export default function SellerOrdersPage() {
  const allOrders = getOrdersWithDetails().filter((o) => o.seller_id === 'company-seller-1')

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Siparişler</h1>
        <p className="text-sm text-slate-500 mt-1">{allOrders.length} sipariş</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Sipariş</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Alıcı</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Tarih</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Ürünler</th>
              <th className="text-right py-3 px-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Tutar</th>
              <th className="text-center py-3 px-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Durum</th>
            </tr>
          </thead>
          <tbody>
            {allOrders.map((order) => (
              <tr key={order.id} className="border-b border-slate-50 hover:bg-slate-50">
                <td className="py-4 px-4 font-mono text-xs text-slate-500">
                  #{order.id.slice(-6).toUpperCase()}
                </td>
                <td className="py-4 px-4">
                  <p className="font-medium text-slate-900">{order.buyer.name}</p>
                  <p className="text-xs text-slate-400">{order.created_by_user.name}</p>
                </td>
                <td className="py-4 px-4 text-slate-600">{formatDate(order.created_at)}</td>
                <td className="py-4 px-4 text-slate-600">
                  {order.items.length} kalem
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                    {order.items.map((i) => i.product.name).join(', ')}
                  </p>
                </td>
                <td className="py-4 px-4 text-right font-semibold text-slate-900">
                  {formatCurrency(order.total)}
                </td>
                <td className="py-4 px-4 text-center">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLOR[order.status]}`}>
                    {STATUS_LABEL[order.status]}
                  </span>
                  {order.needs_approval && !order.approved_by && (
                    <p className="text-xs text-amber-600 mt-1">Onay bekliyor</p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
