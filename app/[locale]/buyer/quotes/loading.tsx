import { Skeleton } from '@/components/ui/skeleton'

export default function BuyerQuotesLoading() {
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Header + stats */}
      <div className="px-8 py-6 border-b border-outline-variant/20 bg-surface-container-lowest">
        <div className="flex items-end justify-between max-w-360 mx-auto">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-36 rounded-lg" />
        </div>
        <div className="flex gap-6 mt-6 max-w-360 mx-auto">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-surface-container rounded-xl px-5 py-3 border border-outline-variant/20 space-y-1">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-7 w-10" />
            </div>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 min-h-0 max-w-360 mx-auto w-full px-8 py-6">
        <div className="flex-1 min-h-0 bg-surface-container-lowest rounded-2xl border border-outline-variant/20 shadow-sm overflow-hidden">
          {/* Table header */}
          <div className="flex gap-4 px-6 py-4 border-b border-outline-variant/20">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-3 flex-1" />
            ))}
          </div>
          {/* Rows */}
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-outline-variant/10">
              <Skeleton className="h-8 w-8 rounded-full shrink-0" />
              {Array.from({ length: 4 }).map((_, j) => (
                <Skeleton key={j} className="h-4 flex-1" />
              ))}
              <Skeleton className="h-6 w-20 rounded-full shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
