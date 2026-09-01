import { PageHeaderSkeleton } from '@/components/skeletons/page-header-skeleton'
import { StatCardsSkeleton } from '@/components/skeletons/stat-cards-skeleton'
import { TableSkeleton } from '@/components/skeletons/table-skeleton'

export default function BuyerOrdersLoading() {
  return (
    <div className="px-8 py-8 max-w-360 mx-auto space-y-8">
      <PageHeaderSkeleton actionCount={2} />
      <StatCardsSkeleton count={3} />
      <div className="bg-surface-container-lowest rounded-xl shadow-md overflow-hidden">
        <TableSkeleton rows={7} cols={5} />
      </div>
    </div>
  )
}
