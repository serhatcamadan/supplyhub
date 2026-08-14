import { getOrdersWithDetails } from '@/lib/mock-data'
import { formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { OrderStatCards } from '@/components/buyer/order-stat-cards'
import { OrderHistoryTable } from '@/components/buyer/order-history-table'

export default function BuyerOrdersPage() {
  const orders = getOrdersWithDetails().filter((o) => o.buyer_id === 'company-buyer-1')

  const totalSpend = orders.reduce((sum, o) => sum + o.total, 0)
  const inTransit  = orders.filter((o) => o.status === 'shipped').length

  return (
    <div className="px-8 py-8 max-w-360 mx-auto space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-bold text-on-surface">Sipariş Geçmişi</h1>
          <p className="text-sm text-on-surface-variant mt-2">
            Geçmiş toptan alımlarınızı takip edin, yönetin ve tekrar sipariş verin.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" size="md">
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>download</span>
            CSV İndir
          </Button>
          <Button variant="primary" size="md">
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>filter_list</span>
            Filtrele
          </Button>
        </div>
      </div>

      <OrderStatCards
        totalOrders={orders.length}
        totalSpend={formatCurrency(totalSpend)}
        inTransit={inTransit}
      />

      <OrderHistoryTable orders={orders} />
    </div>
  )
}
