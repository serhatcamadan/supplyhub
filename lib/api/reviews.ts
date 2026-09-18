import { apiFetch } from './client'

export interface SubmitReviewPayload {
  order_id: string
  product_id: string
  rating: number
}

export function submitReview(payload: SubmitReviewPayload): Promise<void> {
  return apiFetch<void>('/reviews', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
