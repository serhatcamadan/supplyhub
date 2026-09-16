import { Skeleton } from '@/components/ui/skeleton'

export default function OrderDetailLoading() {
  return (
    <div className="p-8 flex flex-col gap-6 max-w-360 mx-auto">

      <div className="flex justify-between items-end flex-wrap gap-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-24" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
          <Skeleton className="h-3 w-32" />
        </div>
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 p-6 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between gap-4">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-10" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 p-6 flex flex-col gap-4">
            <div>
              <Skeleton className="h-3 w-16 mb-2" />
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-4 w-28" />
              </div>
            </div>
            <div className="border-t border-outline-variant/20 pt-4">
              <Skeleton className="h-3 w-24 mb-2" />
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-36" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
