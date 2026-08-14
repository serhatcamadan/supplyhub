import { getOrdersWithDetails } from '@/lib/mock-data'
import { ApprovalCard } from '@/components/buyer/approval-card'
import { ApprovalStatCards } from '@/components/buyer/approval-stat-cards'

const BUYER_ID = 'company-buyer-1'

export default function BuyerApprovalsPage() {
  const pendingApprovals = getOrdersWithDetails().filter(
    (o) => o.buyer_id === BUYER_ID && o.needs_approval && !o.approved_by
  )

  const totalValue = pendingApprovals.reduce((sum, o) => sum + o.total, 0)
  const totalItems = pendingApprovals.reduce((sum, o) => sum + o.items.length, 0)

  return (
    <div className="px-8 py-8 max-w-360 mx-auto space-y-8">

      {/* Header */}
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-on-surface">Pending Approvals</h1>
          <p className="text-sm text-on-surface-variant mt-2">
            Review and approve orders submitted by staff members that exceed spending limits.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="h-10 px-4 inline-flex items-center gap-2 bg-surface text-on-surface border border-outline-variant rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-surface-container-low transition-colors shadow-sm">
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>filter_list</span>
            Filter
          </button>
        </div>
      </div>

      <ApprovalStatCards
        pendingCount={pendingApprovals.length}
        totalItems={totalItems}
        totalValue={totalValue}
      />

      {/* Approvals list */}
      {pendingApprovals.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 py-20 flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 bg-secondary-fixed/20 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-secondary text-[32px]">check_circle</span>
          </div>
          <div>
            <p className="font-semibold text-on-surface text-lg">All caught up!</p>
            <p className="text-sm text-on-surface-variant mt-1">No orders are waiting for your approval right now.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {pendingApprovals.map((order) => (
            <ApprovalCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  )
}
