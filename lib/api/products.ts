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
