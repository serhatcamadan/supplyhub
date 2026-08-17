import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getInitials } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { QuoteDetailPanel } from '@/components/seller/quote-detail-panel'
import { QuoteResponseForm } from '@/components/seller/quote-response-form'
import type { Product, Company } from '@/types'

function formatReceived(iso: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

export default async function QuoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: quote } = await supabase
    .from('quote_requests')
    .select('*')
    .eq('id', id)
    .single()

  if (!quote) notFound()

  const [{ data: productData }, { data: buyerData }] = await Promise.all([
    supabase.from('products').select('*').eq('id', quote.product_id).single(),
    supabase.from('companies').select('*').eq('id', quote.buyer_id).single(),
  ])

  const product = productData as Product | null
  const buyer = buyerData as Company | null

  const listPrice =
    product?.price_tiers.find(
      (t) =>
        quote.quantity >= t.min_qty &&
        (t.max_qty === null || quote.quantity <= t.max_qty)
    )?.price ??
    product?.price_tiers[0]?.price ??
    null

  return (
    <div className="h-[calc(100vh-4rem)] p-8 flex flex-col gap-6">

      <div className="flex justify-between items-end flex-wrap gap-4 shrink-0">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <Link
              href="/seller/quotes"
              className="text-xs font-semibold text-on-surface-variant hover:text-on-surface flex items-center gap-1 transition-colors"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_back</span>
              Quotes
            </Link>
            <span className="text-outline-variant">/</span>
            <span className="px-2 py-1 bg-tertiary-container/20 text-on-tertiary-container text-xs font-semibold rounded-md uppercase tracking-wider">
              {quote.id.slice(0, 8).toUpperCase()}
            </span>
            <span className="px-2 py-1 bg-surface-container-high text-on-surface-variant text-xs font-semibold rounded-md">
              Received: {formatReceived(quote.created_at)}
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-on-surface">Quote Request</h1>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="text-primary">
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>print</span>
            Print
          </Button>
          <Button variant="outline" className="text-error hover:bg-error-container/50">
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>block</span>
            Decline
          </Button>
        </div>
      </div>

      <div className="flex flex-1 gap-6 min-h-0">
        <QuoteDetailPanel
          buyerName={buyer?.name ?? 'Unknown Buyer'}
          buyerInitials={buyer ? getInitials(buyer.name) : '??'}
          buyerMessage={quote.buyer_note}
          productName={product?.name ?? 'Unknown Product'}
          productId={quote.product_id}
          productCategory={product?.category ?? '—'}
          quantity={quote.quantity}
          listPrice={listPrice}
          minOrderQty={product?.min_order_qty ?? 1}
        />

        <QuoteResponseForm
          quoteId={quote.id}
          quantity={quote.quantity}
          listPrice={listPrice}
          existingResponse={{
            price: quote.seller_response_price,
            message: quote.seller_message,
          }}
        />
      </div>

    </div>
  )
}
