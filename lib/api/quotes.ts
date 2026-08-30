import { apiFetch } from './client'
import type { QuoteRequest } from '@/types'

export interface ApiQuoteRequest extends QuoteRequest {
  buyer: { id: string; name: string; type: string }
  product: {
    id: string
    name: string
    category: string
    price_tiers: { min_qty: number; max_qty: number | null; price: number }[]
    companies: { id: string; name: string }
  }
}

export function getQuoteRequests(): Promise<ApiQuoteRequest[]> {
  return apiFetch<ApiQuoteRequest[]>('/quote-requests')
}

export function createQuoteRequest(payload: {
  productId: string
  quantity: number
  buyer_note?: string
}): Promise<ApiQuoteRequest> {
  return apiFetch<ApiQuoteRequest>('/quote-requests', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function respondToQuoteRequest(
  id: string,
  payload: { seller_response_price: number; seller_message?: string },
): Promise<ApiQuoteRequest> {
  return apiFetch<ApiQuoteRequest>(`/quote-requests/${id}/respond`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

export function acceptQuoteRequest(id: string): Promise<ApiQuoteRequest> {
  return apiFetch<ApiQuoteRequest>(`/quote-requests/${id}/accept`, { method: 'PATCH' })
}

export function declineQuoteRequest(id: string): Promise<ApiQuoteRequest> {
  return apiFetch<ApiQuoteRequest>(`/quote-requests/${id}/decline`, { method: 'PATCH' })
}
