import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { getTranslations, getLocale } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import { getInitials } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { QuoteDetailPanel } from '@/components/seller/quote-detail-panel'
import { QuoteResponseForm } from '@/components/seller/quote-response-form'
import { PrintButton } from '@/components/seller/print-button'
import type { Product, Company } from '@/types'
import { IconArrowLeft, IconBan } from '@tabler/icons-react'

function formatReceived(iso: string, locale: string) {
  return new Intl.DateTimeFormat(locale === 'tr' ? 'tr-TR' : 'en-US', {
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
  const [supabase, t, locale] = await Promise.all([
    createClient(),
    getTranslations('seller'),
    getLocale(),
  ])

  const { data: quote } = await supabase
    .from('quote_requests')
    .select('*')
    .eq('id', id)
    .single()

  if (!quote) notFound()

  async function decline() {
    'use server'
    const loc = await getLocale()
    const sb = await createClient()
    await sb.from('quote_requests').update({ status: 'declined' }).eq('id', id)
    redirect(`/${loc}/seller/quotes`)
  }

  const [{ data: productData }, { data: buyerData }] = await Promise.all([
    supabase.from('products').select('*').eq('id', quote.product_id).single(),
    supabase.from('companies').select('*').eq('id', quote.buyer_id).single(),
  ])

  const product = productData as Product | null
  const buyer = buyerData as Company | null

  const listPrice =
    product?.price_tiers.find(
      (tier) =>
        quote.quantity >= tier.min_qty &&
        (tier.max_qty === null || quote.quantity <= tier.max_qty)
    )?.price ??
    product?.price_tiers[0]?.price ??
    null

  return (
    <div className="h-[calc(100vh-4rem)] p-8 flex flex-col gap-6">

      <div className="flex justify-between items-end flex-wrap gap-4 shrink-0">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <Link
              href={`/${locale}/seller/quotes`}
              className="text-xs font-semibold text-on-surface-variant hover:text-on-surface flex items-center gap-1 transition-colors"
            >
              <IconArrowLeft size={16} />
              {t('quotes.detail.back')}
            </Link>
            <span className="text-outline-variant">/</span>
            <span className="px-2 py-1 bg-tertiary-container/20 text-on-tertiary-container text-xs font-semibold rounded-md uppercase tracking-wider">
              {quote.id.slice(0, 8).toUpperCase()}
            </span>
            <span className="px-2 py-1 bg-surface-container-high text-on-surface-variant text-xs font-semibold rounded-md">
              {t('quotes.detail.received')} {formatReceived(quote.created_at, locale)}
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-on-surface">{t('quotes.detail.heading')}</h1>
        </div>

        <div className="flex gap-3">
          <PrintButton />
          <form action={decline}>
            <Button type="submit" variant="outline" className="text-error hover:bg-error-container/50">
              <IconBan size={20} />
              {t('quotes.detail.decline')}
            </Button>
          </form>
        </div>
      </div>

      <div className="flex flex-1 gap-6 min-h-0">
        <QuoteDetailPanel
          buyerName={buyer?.name ?? t('quotes.detail.unknownBuyer')}
          buyerInitials={buyer ? getInitials(buyer.name) : '??'}
          buyerMessage={quote.buyer_note}
          productName={product?.name ?? t('quotes.detail.unknownProduct')}
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
