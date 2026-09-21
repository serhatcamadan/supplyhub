import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getTranslations, getLocale } from 'next-intl/server'
import { serverApiFetch, ApiError } from '@/lib/api/server-client'
import { AuctionRoom } from '@/components/buyer/auction-room'
import type { ApiAuction, ApiBid } from '@/lib/api/auctions'
import { IconArrowLeft } from '@tabler/icons-react'

export default async function BuyerAuctionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [t, locale] = await Promise.all([getTranslations('buyer'), getLocale()])

  let auction: ApiAuction
  let bids: ApiBid[]
  try {
    ;[auction, bids] = await Promise.all([
      serverApiFetch<ApiAuction>(`/auctions/${id}`),
      serverApiFetch<ApiBid[]>(`/auctions/${id}/bids`),
    ])
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound()
    throw err
  }

  return (
    <div className="px-8 py-8 max-w-360 mx-auto">
      <div className="mb-8">
        <Link
          href={`/${locale}/buyer/auctions`}
          className="inline-flex items-center gap-2 text-sm text-on-surface-variant hover:text-on-surface transition-colors mb-4"
        >
          <IconArrowLeft size={16} />
          {t('auctions.detail.back')}
        </Link>
        <h1 className="text-3xl font-bold text-on-surface">{auction.product.name}</h1>
      </div>

      <AuctionRoom auction={auction} bids={bids} />
    </div>
  )
}
