'use client'

import { useEffect, useRef } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import type { Socket } from 'socket.io-client'
import { connectAuctionSocket } from '@/lib/sockets/auction-socket'
import { useAuctionStore } from '@/lib/stores/useAuctionStore'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Avatar } from '@/components/ui/avatar'
import { CountdownTimer } from '@/components/shared/countdown-timer'
import { AuctionCancelButton } from '@/components/seller/auction-cancel-button'
import type { ApiAuction, ApiBid } from '@/lib/api/auctions'
import { IconGavel, IconTrophy, IconInfoCircle, IconCircleX } from '@tabler/icons-react'

interface NewBidPayload { auction: ApiAuction; bid: ApiBid }
interface AuctionEndedPayload { auctionId: string; reason: 'expired' | 'cancelled'; winnerId?: string | null; finalPrice?: number }

interface AuctionMonitorProps {
  auction: ApiAuction
  bids: ApiBid[]
}

export function AuctionMonitor({ auction, bids }: AuctionMonitorProps) {
  const t = useTranslations('seller')
  const locale = useLocale()
  const store = useAuctionStore()
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    store.setInitial(auction, bids)
    const socket = connectAuctionSocket()
    socketRef.current = socket

    function join() {
      socket.emit('join_auction', { auctionId: auction.id })
    }
    socket.on('connect', join)
    socket.on('new_bid', (payload: NewBidPayload) => store.applyNewBid(payload))
    socket.on('auction_ended', (payload: AuctionEndedPayload) => store.applyAuctionEnded(payload))

    return () => {
      socket.emit('leave_auction', { auctionId: auction.id })
      socket.off('connect', join)
      socket.disconnect()
      store.reset()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auction.id])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-8 flex flex-col gap-4">
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container">
              <IconGavel size={14} />
              {t(`auctions.status.${store.status}`)}
            </span>
            {store.status === 'active' && (
              <div className="text-right">
                <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">{t('auctions.detail.endsIn')}</p>
                <CountdownTimer endsAt={store.endsAt ?? auction.ends_at} className="text-lg" />
              </div>
            )}
          </div>

          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">{t('auctions.detail.currentPrice')}</p>
              <p className="text-4xl font-bold text-primary">{formatCurrency(store.currentPrice, locale)}</p>
              <p className="text-sm text-on-surface-variant mt-1">{t('auctions.detail.bidCount', { count: store.bidCount })}</p>
            </div>
            {store.status === 'active' && <AuctionCancelButton auctionId={auction.id} />}
          </div>

          {store.status === 'ended' && (
            <div className="mt-4 flex items-center gap-2 p-3 rounded-xl bg-secondary-container/40 text-on-secondary-container text-sm font-semibold">
              {store.currentBidderId ? <IconTrophy size={18} /> : <IconInfoCircle size={18} />}
              {store.currentBidderId
                ? `${t('auctions.detail.winnerLabel')}: ${store.currentBidderName}`
                : t('auctions.detail.noBidsEndedLabel')}
            </div>
          )}
          {store.status === 'cancelled' && (
            <div className="mt-4 flex items-center gap-2 p-3 rounded-xl bg-error-container/30 text-error text-sm font-semibold">
              <IconCircleX size={18} />
              {t('auctions.detail.cancelledLabel')}
            </div>
          )}
        </div>

        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 shadow-sm p-6">
          <h2 className="text-base font-semibold text-on-surface border-b border-outline-variant/20 pb-3 mb-4">
            {t('auctions.detail.bidHistoryHeading')}
          </h2>
          {store.recentBids.length === 0 ? (
            <p className="text-sm text-on-surface-variant italic">{t('auctions.detail.noBids')}</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {store.recentBids.map((bid) => (
                <li key={bid.id} className="flex items-center gap-3">
                  <Avatar name={bid.bidder.name} size="sm" colorScheme="secondary" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-on-surface truncate">{bid.bidder.name}</p>
                    <p className="text-xs text-on-surface-variant">{formatDate(bid.created_at, locale)}</p>
                  </div>
                  <span className="font-mono font-semibold text-on-surface">{formatCurrency(bid.amount, locale)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
