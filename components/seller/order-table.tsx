import { formatCurrency, formatDate, cn } from '@/lib/utils'
import type { OrderStatus, OrderWithDetails } from '@/types'

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; className: string; dot?: boolean; icon?: string }
> = {
  pending: {
    label: 'Pending',
    className: 'bg-tertiary-container/20 text-on-tertiary-container',
    dot: true,
  },
  confirmed: {
    label: 'Confirmed',
    className: 'bg-primary-fixed-dim/20 text-on-primary-fixed-variant',
    icon: 'check_circle',
  },
  shipped: {
    label: 'Shipped',
    className: 'bg-primary/10 text-primary',
    icon: 'local_shipping',
  },
  delivered: {
    label: 'Delivered',
    className: 'bg-secondary/10 text-secondary',
    icon: 'done_all',
  },
}

const AVATAR_COLORS = [
  'bg-primary-container text-on-primary-container',
  'bg-secondary-container text-on-secondary-container',
  'bg-surface-variant text-on-surface-variant',
  'bg-tertiary-container/50 text-on-tertiary-container',
]

function getInitials(name: string) {
  return name.split(' ').slice(0, 2).map((w) => w[0].toUpperCase()).join('')
}

function formatOrderId(id: string) {
  const num = id.split('-').pop() ?? id
  return `#ORD-${num.padStart(4, '0')}`
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const cfg = STATUS_CONFIG[status]
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold', cfg.className)}>
      {cfg.dot && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
      {cfg.icon && (
        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>{cfg.icon}</span>
      )}
      {cfg.label}
    </span>
  )
}

function RowActions({ status }: { status: OrderStatus }) {
  return (
    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      {status === 'pending' && (
        <button className="px-3 py-1.5 bg-primary text-on-primary text-xs font-semibold rounded-lg hover:bg-primary/90 transition-colors">
          Confirm
        </button>
      )}
      {status === 'confirmed' && (
        <button className="px-3 py-1.5 bg-primary text-on-primary text-xs font-semibold rounded-lg hover:bg-primary/90 transition-colors">
          Ship
        </button>
      )}
      {status === 'shipped' && (
        <button className="px-3 py-1.5 bg-secondary text-on-secondary text-xs font-semibold rounded-lg hover:bg-secondary/90 transition-colors">
          Deliver
        </button>
      )}
      <button className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded-lg transition-colors">
        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>more_vert</span>
      </button>
    </div>
  )
}

export function OrderTable({ orders }: { orders: OrderWithDetails[] }) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead className="sticky top-0 bg-surface-container-lowest z-10 shadow-[0_1px_0_rgba(0,0,0,0.05)]">
            <tr>
              <th className="py-3 px-6 text-xs font-semibold uppercase tracking-wider text-on-surface-variant w-32">
                Order ID
              </th>
              <th className="py-3 px-6 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                Buyer
              </th>
              <th className="py-3 px-6 text-xs font-semibold uppercase tracking-wider text-on-surface-variant w-36">
                Date
              </th>
              <th className="py-3 px-6 text-xs font-semibold uppercase tracking-wider text-on-surface-variant w-24">
                Items
              </th>
              <th className="py-3 px-6 text-xs font-semibold uppercase tracking-wider text-on-surface-variant text-right w-36">
                Total
              </th>
              <th className="py-3 px-6 text-xs font-semibold uppercase tracking-wider text-on-surface-variant w-36">
                Status
              </th>
              <th className="py-3 px-6 text-xs font-semibold uppercase tracking-wider text-on-surface-variant text-right w-36">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-outline-variant/20">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-16 text-center">
                  <span
                    className="material-symbols-outlined block mx-auto mb-3 text-outline-variant"
                    style={{ fontSize: '40px' }}
                  >
                    shopping_bag
                  </span>
                  <span className="text-sm text-on-surface-variant">No orders found.</span>
                </td>
              </tr>
            ) : (
              orders.map((order, i) => {
                const initials = getInitials(order.buyer.name)
                const avatarColor = AVATAR_COLORS[i % AVATAR_COLORS.length]
                const contactEmail = order.created_by_user.email

                return (
                  <tr
                    key={order.id}
                    className="hover:bg-surface-container-low/50 transition-colors group cursor-pointer"
                  >
                    <td className="py-4 px-6">
                      <span className="font-mono text-sm text-primary font-medium">
                        {formatOrderId(order.id)}
                      </span>
                      {order.needs_approval && !order.approved_by && (
                        <p className="text-[10px] text-on-tertiary-container font-semibold mt-0.5">
                          Awaiting approval
                        </p>
                      )}
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0', avatarColor)}>
                          {initials}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-on-surface leading-tight">
                            {order.buyer.name}
                          </p>
                          <p className="text-xs text-on-surface-variant">{contactEmail}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-sm text-on-surface-variant">
                      {formatDate(order.created_at)}
                    </td>

                    <td className="py-4 px-6">
                      <span className="text-sm text-on-surface">{order.items.length}</span>
                      <p className="text-xs text-on-surface-variant mt-0.5 max-w-[120px] truncate">
                        {order.items.map((i) => i.product.name).join(', ')}
                      </p>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <span className="font-mono text-sm font-semibold text-on-surface">
                        {formatCurrency(order.total)}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <StatusBadge status={order.status} />
                    </td>

                    <td className="py-4 px-6">
                      <RowActions status={order.status} />
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-outline-variant/30 flex items-center justify-between bg-surface-container-lowest">
        <span className="text-xs text-on-surface-variant">
          Showing {orders.length} of {orders.length} entries
        </span>
        <div className="flex items-center gap-1">
          <button className="p-1 text-on-surface-variant opacity-50 cursor-not-allowed rounded-md">
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>chevron_left</span>
          </button>
          <button className="w-8 h-8 flex items-center justify-center text-xs font-semibold bg-primary-container text-on-primary-container rounded-md">
            1
          </button>
          <button className="p-1 text-on-surface-variant rounded-md hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  )
}
