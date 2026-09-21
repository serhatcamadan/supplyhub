'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import type { Socket } from 'socket.io-client'
import { connectAuctionSocket } from '@/lib/sockets/auction-socket'
import { useAuctionStore } from '@/lib/stores/useAuctionStore'
import { getCurrentUserFromCookie } from '@/lib/auth/client'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { CountdownTimer } from '@/components/shared/countdown-timer'
import type { ApiAuction, ApiBid } from '@/lib/api/auctions'
import {
  IconGavel, IconCircleCheck, IconCircleX, IconInfoCircle, IconLoader2,
} from '@tabler/icons-react'

interface BidAck {
  ok: boolean
  code?: string
  message?: string
  currentPrice?: number
}

interface NewBidPayload { auction: ApiAuction; bid: ApiBid }
interface AuctionEndedPayload { auctionId: string; reason: 'expired' | 'cancelled'; winnerId?: string | null; finalPrice?: number }

interface AuctionRoomProps {
  auction: ApiAuction
  bids: ApiBid[]
}

export function AuctionRoom({ auction, bids }: AuctionRoomProps) {
  const t = useTranslations('buyer')
  const locale = useLocale()

  const store = useAuctionStore()
  const socketRef = useRef<Socket | null>(null)
  const [bidInput, setBidInput] = useState(String(auction.current_price + 1))
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [justPlaced, setJustPlaced] = useState(false)

  const currentUser = getCurrentUserFromCookie()
  const isSeller = currentUser?.companyType === 'seller'
  const isOwnAuction = currentUser?.companyId === auction.product.companies.id

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

  function mapErrorCode(code: string | undefined): string {
    switch (code) {
      case 'too_low': return t('auctions.detail.errors.too_low')
      case 'not_active': return t('auctions.detail.errors.not_active')
      case 'own_auction': return t('auctions.detail.errors.own_auction')
      case 'unauthorized': return t('auctions.detail.errors.unauthorized')
      default: return t('auctions.detail.errors.unknown')
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const amount = parseFloat(bidInput)
    if (isNaN(amount) || !socketRef.current) return

    setSubmitting(true)
    setError(null)
    socketRef.current.timeout(5000).emit('place_bid', { auctionId: auction.id, amount }, (timeoutErr: Error | null, ack?: BidAck) => {
      setSubmitting(false)
      if (timeoutErr || !ack?.ok) {
        if (ack?.code === 'stale_price' && ack.currentPrice !== undefined) {
          setError(t('auctions.detail.errors.stale_price', { amount: formatCurrency(ack.currentPrice, locale) }))
          setBidInput(String(ack.currentPrice + 1))
        } else {
          setError(mapErrorCode(ack?.code))
        }
        return
      }
      setJustPlaced(true)
      setTimeout(() => setJustPlaced(false), 2000)
    })
  }

  const canBid = store.status === 'active' && !isSeller && !isOwnAuction
  const isCurrentWinner = currentUser?.companyId === store.currentBidderId

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-8 flex flex-col gap-4">

        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container">
              <IconGavel size={14} />
              {t(`auctions.status.${store.status}`)}
            </span>
            <div className="text-right">
              <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">{t('auctions.detail.endsIn')}</p>
              <CountdownTimer endsAt={store.endsAt ?? auction.ends_at} ended={store.status !== 'active'} className="text-lg" />
            </div>
          </div>

          <div className="flex items-end gap-3 mb-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">{t('auctions.detail.currentPrice')}</p>
              <p className="text-4xl font-bold text-primary">{formatCurrency(store.currentPrice, locale)}</p>
            </div>
          </div>
          <p className="text-sm text-on-surface-variant">{t('auctions.detail.bidCount', { count: store.bidCount })}</p>

          {store.status === 'ended' && (
            isCurrentWinner ? (
              <div className="mt-4 flex items-center gap-2 p-3 rounded-xl bg-secondary-container/40 text-on-secondary-container text-sm font-semibold">
                <IconCircleCheck size={18} />
                {t('auctions.detail.wonBanner')}
              </div>
            ) : store.bidCount > 0 ? (
              <div className="mt-4 flex items-center gap-2 p-3 rounded-xl bg-surface-container text-on-surface-variant text-sm">
                <IconInfoCircle size={18} />
                {t('auctions.detail.lostBanner')}
              </div>
            ) : (
              <div className="mt-4 flex items-center gap-2 p-3 rounded-xl bg-surface-container text-on-surface-variant text-sm">
                <IconInfoCircle size={18} />
                {t('auctions.detail.endedNoBidsBanner')}
              </div>
            )
          )}
          {store.status === 'cancelled' && (
            <div className="mt-4 flex items-center gap-2 p-3 rounded-xl bg-error-container/30 text-error text-sm font-semibold">
              <IconCircleX size={18} />
              {t('auctions.detail.cancelledBanner')}
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

      <div className="lg:col-span-4 lg:sticky lg:top-24">
        {canBid && (
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 shadow-sm p-6">
            <h2 className="text-base font-semibold text-on-surface mb-4">{t('auctions.detail.placeBidHeading')}</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div>
                <label htmlFor="bidAmount" className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                  {t('auctions.detail.yourBid')}
                </label>
                <input
                  id="bidAmount"
                  type="number"
                  step="0.01"
                  min={store.currentPrice + 0.01}
                  value={bidInput}
                  onChange={(e) => setBidInput(e.target.value)}
                  onFocus={(e) => e.target.select()}
                  className="mt-1.5 w-full h-11 px-4 bg-surface border border-outline-variant rounded-lg text-sm font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/60"
                />
                <p className="text-xs text-on-surface-variant mt-1.5">
                  {t('auctions.detail.minBidHint', { amount: formatCurrency(store.currentPrice, locale) })}
                </p>
              </div>

              {error && <p className="text-sm text-error" role="alert">{error}</p>}

              <Button type="submit" variant={justPlaced ? 'secondary' : 'primary'} size="lg" className="w-full justify-center" disabled={submitting}>
                {submitting ? <IconLoader2 size={20} className="animate-spin" /> : justPlaced ? <IconCircleCheck size={20} /> : <IconGavel size={20} />}
                {submitting ? t('auctions.detail.placingBid') : justPlaced ? t('auctions.detail.bidPlaced') : t('auctions.detail.placeBidButton')}
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
