import { Skeleton } from '@/components/ui/skeleton'

export default function ProductDetailLoading() {
  return (
    <div className="p-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-4 w-32" />
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Left: Gallery + Tabs */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Gallery */}
          <div className="space-y-3">
            <Skeleton className="aspect-[4/3] w-full rounded-xl" />
            <div className="flex gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square w-20 rounded-lg" />
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div>
            <div className="flex gap-1 border-b border-outline-variant/30 mb-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-28 rounded-t-lg" />
              ))}
            </div>
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
          </div>
        </div>

        {/* Right: Order Panel + Seller Card */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          {/* Order Panel */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-6 space-y-4">
            <Skeleton className="h-7 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="space-y-2 pt-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full rounded-lg" />
              ))}
            </div>
            <div className="flex items-center gap-3 pt-2">
              <Skeleton className="h-12 flex-1 rounded-xl" />
              <Skeleton className="h-12 w-12 rounded-xl" />
            </div>
          </div>

          {/* Seller Card */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
