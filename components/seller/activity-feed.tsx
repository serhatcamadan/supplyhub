'use client'

import { useTranslations } from 'next-intl'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Order, QuoteRequest } from '@/types'
import { buttonVariants } from '@/components/ui/button'

interface ActivityFeedProps {
  orders: Order[]
  quote: QuoteRequest | null
  buyerNames: Record<string, string>
  locale: string
}

const STATUS_COLOR: Record<string, string> = {
  pending: 'bg-surface-variant text-on-surface-variant',
  confirmed: 'bg-primary-fixed text-primary',
  shipped: 'bg-tertiary-container/30 text-on-tertiary-container',
  delivered: 'bg-secondary-container/30 text-secondary',
}

export function ActivityFeed({ orders, quote, buyerNames, locale }: ActivityFeedProps) {
  const t = useTranslations('seller')

  function getCompanyName(id: string) {
    return buyerNames[id] ?? id
  }

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-on-surface">{t('dashboard.activity.heading')}</h3>
        <button className="w-8 h-8 rounded-full hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant transition-colors">
          <span className="material-symbols-outlined">more_vert</span>
        </button>
      </div>

      <div className="flex flex-col relative">
        <div className="absolute left-5 top-2 bottom-2 w-px bg-surface-container-high" />

        {orders.map((order) => {
          const isDelivered = order.status === 'delivered'
          const icon = isDelivered
            ? 'check_circle'
            : order.status === 'shipped'
              ? 'local_shipping'
              : 'shopping_bag'
          const iconStyle = isDelivered
            ? 'bg-secondary-container text-secondary'
            : 'bg-primary-container text-on-primary-container'
          const title = isDelivered
            ? t('dashboard.activity.orderDelivered')
            : t('dashboard.activity.newOrder', { id: order.id.slice(-4).toUpperCase() })

          return (
            <div
              key={order.id}
              className="flex gap-4 p-4 hover:bg-surface-container-high/50 rounded-xl transition-colors relative z-10 group"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-[0_0_0_4px_white] group-hover:shadow-[0_0_0_4px_#e5eeff] transition-shadow ${iconStyle}`}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                  {icon}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-on-surface">
                  <span className="font-semibold">{title}</span>{' '}
                  <span className="text-primary cursor-pointer hover:underline">
                    {getCompanyName(order.buyer_id)}
                  </span>
                </p>
                <p className="text-xs text-on-surface-variant mt-1">{formatDate(order.created_at)}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-mono text-sm font-semibold text-on-surface">
                  {formatCurrency(order.total)}
                </p>
                <span
                  className={`px-2 py-0.5 mt-1 text-[10px] font-semibold rounded inline-block ${STATUS_COLOR[order.status]}`}
                >
                  {t(`dashboard.activity.status.${order.status}`)}
                </span>
              </div>
            </div>
          )
        })}

        {quote && (
          <div className="flex gap-4 p-4 hover:bg-surface-container-high/50 rounded-xl transition-colors relative z-10 group">
            <div className="w-10 h-10 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center shrink-0 shadow-[0_0_0_4px_white] group-hover:shadow-[0_0_0_4px_#e5eeff] transition-shadow">
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                mark_email_unread
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-on-surface">
                <span className="font-semibold">{t('dashboard.activity.quoteReceived')}</span>{' '}
                {t('dashboard.activity.quoteReceivedFrom')}{' '}
                <span className="text-primary cursor-pointer hover:underline">
                  {getCompanyName(quote.buyer_id)}
                </span>
              </p>
              {quote.buyer_note && (
                <div className="bg-surface p-3 mt-2 rounded-lg border border-surface-container-high">
                  <p className="text-xs text-on-surface-variant italic line-clamp-2">
                    &ldquo;{quote.buyer_note}&rdquo;
                  </p>
                </div>
              )}
              <p className="text-xs text-on-surface-variant mt-2">{formatDate(quote.created_at)}</p>
            </div>
            <div className="shrink-0">
              <a
                href={`/${locale}/seller/quotes`}
                className={buttonVariants({ variant: 'outline', size: 'sm' })}
              >
                {t('dashboard.activity.respond')}
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
