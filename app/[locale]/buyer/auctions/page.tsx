import { getTranslations } from 'next-intl/server'
import { serverApiFetch } from '@/lib/api/server-client'
import { AuctionCard } from '@/components/buyer/auction-card'
import type { ApiAuction } from '@/lib/api/auctions'
import { IconGavel } from '@tabler/icons-react'

export default async function BuyerAuctionsPage() {
  const t = await getTranslations('buyer')

  let auctions: ApiAuction[] = []
  try {
    auctions = await serverApiFetch<ApiAuction[]>('/auctions?status=active')
  } catch {
    auctions = []
  }

  return (
    <div className="p-8 flex flex-col gap-10">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-on-surface">{t('auctions.list.heading')}</h1>
        <p className="text-sm text-on-surface-variant mt-2 max-w-2xl">{t('auctions.list.subHeading')}</p>
      </div>

      {auctions.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {auctions.map((auction) => (
            <AuctionCard key={auction.id} auction={auction} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-on-surface-variant">
          <IconGavel size={48} />
          <p className="text-sm">{t('auctions.list.empty')}</p>
        </div>
      )}
    </div>
  )
}
