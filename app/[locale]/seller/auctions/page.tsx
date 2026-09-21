import Link from 'next/link'
import { getTranslations, getLocale } from 'next-intl/server'
import { serverApiFetch } from '@/lib/api/server-client'
import { buttonVariants } from '@/components/ui/button'
import { AuctionCancelButton } from '@/components/seller/auction-cancel-button'
import { CountdownTimer } from '@/components/shared/countdown-timer'
import { formatCurrency } from '@/lib/utils'
import type { ApiAuction } from '@/lib/api/auctions'
import { IconGavel, IconPlus } from '@tabler/icons-react'

const STATUS_BADGE: Record<string, string> = {
  active:    'bg-secondary-container text-on-secondary-container',
  ended:     'bg-surface-container-high text-on-surface-variant',
  cancelled: 'bg-error-container/30 text-error',
}

export default async function SellerAuctionsPage() {
  const [t, locale] = await Promise.all([getTranslations('seller'), getLocale()])

  let auctions: ApiAuction[] = []
  try {
    auctions = await serverApiFetch<ApiAuction[]>('/seller/auctions')
  } catch {
    auctions = []
  }

  return (
    <div className="px-8 py-8 max-w-360 mx-auto flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-on-surface">{t('auctions.list.heading')}</h1>
          <p className="text-sm text-on-surface-variant mt-1">{t('auctions.list.subHeading')}</p>
        </div>
        <Link href={`/${locale}/seller/auctions/new`} className={buttonVariants({ variant: 'primary' })}>
          <IconPlus size={18} />
          {t('auctions.list.newAuction')}
        </Link>
      </div>

      {auctions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-on-surface-variant">
          <IconGavel size={48} />
          <p className="text-sm">{t('auctions.list.empty')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {auctions.map((auction) => (
            <div key={auction.id} className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-sm p-5 flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <Link href={`/${locale}/seller/auctions/${auction.id}`} className="font-semibold text-on-surface hover:text-primary transition-colors line-clamp-2">
                  {auction.product.name}
                </Link>
                <span className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${STATUS_BADGE[auction.status]}`}>
                  {t(`auctions.status.${auction.status}`)}
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-primary">{formatCurrency(auction.current_price, locale)}</span>
                <span className="text-xs text-on-surface-variant">{t('auctions.detail.bidCount', { count: auction.bid_count })}</span>
              </div>

              {auction.status === 'active' && (
                <CountdownTimer endsAt={auction.ends_at} className="text-sm" />
              )}

              <div className="flex items-center justify-between mt-2 pt-3 border-t border-outline-variant/10">
                <Link href={`/${locale}/seller/auctions/${auction.id}`} className="text-sm font-semibold text-primary hover:underline">
                  {t('auctions.detail.monitorHeading')}
                </Link>
                {auction.status === 'active' && <AuctionCancelButton auctionId={auction.id} />}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
