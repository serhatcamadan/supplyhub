import { serverApiFetch } from '@/lib/api/server-client'
import { ApprovalsContent } from '@/components/buyer/approvals-content'
import type { OrderWithDetails } from '@/types'

export default async function BuyerApprovalsPage() {
  let allOrders: OrderWithDetails[] = []
  try {
    allOrders = await serverApiFetch<OrderWithDetails[]>('/orders')
  } catch {
    allOrders = []
  }

  const pendingApprovals = allOrders.filter((o) => o.needs_approval && !o.approved_by)

  return (
    <div className="px-8 py-8 max-w-360 mx-auto space-y-8">
      <ApprovalsContent pendingApprovals={pendingApprovals} />
    </div>
  )
}
