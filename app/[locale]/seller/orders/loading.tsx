import { PageHeaderSkeleton } from '@/components/skeletons/page-header-skeleton'
import { StatCardsSkeleton } from '@/components/skeletons/stat-cards-skeleton'
import { TableSkeleton } from '@/components/skeletons/table-skeleton'

export default function SellerOrdersLoading() {
  return (
    <div className="p-8 flex flex-col gap-8">
      <PageHeaderSkeleton actionCount={2} />
      <StatCardsSkeleton count={4} />
      <div className="bg-surface-container-lowest rounded-xl shadow-md flex flex-col overflow-hidden">
        <TableSkeleton rows={7} cols={5} />
      </div>
    </div>
  )
}
