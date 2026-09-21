import { PageHeaderSkeleton } from '@/components/skeletons/page-header-skeleton'
import { ProductGridSkeleton } from '@/components/skeletons/product-grid-skeleton'

export default function BuyerAuctionsLoading() {
  return (
    <div className="p-8 flex flex-col gap-10">
      <PageHeaderSkeleton withActions={false} />
      <ProductGridSkeleton count={8} />
    </div>
  )
}
