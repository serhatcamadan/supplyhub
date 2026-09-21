import { Skeleton } from '@/components/ui/skeleton'

export default function NewAuctionLoading() {
  return (
    <div className="flex flex-col w-full min-h-full">
      <div className="flex items-center justify-between px-8 py-8 border-b border-outline-variant/20 bg-surface">
        <div className="space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-24 rounded-lg" />
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
      </div>
      <div className="flex-1 px-8 py-8">
        <div className="max-w-160 mx-auto bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-8 space-y-6">
          <Skeleton className="h-5 w-40" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-11 w-full rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
