'use client'

import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { formatDate, formatCurrency, cn } from '@/lib/utils'
import type { QuoteRequest } from '@/types'
import { buttonVariants } from '@/components/ui/button'
import { TablePagination } from '@/components/ui/table-pagination'
import { TableEmptyRow } from '@/components/ui/table-empty-row'
import { IconChecks, IconCircleCheck, IconCircleX, IconDotsVertical, IconFileInvoice } from '@tabler/icons-react'
import type { ElementType } from 'react'

export interface BuyerEnrichedQuote extends QuoteRequest {
  productName: string
  productCategory: string
  sellerResponsePrice: number | null
}

const STATUS_STYLE: Record<
  QuoteRequest['status'],
  { className: string; icon?: ElementType; dot?: boolean }
> = {
  pending:   { className: 'bg-tertiary-container/20 text-on-tertiary-container', dot: true },
  responded: { className: 'bg-secondary-container/30 text-on-secondary-container', icon: IconChecks },
  accepted:  { className: 'bg-secondary-container/50 text-secondary', icon: IconCircleCheck },
  declined:  { className: 'bg-error-container/30 text-on-error-container', icon: IconCircleX },
}

function QuoteStatusBadge({ status, label }: { status: QuoteRequest['status']; label: string }) {
  const cfg = STATUS_STYLE[status]
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold', cfg.className)}>
      {cfg.dot && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
      {cfg.icon && <cfg.icon size={14} />}
      {label}
    </span>
  )
}

const STATUS_LABEL_KEY: Record<QuoteRequest['status'], string> = {
  pending:   'pending',
  responded: 'responded',
  accepted:  'accepted',
  declined:  'declined',
}

export function BuyerQuoteTable({ quotes }: { quotes: BuyerEnrichedQuote[] }) {
  const t = useTranslations('buyer')
  const locale = useLocale()

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse min-w-200">
          <thead className="sticky top-0 bg-surface-container-lowest z-10 shadow-[0_1px_0_rgba(0,0,0,0.05)]">
            <tr>
              <th className="py-3 px-6 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                {t('quotes.list.table.product')}
              </th>
              <th className="py-3 px-6 text-xs font-semibold uppercase tracking-wider text-on-surface-variant text-right">
                {t('quotes.list.table.quantity')}
              </th>
              <th className="py-3 px-6 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                {t('quotes.list.table.date')}
              </th>
              <th className="py-3 px-6 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                {t('quotes.list.table.status')}
              </th>
              <th className="py-3 px-6 text-xs font-semibold uppercase tracking-wider text-on-surface-variant text-right">
                {t('quotes.list.table.actions')}
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-outline-variant/20">
            {quotes.length === 0 ? (
              <TableEmptyRow icon={IconFileInvoice} message={t('quotes.list.table.empty')} colSpan={5} />
            ) : (
              quotes.map((quote) => (
                <tr
                  key={quote.id}
                  className="hover:bg-surface-container-low/50 transition-colors group cursor-pointer"
                >
                  <td className="py-4 px-6">
                    <p className="text-sm font-semibold text-on-surface leading-tight">{quote.productName}</p>
                    <p className="text-xs text-on-surface-variant">{quote.productCategory}</p>
                  </td>

                  <td className="py-4 px-6 text-right">
                    <span className="font-mono text-sm text-on-surface">
                      {quote.quantity.toLocaleString(locale)}
                    </span>
                  </td>

                  <td className="py-4 px-6">
                    <p className="text-sm text-on-surface">{formatDate(quote.created_at, locale)}</p>
                    {quote.sellerResponsePrice != null && (
                      <p className="text-xs text-secondary font-medium mt-0.5">
                        {formatCurrency(quote.sellerResponsePrice, locale)}/adet
                      </p>
                    )}
                  </td>

                  <td className="py-4 px-6">
                    <QuoteStatusBadge
                      status={quote.status}
                      label={t(`quotes.list.table.statusLabel.${STATUS_LABEL_KEY[quote.status]}` as Parameters<typeof t>[0])}
                    />
                  </td>

                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {quote.status === 'responded' && (
                        <Link
                          href={`/${locale}/buyer/quotes/${quote.id}`}
                          className={buttonVariants({ variant: 'primary', size: 'sm' })}
                        >
                          {t('quotes.list.table.viewResponse')}
                        </Link>
                      )}
                      <button className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded-lg transition-colors">
                        <IconDotsVertical size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <TablePagination label={t('quotes.list.table.pagination', { shown: quotes.length, total: quotes.length }) as string} />
    </div>
  )
}
