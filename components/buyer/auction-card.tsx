import Link from 'next/link'
import { getTranslations, getLocale } from 'next-intl/server'
import { formatCurrency } from '@/lib/utils'
import { CountdownTimer } from '@/components/shared/countdown-timer'
import type { ApiAuction } from '@/lib/api/auctions'
import { IconBuildingStore, IconPhoto, IconGavel } from '@tabler/icons-react'

interface AuctionCardProps {
  auction: ApiAuction
}

export async function AuctionCard({ auction }: AuctionCardProps) {
  const [t, locale] = await Promise.all([getTranslations('buyer'), getLocale()])
  const image = auction.product.images[0] ?? auction.product.image_url

  return (
    <Link
      href={`/${locale}/buyer/auctions/${auction.id}`}
      className="group bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col relative"
    >
      <div className="absolute top-4 left-4 z-10">
        <span className="inline-flex items-center gap-1 bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider shadow-sm">
          <IconGavel size={12} />
          {t('auctions.status.active')}
        </span>
      </div>

      <div className="relative w-full h-52 bg-surface-container overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={auction.product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <IconPhoto size={52} className="text-on-surface-variant/20" />
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1 gap-4">
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <IconBuildingStore size={14} className="text-primary" />
            <span className="text-xs text-on-surface-variant line-clamp-1">{auction.product.companies.name}</span>
          </div>
          <h3 className="text-sm font-semibold text-on-surface line-clamp-2 leading-5">{auction.product.name}</h3>
        </div>

        <div className="mt-auto pt-3 border-t border-surface-container flex flex-col gap-2">
          <div className="flex items-baseline gap-1">
            <span className="text-xs text-on-surface-variant uppercase font-semibold tracking-wider">{t('auctions.card.currentPrice')}</span>
            <span className="text-xl font-bold text-primary">{formatCurrency(auction.current_price, locale)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-on-surface-variant bg-surface-container px-2 py-1 rounded-lg">
              {t('auctions.card.bidCount', { count: auction.bid_count })}
            </span>
            <CountdownTimer endsAt={auction.ends_at} className="text-xs" />
          </div>
        </div>
      </div>
    </Link>
  )
}
