import { formatCurrency } from '@/lib/utils'

interface ApprovalStatCardsProps {
  pendingCount: number
  totalItems: number
  totalValue: number
}

export function ApprovalStatCards({ pendingCount, totalItems, totalValue }: ApprovalStatCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm relative overflow-hidden group">
        <div className="absolute right-0 top-0 w-24 h-24 bg-tertiary-container/20 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-2">Awaiting Approval</p>
            <p className="text-4xl font-bold text-on-surface">{pendingCount}</p>
          </div>
          <span className="material-symbols-outlined text-on-tertiary-container bg-tertiary-container/30 p-2 rounded-lg shrink-0">pending_actions</span>
        </div>
      </div>

      <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm relative overflow-hidden group">
        <div className="absolute right-0 top-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-2">Total Items</p>
            <p className="text-4xl font-bold text-on-surface">{totalItems}</p>
          </div>
          <span className="material-symbols-outlined text-primary bg-primary/5 p-2 rounded-lg shrink-0">inventory_2</span>
        </div>
      </div>

      <div className="bg-primary p-5 rounded-xl shadow-md relative overflow-hidden text-on-primary">
        <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-xl -mr-10 -mt-10" />
        <p className="text-xs font-semibold uppercase tracking-wider mb-2 text-on-primary/80">Total Value at Stake</p>
        <p className="text-4xl font-bold tracking-tight relative z-10">{formatCurrency(totalValue)}</p>
      </div>
    </div>
  )
}
