import { create } from 'zustand'
import type { ApiAuction, ApiBid } from '@/lib/api/auctions'
import type { AuctionStatus } from '@/types'

interface AuctionState {
  auctionId: string | null
  currentPrice: number
  currentBidderId: string | null
  currentBidderName: string | null
  bidCount: number
  status: AuctionStatus
  endsAt: string | null
  recentBids: ApiBid[]

  setInitial: (auction: ApiAuction, bids: ApiBid[]) => void
  // Driven exclusively by the `new_bid` socket broadcast — never by an optimistic local
  // update — so every client (including the bidder's own) converges on the same server-
  // confirmed state instead of risking a disagreement between an optimistic guess and reality.
  applyNewBid: (payload: { auction: ApiAuction; bid: ApiBid }) => void
  applyAuctionEnded: (payload: { winnerId?: string | null; finalPrice?: number; reason: 'expired' | 'cancelled' }) => void
  reset: () => void
}

const initialState = {
  auctionId: null,
  currentPrice: 0,
  currentBidderId: null,
  currentBidderName: null,
  bidCount: 0,
  status: 'active' as AuctionStatus,
  endsAt: null,
  recentBids: [] as ApiBid[],
}

export const useAuctionStore = create<AuctionState>((set) => ({
  ...initialState,

  setInitial: (auction, bids) =>
    set({
      auctionId: auction.id,
      currentPrice: auction.current_price,
      currentBidderId: auction.current_bidder_id,
      currentBidderName: auction.current_bidder?.name ?? null,
      bidCount: auction.bid_count,
      status: auction.status,
      endsAt: auction.ends_at,
      recentBids: bids,
    }),

  applyNewBid: ({ auction, bid }) =>
    set((state) => ({
      currentPrice: auction.current_price,
      currentBidderId: auction.current_bidder_id,
      currentBidderName: auction.current_bidder?.name ?? null,
      bidCount: auction.bid_count,
      recentBids: [bid, ...state.recentBids].slice(0, 50),
    })),

  applyAuctionEnded: ({ winnerId, finalPrice, reason }) =>
    set((state) => ({
      status: reason === 'cancelled' ? 'cancelled' : 'ended',
      currentPrice: finalPrice ?? state.currentPrice,
      currentBidderId: winnerId !== undefined ? winnerId : state.currentBidderId,
    })),

  reset: () => set(initialState),
}))
