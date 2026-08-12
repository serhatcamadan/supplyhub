import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../types'
import type { QuoteRequestWithDetails } from '@/types'

type Client = SupabaseClient<Database>

export async function getSellerQuotes(
  supabase: Client,
  sellerId: string
): Promise<QuoteRequestWithDetails[]> {
  const { data, error } = await supabase
    .from('quote_requests')
    .select(`
      *,
      product:products!inner(*, seller_id),
      buyer:companies!quote_requests_buyer_id_fkey(*)
    `)
    .eq('product.seller_id', sellerId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as unknown as QuoteRequestWithDetails[]
}

export async function getQuoteById(
  supabase: Client,
  id: string
): Promise<QuoteRequestWithDetails | null> {
  const { data, error } = await supabase
    .from('quote_requests')
    .select(`
      *,
      product:products(*),
      buyer:companies!quote_requests_buyer_id_fkey(*)
    `)
    .eq('id', id)
    .single()

  if (error) return null
  return data as unknown as QuoteRequestWithDetails
}

export async function respondToQuote(
  supabase: Client,
  id: string,
  updates: Database['public']['Tables']['quote_requests']['Update']
) {
  const { error } = await supabase.from('quote_requests').update(updates).eq('id', id)
  if (error) throw error
}
