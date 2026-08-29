import { apiFetch } from './client'
import type { Product } from '@/types'

export interface ApiProduct extends Product {
  companies: { id: string; name: string }
  created_at: string
}

export function getProducts(): Promise<ApiProduct[]> {
  return apiFetch<ApiProduct[]>('/products')
}

export function getProduct(id: string): Promise<ApiProduct> {
  return apiFetch<ApiProduct>(`/products/${id}`)
}

export function getSellerProducts(sellerId: string): Promise<ApiProduct[]> {
  return apiFetch<ApiProduct[]>(`/seller/products?sellerId=${sellerId}`)
}

export function createProduct(sellerId: string, payload: Omit<Product, 'id' | 'seller_id'>): Promise<ApiProduct> {
  return apiFetch<ApiProduct>(`/seller/products?sellerId=${sellerId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}
