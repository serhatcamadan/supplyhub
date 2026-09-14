import { apiFetch } from './client'
import type { CompanyType, QuoteRequest } from '@/types'

export interface ApiQuoteRequest extends QuoteRequest {
  buyer: { id: string; name: string; type: CompanyType }
  product: {
    id: string
    name: string
    category: string
    min_order_qty: number
    price_tiers: { min_qty: number; max_qty: number | null; price: number }[]
    status: string
    image_url: string | null
    seller_id: string
    companies: { id: string; name: string; type: CompanyType }
  }
}

export function getQuoteRequests(): Promise<ApiQuoteRequest[]> {
  return apiFetch<ApiQuoteRequest[]>('/quote-requests')
}

export function createQuoteRequest(payload: {
  productId: string
  quantity: number
  buyer_note?: string
  attachment_urls?: string[]
}): Promise<ApiQuoteRequest> {
  return apiFetch<ApiQuoteRequest>('/quote-requests', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

interface QuoteResponseFields {
  seller_response_price?: number
  seller_message?: string
  lead_time?: string
  valid_until?: string
  volume_discount?: boolean
}

export function saveQuoteDraft(
  id: string,
  payload: QuoteResponseFields,
): Promise<ApiQuoteRequest> {
  return apiFetch<ApiQuoteRequest>(`/quote-requests/${id}/draft`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

export function respondToQuoteRequest(
  id: string,
  payload: QuoteResponseFields & { seller_response_price: number },
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
