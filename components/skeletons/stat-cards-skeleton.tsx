import { Skeleton } from '@/components/ui/skeleton'

export function StatCardsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-surface-container-lowest p-5 rounded-xl shadow-sm space-y-3">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-9 w-20" />
        </div>
      ))}
    </div>
  )
}
