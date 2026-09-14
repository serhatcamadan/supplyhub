import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getTranslations, getLocale } from 'next-intl/server'
import { serverApiFetch, ApiError } from '@/lib/api/server-client'
import { formatCurrency, formatDate } from '@/lib/utils'
import { RfqProductCard } from '@/components/buyer/rfq-product-card'
import { RfqSupplierSidebar } from '@/components/buyer/rfq-supplier-sidebar'
import { QuoteResponseActions } from '@/components/buyer/quote-response-actions'
import type { ApiQuoteRequest } from '@/lib/api/quotes'
import {
  IconArrowLeft, IconCircleCheck, IconCircleX, IconClock,
  IconFileInvoice, IconLock, IconMessage, IconPaperclip, IconQuote,
} from '@tabler/icons-react'

export default async function BuyerQuoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [t, locale] = await Promise.all([getTranslations('buyer'), getLocale()])

  let quote: ApiQuoteRequest
  try {
    quote = await serverApiFetch<ApiQuoteRequest>(`/quote-requests/${id}`)
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound()
    if (err instanceof ApiError && err.status === 403) {
      return (
        <div className="px-8 py-24 flex flex-col items-center justify-center gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-error-container/20 flex items-center justify-center">
            <IconLock size={28} className="text-error" />
          </div>
          <div>
            <p className="font-semibold text-on-surface text-lg">{t('quotes.detail.accessDenied')}</p>
            <p className="text-sm text-on-surface-variant mt-1">{t('quotes.detail.accessDeniedHint')}</p>
          </div>
          <Link
            href={`/${locale}/buyer/quotes`}
            className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1.5"
          >
            <IconArrowLeft size={16} />
            {t('quotes.detail.backToList')}
          </Link>
        </div>
      )
    }
    throw err
  }

  const listPrice = quote.product.price_tiers[0]?.price ?? 0
  const total = quote.seller_response_price != null ? quote.seller_response_price * quote.quantity : null

  return (
    <div className="px-8 py-8 max-w-360 mx-auto">

      <div className="mb-8">
        <Link
          href={`/${locale}/buyer/quotes`}
          className="inline-flex items-center gap-2 text-sm text-on-surface-variant hover:text-on-surface transition-colors mb-4"
        >
          <IconArrowLeft size={16} />
          {t('quotes.detail.back')}
        </Link>
        <h1 className="text-3xl font-bold text-on-surface">{t('quotes.detail.heading')}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        <div className="lg:col-span-8 space-y-4">
          <RfqProductCard product={quote.product} seller={quote.product.companies} />

          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 shadow-sm p-6">
            <h2 className="text-base font-semibold text-on-surface border-b border-outline-variant/20 pb-3 mb-4 flex items-center gap-2">
              <IconFileInvoice size={18} className="text-primary" />
              {t('quotes.detail.yourRequest')}
            </h2>
            <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm mb-4">
              <div>
                <span className="text-on-surface-variant">{t('quotes.detail.quantity')}: </span>
                <span className="font-mono font-semibold text-on-surface">{quote.quantity.toLocaleString(locale)}</span>
              </div>
              <div>
                <span className="text-on-surface-variant">{t('quotes.detail.requestedOn')}: </span>
                <span className="text-on-surface">{formatDate(quote.created_at, locale)}</span>
              </div>
            </div>

            {quote.buyer_note ? (
              <div className="p-4 bg-surface rounded-xl border border-outline-variant/20 relative overflow-hidden">
                <IconQuote size={36} className="absolute top-2 left-2 text-outline-variant/20 select-none pointer-events-none" />
                <p className="text-sm text-on-surface leading-relaxed relative z-10">{quote.buyer_note}</p>
              </div>
            ) : (
              <p className="text-sm text-on-surface-variant italic">{t('quotes.detail.noMessage')}</p>
            )}

            {quote.attachment_urls.length > 0 && (
              <div className="mt-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-2 flex items-center gap-1.5">
                  <IconPaperclip size={14} />
                  {t('quotes.detail.attachments')}
                </h3>
                <ul className="flex flex-col gap-2">
                  {quote.attachment_urls.map((url) => (
                    <li key={url}>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline break-all"
                      >
                        {url.split('/').pop()}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 shadow-sm p-6">
            <h2 className="text-base font-semibold text-on-surface border-b border-outline-variant/20 pb-3 mb-4 flex items-center gap-2">
              <IconMessage size={18} className="text-primary" />
              {t('quotes.detail.sellerResponse')}
            </h2>

            {quote.status === 'pending' ? (
              <div className="flex items-center gap-3 p-4 bg-tertiary-container/10 rounded-xl border border-dashed border-outline-variant/50">
                <IconClock size={20} className="text-on-tertiary-container shrink-0" />
                <div>
                  <p className="text-sm font-medium text-on-surface">{t('quotes.detail.noResponseYet')}</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">{t('quotes.detail.waitingHint')}</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between p-4 bg-surface rounded-xl border border-outline-variant/20">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">{t('quotes.detail.unitPrice')}</p>
                    <p className="text-xl font-bold text-primary mt-0.5">
                      {formatCurrency(quote.seller_response_price ?? listPrice, locale)}
                    </p>
                  </div>
                  {total !== null && (
                    <div className="text-right">
                      <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">{t('quotes.detail.total')}</p>
                      <p className="text-xl font-bold text-on-surface mt-0.5">{formatCurrency(total, locale)}</p>
                    </div>
                  )}
                </div>

                {quote.seller_message && (
                  <p className="text-sm text-on-surface leading-relaxed">{quote.seller_message}</p>
                )}

                {quote.status === 'responded' && <QuoteResponseActions quoteId={quote.id} />}

                {quote.status === 'accepted' && (
                  <div className="flex items-center gap-2 text-secondary text-sm font-semibold">
                    <IconCircleCheck size={18} />
                    {t('quotes.detail.statusAccepted')}
                  </div>
                )}

                {quote.status === 'declined' && (
                  <div className="flex items-center gap-2 text-error text-sm font-semibold">
                    <IconCircleX size={18} />
                    {t('quotes.detail.statusDeclined')}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-4 lg:sticky lg:top-24">
          <RfqSupplierSidebar seller={quote.product.companies} stats={[]} />
        </div>

      </div>
    </div>
  )
}
