import { Skeleton } from '@/components/ui/skeleton'

export default function QuoteDetailLoading() {
  return (
    <div className="px-8 py-8 max-w-360 mx-auto">

      <div className="mb-8">
        <Skeleton className="h-4 w-32 mb-4" />
        <Skeleton className="h-9 w-56" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        <div className="lg:col-span-8 space-y-4">
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 shadow-sm p-6 flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-lg shrink-0" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 shadow-sm p-6 space-y-4">
            <Skeleton className="h-5 w-40" />
            <div className="flex gap-8">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-16 w-full rounded-xl" />
          </div>

          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 shadow-sm p-6 space-y-4">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-20 w-full rounded-xl" />
          </div>
        </div>

        <div className="lg:col-span-4 space-y-4">
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 shadow-sm p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            <Skeleton className="h-px w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>

      </div>
    </div>
  )
}
