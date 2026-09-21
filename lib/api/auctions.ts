import { apiFetch } from './client'
import type { CompanyType, Auction, Bid, AuctionStatus } from '@/types'

export interface ApiAuction extends Auction {
  current_bidder: { id: string; name: string; type: CompanyType } | null
  product: {
    id: string
    name: string
    category: string
    min_order_qty: number
    image_url: string | null
    images: string[]
    status: string
    seller_id: string
    companies: { id: string; name: string; type: CompanyType }
  }
}

export interface ApiBid extends Bid {
  bidder: { id: string; name: string }
}

export function getAuctions(status: AuctionStatus = 'active'): Promise<ApiAuction[]> {
  return apiFetch<ApiAuction[]>(`/auctions?status=${status}`)
}

export function getAuction(id: string): Promise<ApiAuction> {
  return apiFetch<ApiAuction>(`/auctions/${id}`)
}

export function getAuctionBids(id: string): Promise<ApiBid[]> {
  return apiFetch<ApiBid[]>(`/auctions/${id}/bids`)
}

export function getMyAuctions(): Promise<ApiAuction[]> {
  return apiFetch<ApiAuction[]>('/seller/auctions')
}

export function createAuction(payload: {
  productId: string
  starting_price: number
  ends_at: string
}): Promise<ApiAuction> {
  return apiFetch<ApiAuction>('/seller/auctions', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function cancelAuction(id: string): Promise<ApiAuction> {
  return apiFetch<ApiAuction>(`/seller/auctions/${id}/cancel`, { method: 'PATCH' })
}
