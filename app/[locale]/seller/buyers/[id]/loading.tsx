import { Skeleton } from '@/components/ui/skeleton'

export default function BuyerDetailLoading() {
  return (
    <div className="p-8 flex flex-col gap-6 max-w-360 mx-auto">

      <Skeleton className="h-4 w-32" />

      <div className="flex items-center gap-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-6 w-28 rounded-md" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-surface-container-lowest p-5 rounded-xl shadow-sm flex items-center gap-4">
            <Skeleton className="h-11 w-11 rounded-lg shrink-0" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
        <div className="px-6 py-4 border-b border-outline-variant/20">
          <Skeleton className="h-5 w-40" />
        </div>
        <div className="p-6 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between gap-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
