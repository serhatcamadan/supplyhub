import { getTranslations } from 'next-intl/server'
import { serverApiFetch } from '@/lib/api/server-client'
import { ApprovalCard } from '@/components/buyer/approval-card'
import { ApprovalStatCards } from '@/components/buyer/approval-stat-cards'
import { Button } from '@/components/ui/button'
import type { OrderWithDetails } from '@/types'
import { IconCircleCheck, IconFilter } from '@tabler/icons-react'

export default async function BuyerApprovalsPage() {
  const t = await getTranslations('buyer')

  let allOrders: OrderWithDetails[] = []
  try {
    allOrders = await serverApiFetch<OrderWithDetails[]>('/orders')
  } catch {
    allOrders = []
  }

  const pendingApprovals = allOrders.filter((o) => o.needs_approval && !o.approved_by)
  const totalValue = pendingApprovals.reduce((sum, o) => sum + o.total, 0)
  const totalItems = pendingApprovals.reduce((sum, o) => sum + o.items.length, 0)

  return (
    <div className="px-8 py-8 max-w-360 mx-auto space-y-8">

      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-on-surface">{t('approvals.heading')}</h1>
          <p className="text-sm text-on-surface-variant mt-2">{t('approvals.subHeading')}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <IconFilter size={18} />
            {t('approvals.filter')}
          </Button>
        </div>
      </div>

      <ApprovalStatCards
        pendingCount={pendingApprovals.length}
        totalItems={totalItems}
        totalValue={totalValue}
      />

      {pendingApprovals.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 py-20 flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 bg-secondary-fixed/20 rounded-full flex items-center justify-center">
            <IconCircleCheck className="text-secondary text-[32px]" />
          </div>
          <div>
            <p className="font-semibold text-on-surface text-lg">{t('approvals.empty.heading')}</p>
            <p className="text-sm text-on-surface-variant mt-1">{t('approvals.empty.subtext')}</p>
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
