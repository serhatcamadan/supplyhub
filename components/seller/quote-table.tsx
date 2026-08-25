'use client'

import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { formatCurrency, formatDate, cn } from '@/lib/utils'
import type { QuoteRequest } from '@/types'
import { buttonVariants } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { TablePagination } from '@/components/ui/table-pagination'
import { TableEmptyRow } from '@/components/ui/table-empty-row'

export interface EnrichedQuote extends QuoteRequest {
  buyerName: string
  buyerInitials: string
  productName: string
  productCategory: string
  listPrice: number | null
  isExpiring: boolean
}

const STATUS_STYLE: Record<
  QuoteRequest['status'],
  { className: string; icon?: string; dot?: boolean }
> = {
  pending:   { className: 'bg-tertiary-container/20 text-on-tertiary-container', dot: true },
  responded: { className: 'bg-secondary-container/30 text-on-secondary-container', icon: 'done_all' },
  accepted:  { className: 'bg-secondary-container/50 text-secondary', icon: 'check_circle' },
  declined:  { className: 'bg-error-container/30 text-on-error-container', icon: 'cancel' },
}

function QuoteStatusBadge({ status, label }: { status: QuoteRequest['status']; label: string }) {
  const cfg = STATUS_STYLE[status]
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold', cfg.className)}>
      {cfg.dot && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
      {cfg.icon && <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>{cfg.icon}</span>}
      {label}
    </span>
  )
}

export function QuoteTable({ quotes }: { quotes: EnrichedQuote[] }) {
  const t = useTranslations('seller')
  const locale = useLocale()

  const headers = [
    t('quotes.table.rfqId'),
    t('quotes.table.buyerCol'),
    t('quotes.table.product'),
    t('quotes.table.quantity'),
    t('quotes.table.dateReceived'),
    t('quotes.table.status'),
    t('quotes.table.actionsCol'),
  ]

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse min-w-215">
          <thead className="sticky top-0 bg-surface-container-lowest z-10 shadow-[0_1px_0_rgba(0,0,0,0.05)]">
            <tr>
              <th className="py-3 px-6 w-12">
                <input type="checkbox" className="rounded border-outline-variant text-primary focus:ring-primary" />
              </th>
              {headers.map((h, i) => (
                <th
                  key={h}
                  className={cn(
                    'py-3 px-6 text-xs font-semibold uppercase tracking-wider text-on-surface-variant',
                    (i === 3 || i === 6) && 'text-right'
                  )}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-outline-variant/20">
            {quotes.length === 0 ? (
              <TableEmptyRow icon="request_quote" message={t('quotes.table.noResults')} colSpan={8} />
            ) : (
              quotes.map((quote) => (
                <tr
                  key={quote.id}
                  className="hover:bg-surface-container-low/50 transition-colors group cursor-pointer"
                >
                  <td className="py-4 px-6">
                    <input type="checkbox" className="rounded border-outline-variant text-primary focus:ring-primary" />
                  </td>

                  <td className="py-4 px-6">
                    <span className="font-mono text-sm text-primary font-medium">
                      {quote.id.toUpperCase()}
                    </span>
                  </td>

                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <Avatar name={quote.buyerName} size="sm" colorScheme="secondary" />
                      <div>
                        <p className="text-sm font-semibold text-on-surface leading-tight">
                          {quote.buyerName}
                        </p>
                        <p className="text-xs text-on-surface-variant">{t('quotes.table.buyerRole')}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <p className="text-sm text-on-surface">{quote.productName}</p>
                    <p className="text-xs text-on-surface-variant">{quote.productCategory}</p>
                    {quote.listPrice && (
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        {t('quotes.table.listLabel')} {formatCurrency(quote.listPrice!, locale)}/{t('quotes.table.perUnit')}
                      </p>
                    )}
                  </td>

                  <td className="py-4 px-6 text-right">
                    <span className="font-mono text-sm text-on-surface">
                      {quote.quantity.toLocaleString('tr-TR')}
                    </span>
                    <span className="text-xs text-on-surface-variant ml-1">{t('quotes.table.perUnit')}</span>
                  </td>

                  <td className="py-4 px-6">
                    <p className="text-sm text-on-surface">{formatDate(quote.created_at, locale)}</p>
                    {quote.status === 'pending' && quote.isExpiring && (
                      <p className="text-xs text-error font-medium">{t('quotes.table.expiringSoon')}</p>
                    )}
                    {quote.seller_response_price && (
                      <p className="text-xs text-secondary font-medium">
                        {t('quotes.table.offerLabel')} {formatCurrency(quote.seller_response_price!, locale)}/{t('quotes.table.perUnit')}
                      </p>
                    )}
                  </td>

                  <td className="py-4 px-6">
                    <QuoteStatusBadge
                      status={quote.status}
                      label={t(`quotes.table.statusLabel.${quote.status}`)}
                    />
                  </td>

                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {quote.status === 'pending' && (
                        <Link
                          href={`/${locale}/seller/quotes/${quote.id}`}
                          className={buttonVariants({ variant: 'primary', size: 'sm' })}
                        >
                          {t('quotes.table.respond')}
                        </Link>
                      )}
                      <button className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded-lg transition-colors">
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>more_vert</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <TablePagination label={t('quotes.table.pagination', { shown: quotes.length, total: quotes.length })} />
    </div>
  )
}
