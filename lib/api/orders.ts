import { apiFetch } from './client'
import type { OrderWithDetails, OrderStatus } from '@/types'

export function getOrders(): Promise<OrderWithDetails[]> {
  return apiFetch<OrderWithDetails[]>('/orders')
}

export function updateOrderStatus(id: string, status: OrderStatus): Promise<OrderWithDetails> {
  return apiFetch<OrderWithDetails>(`/orders/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
}

export function approveOrder(id: string): Promise<OrderWithDetails> {
  return apiFetch<OrderWithDetails>(`/orders/${id}/approve`, { method: 'POST' })
}

export function rejectOrder(id: string): Promise<void> {
  return apiFetch<void>(`/orders/${id}/reject`, { method: 'POST' })
}

export interface CreateOrderPayload {
  sellerId: string
  items: { productId: string; quantity: number }[]
}

export function createOrder(payload: CreateOrderPayload): Promise<OrderWithDetails> {
  return apiFetch<OrderWithDetails>('/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
