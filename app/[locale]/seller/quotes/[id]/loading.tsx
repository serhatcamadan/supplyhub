import { Skeleton } from '@/components/ui/skeleton'

export default function QuoteDetailLoading() {
  return (
    <div className="h-[calc(100vh-4rem)] p-8 flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-end shrink-0 flex-wrap gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-20 rounded-md" />
            <Skeleton className="h-6 w-40 rounded-md" />
          </div>
          <Skeleton className="h-10 w-64" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-24 rounded-lg" />
          <Skeleton className="h-10 w-28 rounded-lg" />
        </div>
      </div>

      {/* Two-panel layout */}
      <div className="flex flex-1 gap-6 min-h-0">
        {/* Left panel */}
        <div className="w-96 bg-surface-container-lowest rounded-xl shadow-sm p-6 flex flex-col gap-5 shrink-0 overflow-y-auto">
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full shrink-0" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <Skeleton className="h-px w-full" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>

        {/* Right panel */}
        <div className="flex-1 bg-surface-container-lowest rounded-xl shadow-sm p-6 flex flex-col gap-4 overflow-y-auto">
          <Skeleton className="h-6 w-36" />
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-1">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            ))}
          </div>
          <Skeleton className="h-28 w-full rounded-lg" />
          <div className="flex gap-3 mt-auto pt-4">
            <Skeleton className="h-10 flex-1 rounded-lg" />
            <Skeleton className="h-10 flex-1 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  )
}
