import { formatCurrency, formatDate, cn } from '@/lib/utils'
import type { OrderWithDetails } from '@/types'

type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered'

const STATUS_CONFIG: Record<OrderStatus, { label: string; dot: string; badge: string }> = {
  delivered: {
    label: 'Teslim Edildi',
    dot: 'bg-secondary',
    badge: 'bg-secondary-container/20 text-secondary',
  },
  shipped: {
    label: 'Kargoda',
    dot: 'bg-on-tertiary-container',
    badge: 'bg-tertiary-container/20 text-on-tertiary-container',
  },
  confirmed: {
    label: 'Onaylandı',
    dot: 'bg-primary-fixed-dim',
    badge: 'bg-primary-container/20 text-on-primary-container',
  },
  pending: {
    label: 'İşleniyor',
    dot: 'bg-outline',
    badge: 'bg-surface-container-high text-on-surface-variant',
  },
}

const COLUMNS = ['Sipariş No', 'Tedarikçi', 'Sipariş Tarihi', 'Tutar', 'Durum', 'İşlem']

function initials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const cfg = STATUS_CONFIG[status]
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider',
        cfg.badge
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full mr-1.5', cfg.dot)} />
      {cfg.label}
    </span>
  )
}

export function OrderHistoryTable({ orders }: { orders: OrderWithDetails[] }) {
  return (
    <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-180">
          <thead>
            <tr className="bg-surface-container-low border-b border-outline-variant/20">
              {COLUMNS.map((h, i) => (
                <th
                  key={h}
                  className={cn(
                    'px-6 py-4 text-xs font-semibold uppercase tracking-wider text-on-surface-variant whitespace-nowrap',
                    i >= 3 && i !== 4 ? 'text-right' : ''
                  )}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-16 text-center text-sm text-on-surface-variant">
                  Sipariş bulunamadı.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-outline-variant/10 hover:bg-surface-container-lowest/50 transition-colors group cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-mono text-sm text-primary font-medium">
                      #{order.id.toUpperCase()}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-xs font-semibold text-on-surface shrink-0">
                        {initials(order.seller.name)}
                      </div>
                      <span className="text-sm font-medium text-on-surface">{order.seller.name}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-variant">
                    {formatDate(order.created_at)}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="text-sm font-semibold text-on-surface">
                      {formatCurrency(order.total)}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={order.status as OrderStatus} />
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-low hover:bg-primary hover:text-on-primary text-primary rounded-lg text-xs font-semibold uppercase tracking-wider transition-all opacity-0 group-hover:opacity-100 focus:opacity-100">
                      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>refresh</span>
                      Tekrar Sipariş
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 border-t border-outline-variant/20 flex items-center justify-between">
        <span className="text-xs text-on-surface-variant">
          {orders.length} siparişten {Math.min(orders.length, 5)} tanesi gösteriliyor
        </span>
        <div className="flex items-center gap-2">
          <button
            disabled
            className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors disabled:opacity-40"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 rounded-lg bg-primary text-on-primary text-xs font-semibold flex items-center justify-center">
              1
            </button>
          </div>
          <button className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  )
}
