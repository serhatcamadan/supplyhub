export type CompanyType = 'seller' | 'buyer'
export type UserRole = 'admin' | 'staff'
export type ProductStatus = 'active' | 'draft'
export type QuoteStatus = 'pending' | 'responded' | 'accepted' | 'declined'
export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered'

export interface PriceTier {
  min_qty: number
  max_qty: number | null
  price: number
}

export interface Company {
  id: string
  name: string
  type: CompanyType
}

export interface User {
  id: string
  company_id: string
  email: string
  role: UserRole
  name: string
}

export interface Product {
  id: string
  seller_id: string
  name: string
  description: string
  category: string
  min_order_qty: number
  price_tiers: PriceTier[]
  image_url: string | null
  status: ProductStatus
}

export interface QuoteRequest {
  id: string
  buyer_id: string
  product_id: string
  quantity: number
  buyer_note: string | null
  status: QuoteStatus
  seller_response_price: number | null
  seller_message: string | null
  created_at: string
}

export interface Order {
  id: string
  buyer_id: string
  seller_id: string
  status: OrderStatus
  total: number
  needs_approval: boolean
  approved_by: string | null
  created_by: string
  created_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  unit_price: number
}

// Joined/enriched types for UI

export interface ProductWithSeller extends Product {
  seller: Company
}

export interface QuoteRequestWithDetails extends QuoteRequest {
  product: Product
  buyer: Company
}

export interface OrderWithDetails extends Order {
  items: (OrderItem & { product: Product })[]
  buyer: Company
  seller: Company
  created_by_user: User
  approved_by_user: User | null
}
