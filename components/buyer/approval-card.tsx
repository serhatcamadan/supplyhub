import { Avatar } from '@/components/ui/avatar'
import { formatCurrency, formatDate, getInitials } from '@/lib/utils'
import type { OrderWithDetails } from '@/types'

interface ApprovalCardProps {
  order: OrderWithDetails
}

export function ApprovalCard({ order }: ApprovalCardProps) {
  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-tertiary-container/40 overflow-hidden">

      {/* Card header */}
      <div className="px-6 py-4 border-b border-outline-variant/20 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-on-tertiary-container bg-tertiary-container/30 p-1.5 rounded-lg text-[18px]">pending_actions</span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Order</p>
              <p className="text-sm font-bold text-on-surface font-mono">
                #{order.id.slice(-8).toUpperCase()}
              </p>
            </div>
          </div>

          <div className="w-px h-8 bg-outline-variant/30" />

          <div className="flex items-center gap-2.5">
            <Avatar name={order.seller.name} size="sm" colorScheme="surface" />
            <div>
              <p className="text-xs font-semibold text-on-surface-variant">Supplier</p>
              <p className="text-sm font-semibold text-on-surface">{order.seller.name}</p>
            </div>
          </div>

          <div className="w-px h-8 bg-outline-variant/30" />

          <div className="flex items-center gap-2.5">
            <Avatar name={order.created_by_user.name} size="sm" colorScheme="secondary" />
            <div>
              <p className="text-xs font-semibold text-on-surface-variant">Requested by</p>
              <p className="text-sm font-semibold text-on-surface">{order.created_by_user.name}</p>
            </div>
          </div>

          <div className="w-px h-8 bg-outline-variant/30" />

          <div>
            <p className="text-xs font-semibold text-on-surface-variant">Date</p>
            <p className="text-sm text-on-surface">{formatDate(order.created_at)}</p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-0.5">Order Total</p>
          <p className="text-2xl font-bold text-on-surface">{formatCurrency(order.total)}</p>
        </div>
      </div>

      {/* Items table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-container-low border-b border-outline-variant/20">
              <th className="text-left py-2.5 px-6 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Product</th>
              <th className="text-right py-2.5 px-4 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Qty</th>
              <th className="text-right py-2.5 px-4 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Unit Price</th>
              <th className="text-right py-2.5 px-6 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Line Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, i) => (
              <tr
                key={item.id}
                className={`hover:bg-surface-container transition-colors ${i < order.items.length - 1 ? 'border-b border-outline-variant/10' : ''}`}
              >
                <td className="py-3 px-6 font-medium text-on-surface">{item.product.name}</td>
                <td className="py-3 px-4 text-right text-on-surface-variant">{item.quantity.toLocaleString('tr-TR')}</td>
                <td className="py-3 px-4 text-right text-on-surface-variant">{formatCurrency(item.unit_price)}</td>
                <td className="py-3 px-6 text-right font-semibold text-on-surface">{formatCurrency(item.unit_price * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Actions footer */}
      <div className="px-6 py-4 border-t border-outline-variant/20 bg-surface-container-low flex items-center justify-between gap-4">
        <p className="text-xs text-on-surface-variant flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[15px]">info</span>
          This order exceeds the staff spending limit and requires admin approval.
        </p>
        <div className="flex items-center gap-3">
          <button className="h-9 px-5 inline-flex items-center gap-2 border border-error/30 text-error text-sm font-semibold rounded-lg hover:bg-error-container/40 transition-colors">
            <span className="material-symbols-outlined text-[18px]">cancel</span>
            Reject
          </button>
          <button className="h-9 px-5 inline-flex items-center gap-2 bg-secondary text-on-secondary text-sm font-semibold rounded-lg hover:bg-secondary/90 transition-colors shadow-sm">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            Approve
          </button>
        </div>
      </div>
    </div>
  )
}
