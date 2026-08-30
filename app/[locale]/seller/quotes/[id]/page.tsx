import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { getTranslations, getLocale } from 'next-intl/server'
import { serverApiFetch } from '@/lib/api/server-client'
import { getInitials } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { QuoteDetailPanel } from '@/components/seller/quote-detail-panel'
import { QuoteResponseForm } from '@/components/seller/quote-response-form'
import { PrintButton } from '@/components/seller/print-button'
import type { ApiQuoteRequest } from '@/lib/api/quotes'
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
  const [t, locale] = await Promise.all([getTranslations('seller'), getLocale()])

  const quote = await serverApiFetch<ApiQuoteRequest>(`/quote-requests/${id}`).catch(() => null)
  if (!quote) notFound()

  const listPrice =
    quote.product.price_tiers.find(
      (tier) =>
        quote.quantity >= tier.min_qty &&
        (tier.max_qty === null || quote.quantity <= tier.max_qty)
    )?.price ??
    quote.product.price_tiers[0]?.price ??
    null

  async function decline() {
    'use server'
    const loc = await getLocale()
    await serverApiFetch(`/quote-requests/${id}/seller-decline`, { method: 'PATCH' })
    redirect(`/${loc}/seller/quotes`)
  }

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
          buyerName={quote.buyer.name}
          buyerInitials={getInitials(quote.buyer.name)}
          buyerMessage={quote.buyer_note}
          productName={quote.product.name}
          productId={quote.product_id}
          productCategory={quote.product.category}
          quantity={quote.quantity}
          listPrice={listPrice}
          minOrderQty={quote.product.min_order_qty}
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
