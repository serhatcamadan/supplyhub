import { Skeleton } from '@/components/ui/skeleton'

function CartItemSkeleton() {
  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm p-5 space-y-4">
      <div className="flex items-start gap-4">
        <Skeleton className="h-20 w-20 rounded-lg shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-3 w-1/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
      </div>
      <div className="flex items-center justify-between pt-1">
        <Skeleton className="h-9 w-28 rounded-lg" />
        <Skeleton className="h-6 w-20" />
      </div>
    </div>
  )
}

export default function CartLoading() {
  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)]">
      <div className="flex-1 overflow-y-auto px-4 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Skeleton className="h-7 w-28" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
          {Array.from({ length: 3 }).map((_, i) => (
            <CartItemSkeleton key={i} />
          ))}
        </div>
      </div>
      <div className="w-full lg:w-96 bg-surface-container-lowest border-t lg:border-t-0 lg:border-l border-outline-variant/30 shadow-xl p-6 space-y-4">
        <Skeleton className="h-6 w-32" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex justify-between">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
        <Skeleton className="h-px w-full" />
        <div className="flex justify-between">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-24" />
        </div>
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
    </div>
  )
}
