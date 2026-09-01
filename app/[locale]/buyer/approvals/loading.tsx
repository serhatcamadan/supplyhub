import { Skeleton } from '@/components/ui/skeleton'
import { PageHeaderSkeleton } from '@/components/skeletons/page-header-skeleton'
import { StatCardsSkeleton } from '@/components/skeletons/stat-cards-skeleton'

function ApprovalCardSkeleton() {
  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-6 w-24" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Skeleton className="h-9 w-24 rounded-lg" />
        <Skeleton className="h-9 w-24 rounded-lg" />
      </div>
    </div>
  )
}

export default function ApprovalsLoading() {
  return (
    <div className="px-8 py-8 max-w-360 mx-auto space-y-8">
      <PageHeaderSkeleton actionCount={1} />
      <StatCardsSkeleton count={3} />
      <div className="space-y-5">
        {Array.from({ length: 3 }).map((_, i) => (
          <ApprovalCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
