import { PageHeaderSkeleton } from '@/components/skeletons/page-header-skeleton'
import { TableSkeleton } from '@/components/skeletons/table-skeleton'
import { Skeleton } from '@/components/ui/skeleton'

export default function SellerProductsLoading() {
  return (
    <div className="p-8 flex flex-col gap-6">
      <PageHeaderSkeleton actionCount={1} />
      {/* Product controls bar */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-64 rounded-lg" />
        <Skeleton className="h-10 w-32 rounded-lg" />
        <Skeleton className="h-4 w-32 ml-auto" />
      </div>
      <div className="bg-surface-container-lowest rounded-xl shadow-md overflow-hidden">
        <TableSkeleton rows={8} cols={6} />
      </div>
    </div>
  )
}
