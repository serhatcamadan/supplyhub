import { formatCurrency, formatDate, cn } from '@/lib/utils'
import type { OrderStatus, OrderWithDetails } from '@/types'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { TablePagination } from '@/components/ui/table-pagination'
import { TableEmptyRow } from '@/components/ui/table-empty-row'

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

const AVATAR_COLOR_SCHEMES = [
  'bg-primary-container text-on-primary-container',
  'bg-secondary-container text-on-secondary-container',
  'bg-surface-variant text-on-surface-variant',
  'bg-tertiary-container/50 text-on-tertiary-container',
]

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
      {status === 'pending' && <Button variant="primary" size="sm">Confirm</Button>}
      {status === 'confirmed' && <Button variant="primary" size="sm">Ship</Button>}
      {status === 'shipped' && <Button variant="secondary" size="sm">Deliver</Button>}
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
        <table className="w-full text-left border-collapse min-w-200">
          <thead className="sticky top-0 bg-surface-container-lowest z-10 shadow-[0_1px_0_rgba(0,0,0,0.05)]">
            <tr>
              {['Order ID', 'Buyer', 'Date', 'Items', 'Total', 'Status', 'Actions'].map((h, i) => (
                <th
                  key={h}
                  className={cn(
                    'py-3 px-6 text-xs font-semibold uppercase tracking-wider text-on-surface-variant',
                    i === 4 && 'text-right',
                    i === 6 && 'text-right'
                  )}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-outline-variant/20">
            {orders.length === 0 ? (
              <TableEmptyRow icon="shopping_bag" message="No orders found." colSpan={7} />
            ) : (
              orders.map((order, i) => (
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
                      <Avatar
                        name={order.buyer.name}
                        size="sm"
                        className={AVATAR_COLOR_SCHEMES[i % AVATAR_COLOR_SCHEMES.length]}
                      />
                      <div>
                        <p className="text-sm font-semibold text-on-surface leading-tight">
                          {order.buyer.name}
                        </p>
                        <p className="text-xs text-on-surface-variant">
                          {order.created_by_user.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-6 text-sm text-on-surface-variant">
                    {formatDate(order.created_at)}
                  </td>

                  <td className="py-4 px-6">
                    <span className="text-sm text-on-surface">{order.items.length}</span>
                    <p className="text-xs text-on-surface-variant mt-0.5 max-w-30 truncate">
                      {order.items.map((item) => item.product.name).join(', ')}
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
              ))
            )}
          </tbody>
        </table>
      </div>

      <TablePagination label={`Showing ${orders.length} of ${orders.length} entries`} />
    </div>
  )
}
