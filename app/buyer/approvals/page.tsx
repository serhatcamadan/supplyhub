import { getOrdersWithDetails } from '@/lib/mock-data'
import { formatCurrency, formatDate } from '@/lib/utils'
import { AlertCircle } from 'lucide-react'

export default function BuyerApprovalsPage() {
  const pendingApprovals = getOrdersWithDetails().filter(
    (o) => o.buyer_id === 'company-buyer-1' && o.needs_approval && !o.approved_by
  )

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Onay Bekleyenler</h1>
        <p className="text-sm text-slate-500 mt-1">
          {pendingApprovals.length} sipariş yönetici onayı bekliyor
        </p>
      </div>

      {pendingApprovals.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <p className="text-slate-400">Onay bekleyen sipariş yok.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingApprovals.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl border border-amber-200 p-5 shadow-sm"
            >
              <div className="flex items-start gap-3 mb-4">
                <AlertCircle size={18} className="text-amber-500 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-slate-900">
                      Sipariş #{order.id.slice(-6).toUpperCase()}
                    </p>
                    <p className="text-xl font-bold text-slate-900">{formatCurrency(order.total)}</p>
                  </div>
                  <p className="text-sm text-slate-500 mt-0.5">
                    {order.seller.name} · {formatDate(order.created_at)} ·{' '}
                    Oluşturan: {order.created_by_user.name}
                  </p>
                </div>
              </div>

              {/* Items */}
              <div className="border border-slate-100 rounded-lg overflow-hidden mb-4">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left py-2 px-3 text-xs text-slate-400 font-medium">Ürün</th>
                      <th className="text-right py-2 px-3 text-xs text-slate-400 font-medium">Adet</th>
                      <th className="text-right py-2 px-3 text-xs text-slate-400 font-medium">Birim</th>
                      <th className="text-right py-2 px-3 text-xs text-slate-400 font-medium">Toplam</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item) => (
                      <tr key={item.id} className="border-t border-slate-100">
                        <td className="py-2.5 px-3 text-slate-700">{item.product.name}</td>
                        <td className="py-2.5 px-3 text-right text-slate-600">{item.quantity}</td>
                        <td className="py-2.5 px-3 text-right text-slate-600">
                          {formatCurrency(item.unit_price)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-medium text-slate-900">
                          {formatCurrency(item.unit_price * item.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex gap-2">
                <button className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors">
                  Onayla
                </button>
                <button className="px-4 py-2 border border-red-200 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors">
                  Reddet
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
