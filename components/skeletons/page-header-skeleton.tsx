import { Skeleton } from '@/components/ui/skeleton'

export function PageHeaderSkeleton({
  withActions = true,
  actionCount = 2,
}: {
  withActions?: boolean
  actionCount?: number
}) {
  return (
    <div className="flex items-start justify-between flex-wrap gap-4">
      <div className="space-y-2">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-4 w-80" />
      </div>
      {withActions && (
        <div className="flex gap-3">
          {Array.from({ length: actionCount }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-28 rounded-lg" />
          ))}
        </div>
      )}
    </div>
  )
}
