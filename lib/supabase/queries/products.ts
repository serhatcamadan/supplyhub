import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../types'
import type { Product } from '@/types'

type Client = SupabaseClient<Database>

export async function getSellerProducts(supabase: Client, sellerId: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('seller_id', sellerId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Product[]
}

export async function createProduct(
  supabase: Client,
  product: Database['public']['Tables']['products']['Insert']
) {
  const { data, error } = await supabase
    .from('products')
    .insert(product)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateProduct(
  supabase: Client,
  id: string,
  updates: Database['public']['Tables']['products']['Update']
) {
  const { error } = await supabase.from('products').update(updates).eq('id', id)
  if (error) throw error
}
