import { Skeleton } from '@/components/ui/skeleton'

export default function NewProductLoading() {
  return (
    <div className="flex flex-col w-full min-h-full">
      <div className="flex items-center justify-between px-8 py-8 border-b border-outline-variant/20 bg-surface">
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-8 w-52" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-28 rounded-lg" />
          <Skeleton className="h-10 w-36 rounded-lg" />
        </div>
      </div>
      <div className="flex gap-8 px-8 py-8 max-w-5xl mx-auto w-full">
        <div className="flex-1 space-y-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 shadow-sm p-6 space-y-4">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-24 w-full rounded-lg" />
            </div>
          ))}
        </div>
        <div className="w-72 space-y-4">
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 shadow-sm p-6 space-y-3">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-40 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  )
}
