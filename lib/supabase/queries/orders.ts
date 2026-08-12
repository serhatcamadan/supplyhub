import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../types'
import type { OrderWithDetails } from '@/types'

type Client = SupabaseClient<Database>

export async function getSellerOrders(
  supabase: Client,
  sellerId: string
): Promise<OrderWithDetails[]> {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      buyer:companies!orders_buyer_id_fkey(*),
      seller:companies!orders_seller_id_fkey(*),
      created_by_user:users!orders_created_by_fkey(*),
      approved_by_user:users!orders_approved_by_fkey(*),
      items:order_items(*, product:products(*))
    `)
    .eq('seller_id', sellerId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as unknown as OrderWithDetails[]
}

export async function updateOrderStatus(
  supabase: Client,
  id: string,
  status: Database['public']['Tables']['orders']['Update']['status']
) {
  const { error } = await supabase.from('orders').update({ status }).eq('id', id)
  if (error) throw error
}
