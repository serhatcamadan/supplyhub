import { Skeleton } from '@/components/ui/skeleton'

export default function BuyerAuctionDetailLoading() {
  return (
    <div className="px-8 py-8 max-w-360 mx-auto">
      <div className="mb-8 space-y-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-9 w-96" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-6 space-y-4">
            <div className="flex justify-between">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-8 w-20" />
            </div>
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-6 space-y-3">
            <Skeleton className="h-5 w-32" />
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        </div>
        <div className="lg:col-span-4">
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-6 space-y-4">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-11 w-full rounded-lg" />
            <Skeleton className="h-11 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  )
}
