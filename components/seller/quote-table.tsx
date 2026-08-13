import Link from 'next/link'
import { formatCurrency, formatDate, cn } from '@/lib/utils'
import type { QuoteRequest } from '@/types'
import { buttonVariants } from '@/components/ui/button'

export interface EnrichedQuote extends QuoteRequest {
  buyerName: string
  buyerInitials: string
  productName: string
  productCategory: string
  listPrice: number | null
  isExpiring: boolean
}

const STATUS_CONFIG: Record<
  QuoteRequest['status'],
  { label: string; className: string; icon?: string; dot?: boolean }
> = {
  pending: {
    label: 'Pending',
    className: 'bg-tertiary-container/20 text-on-tertiary-container',
    dot: true,
  },
  responded: {
    label: 'Responded',
    className: 'bg-secondary-container/30 text-on-secondary-container',
    icon: 'done_all',
  },
  accepted: {
    label: 'Accepted',
    className: 'bg-secondary-container/50 text-secondary',
    icon: 'check_circle',
  },
  declined: {
    label: 'Declined',
    className: 'bg-error-container/30 text-on-error-container',
    icon: 'cancel',
  },
}

function StatusBadge({ status }: { status: QuoteRequest['status'] }) {
  const cfg = STATUS_CONFIG[status]
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold', cfg.className)}>
      {cfg.dot && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
      {cfg.icon && (
        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>{cfg.icon}</span>
      )}
      {cfg.label}
    </span>
  )
}

export function QuoteTable({ quotes }: { quotes: EnrichedQuote[] }) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse min-w-[860px]">
          <thead className="sticky top-0 bg-surface-container-lowest z-10 shadow-[0_1px_0_rgba(0,0,0,0.05)]">
            <tr>
              <th className="py-3 px-6 w-12">
                <input
                  type="checkbox"
                  className="rounded border-outline-variant text-primary focus:ring-primary"
                />
              </th>
              <th className="py-3 px-6 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                RFQ ID
              </th>
              <th className="py-3 px-6 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                Buyer
              </th>
              <th className="py-3 px-6 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                Product
              </th>
              <th className="py-3 px-6 text-xs font-semibold uppercase tracking-wider text-on-surface-variant text-right">
                Quantity
              </th>
              <th className="py-3 px-6 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                Date Received
              </th>
              <th className="py-3 px-6 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                Status
              </th>
              <th className="py-3 px-6 text-xs font-semibold uppercase tracking-wider text-on-surface-variant text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-outline-variant/20">
            {quotes.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-16 text-center">
                  <span
                    className="material-symbols-outlined block mx-auto mb-3 text-outline-variant"
                    style={{ fontSize: '40px' }}
                  >
                    request_quote
                  </span>
                  <span className="text-sm text-on-surface-variant">No quote requests found.</span>
                </td>
              </tr>
            ) : (
              quotes.map((quote) => (
                <tr
                  key={quote.id}
                  className="hover:bg-surface-container-low/50 transition-colors group cursor-pointer"
                >
                  <td className="py-4 px-6">
                    <input
                      type="checkbox"
                      className="rounded border-outline-variant text-primary focus:ring-primary"
                    />
                  </td>

                  <td className="py-4 px-6">
                    <span className="font-mono text-sm text-primary font-medium">
                      {quote.id.toUpperCase()}
                    </span>
                  </td>

                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center text-xs font-bold shrink-0">
                        {quote.buyerInitials}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-on-surface leading-tight">
                          {quote.buyerName}
                        </p>
                        <p className="text-xs text-on-surface-variant">Buyer</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <p className="text-sm text-on-surface">{quote.productName}</p>
                    <p className="text-xs text-on-surface-variant">{quote.productCategory}</p>
                    {quote.listPrice && (
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        List: {formatCurrency(quote.listPrice)}/adet
                      </p>
                    )}
                  </td>

                  <td className="py-4 px-6 text-right">
                    <span className="font-mono text-sm text-on-surface">
                      {quote.quantity.toLocaleString('tr-TR')}
                    </span>
                    <span className="text-xs text-on-surface-variant ml-1">adet</span>
                  </td>

                  <td className="py-4 px-6">
                    <p className="text-sm text-on-surface">{formatDate(quote.created_at)}</p>
                    {quote.status === 'pending' && quote.isExpiring && (
                      <p className="text-xs text-error font-medium">Expires soon</p>
                    )}
                    {quote.seller_response_price && (
                      <p className="text-xs text-secondary font-medium">
                        Offer: {formatCurrency(quote.seller_response_price)}/adet
                      </p>
                    )}
                  </td>

                  <td className="py-4 px-6">
                    <StatusBadge status={quote.status} />
                  </td>

                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {quote.status === 'pending' && (
                        <Link
                          href={`/seller/quotes/${quote.id}`}
                          className={buttonVariants({ variant: 'primary', size: 'sm' })}
                        >
                          Respond
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

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-outline-variant/30 flex items-center justify-between bg-surface-container-lowest">
        <span className="text-xs text-on-surface-variant">
          Showing {quotes.length} of {quotes.length} entries
        </span>
        <div className="flex items-center gap-1">
          <button className="p-1 text-on-surface-variant opacity-50 cursor-not-allowed rounded-md">
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>chevron_left</span>
          </button>
          <button className="w-8 h-8 flex items-center justify-center text-xs font-semibold bg-primary-container text-on-primary-container rounded-md">
            1
          </button>
          <button className="p-1 text-on-surface-variant rounded-md hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  )
}
