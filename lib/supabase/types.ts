import type { PriceTier } from '@/types'

export type Database = {
  public: {
    Tables: {
      companies: {
        Row: { id: string; name: string; type: 'seller' | 'buyer'; created_at: string }
        Insert: { id?: string; name: string; type: 'seller' | 'buyer'; created_at?: string }
        Update: { id?: string; name?: string; type?: 'seller' | 'buyer' }
        Relationships: []
      }
      users: {
        Row: { id: string; company_id: string; email: string; role: 'admin' | 'staff'; name: string }
        Insert: { id: string; company_id: string; email: string; role?: 'admin' | 'staff'; name: string }
        Update: { id?: string; company_id?: string; email?: string; role?: 'admin' | 'staff'; name?: string }
        Relationships: [
          { foreignKeyName: 'users_company_id_fkey'; columns: ['company_id']; isOneToOne: false; referencedRelation: 'companies'; referencedColumns: ['id'] }
        ]
      }
      products: {
        Row: {
          id: string; seller_id: string; name: string; description: string
          category: string; min_order_qty: number; price_tiers: PriceTier[]
          image_url: string | null; status: 'active' | 'draft'; created_at: string
        }
        Insert: {
          id?: string; seller_id: string; name: string; description?: string
          category: string; min_order_qty?: number; price_tiers?: PriceTier[]
          image_url?: string | null; status?: 'active' | 'draft'
        }
        Update: {
          name?: string; description?: string; category?: string; min_order_qty?: number
          price_tiers?: PriceTier[]; image_url?: string | null; status?: 'active' | 'draft'
        }
        Relationships: [
          { foreignKeyName: 'products_seller_id_fkey'; columns: ['seller_id']; isOneToOne: false; referencedRelation: 'companies'; referencedColumns: ['id'] }
        ]
      }
      quote_requests: {
        Row: {
          id: string; buyer_id: string; product_id: string; quantity: number
          buyer_note: string | null; status: 'pending' | 'responded' | 'accepted' | 'declined'
          seller_response_price: number | null; seller_message: string | null; created_at: string
        }
        Insert: {
          id?: string; buyer_id: string; product_id: string; quantity: number
          buyer_note?: string | null; status?: 'pending' | 'responded' | 'accepted' | 'declined'
          seller_response_price?: number | null; seller_message?: string | null
        }
        Update: {
          status?: 'pending' | 'responded' | 'accepted' | 'declined'
          seller_response_price?: number | null; seller_message?: string | null
        }
        Relationships: [
          { foreignKeyName: 'quote_requests_buyer_id_fkey'; columns: ['buyer_id']; isOneToOne: false; referencedRelation: 'companies'; referencedColumns: ['id'] },
          { foreignKeyName: 'quote_requests_product_id_fkey'; columns: ['product_id']; isOneToOne: false; referencedRelation: 'products'; referencedColumns: ['id'] }
        ]
      }
      orders: {
        Row: {
          id: string; buyer_id: string; seller_id: string
          status: 'pending' | 'confirmed' | 'shipped' | 'delivered'
          total: number; needs_approval: boolean
          approved_by: string | null; created_by: string; created_at: string
        }
        Insert: {
          id?: string; buyer_id: string; seller_id: string
          status?: 'pending' | 'confirmed' | 'shipped' | 'delivered'
          total?: number; needs_approval?: boolean
          approved_by?: string | null; created_by: string
        }
        Update: {
          status?: 'pending' | 'confirmed' | 'shipped' | 'delivered'
          approved_by?: string | null
        }
        Relationships: [
          { foreignKeyName: 'orders_buyer_id_fkey'; columns: ['buyer_id']; isOneToOne: false; referencedRelation: 'companies'; referencedColumns: ['id'] },
          { foreignKeyName: 'orders_seller_id_fkey'; columns: ['seller_id']; isOneToOne: false; referencedRelation: 'companies'; referencedColumns: ['id'] },
          { foreignKeyName: 'orders_created_by_fkey'; columns: ['created_by']; isOneToOne: false; referencedRelation: 'users'; referencedColumns: ['id'] },
          { foreignKeyName: 'orders_approved_by_fkey'; columns: ['approved_by']; isOneToOne: false; referencedRelation: 'users'; referencedColumns: ['id'] }
        ]
      }
      order_items: {
        Row: { id: string; order_id: string; product_id: string; quantity: number; unit_price: number }
        Insert: { id?: string; order_id: string; product_id: string; quantity: number; unit_price: number }
        Update: { quantity?: number; unit_price?: number }
        Relationships: [
          { foreignKeyName: 'order_items_order_id_fkey'; columns: ['order_id']; isOneToOne: false; referencedRelation: 'orders'; referencedColumns: ['id'] },
          { foreignKeyName: 'order_items_product_id_fkey'; columns: ['product_id']; isOneToOne: false; referencedRelation: 'products'; referencedColumns: ['id'] }
        ]
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
  }
}
