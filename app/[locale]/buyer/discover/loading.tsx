import { Skeleton } from '@/components/ui/skeleton'
import { ProductGridSkeleton } from '@/components/skeletons/product-grid-skeleton'

export default function BuyerDiscoverLoading() {
  return (
    <div className="p-8 flex flex-col gap-10">
      {/* Header + search bar */}
      <div className="flex flex-col gap-6">
        <div className="flex items-start justify-between gap-6">
          <div className="space-y-2">
            <Skeleton className="h-10 w-56" />
            <Skeleton className="h-4 w-80" />
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Skeleton className="h-10 w-56 rounded-lg" />
            <Skeleton className="h-10 w-24 rounded-lg" />
          </div>
        </div>
        {/* Category chips */}
        <div className="flex gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-24 rounded-full" />
          ))}
        </div>
      </div>

      <ProductGridSkeleton count={8} />
    </div>
  )
}
