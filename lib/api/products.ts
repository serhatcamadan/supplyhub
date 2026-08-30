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

export function getSellerProducts(): Promise<ApiProduct[]> {
  return apiFetch<ApiProduct[]>('/seller/products')
}

export function createProduct(payload: Omit<Product, 'id' | 'seller_id'>): Promise<ApiProduct> {
  return apiFetch<ApiProduct>('/seller/products', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
