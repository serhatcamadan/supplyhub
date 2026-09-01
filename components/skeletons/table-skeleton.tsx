import { Skeleton } from '@/components/ui/skeleton'

export function TableSkeleton({ rows = 6, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div>
      {/* Controls bar */}
      <div className="flex items-center gap-4 px-4 py-3 border-b border-outline-variant/30">
        <div className="flex gap-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-24 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-9 w-56 rounded-lg ml-auto" />
      </div>
      {/* Table header */}
      <div className="flex gap-4 px-4 py-3 border-b border-outline-variant/20">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-3 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-4 py-4 border-b border-outline-variant/10">
          <Skeleton className="h-8 w-8 rounded-full shrink-0" />
          {Array.from({ length: cols - 1 }).map((_, j) => (
            <Skeleton key={j} className={`h-4 flex-1 ${j === 0 ? 'max-w-40' : ''}`} />
          ))}
          <Skeleton className="h-6 w-16 rounded-full shrink-0" />
        </div>
      ))}
    </div>
  )
}
