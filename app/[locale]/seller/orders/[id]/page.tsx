import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getTranslations, getLocale } from 'next-intl/server'
import { serverApiFetch, ApiError } from '@/lib/api/server-client'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Avatar } from '@/components/ui/avatar'
import { OrderStatusActions } from '@/components/seller/order-status-actions'
import type { OrderWithDetails, OrderStatus } from '@/types'
import { IconArrowLeft, IconLock } from '@tabler/icons-react'

const STATUS_STYLE: Record<OrderStatus, string> = {
  pending: 'bg-tertiary-container/20 text-on-tertiary-container',
  confirmed: 'bg-primary-fixed-dim/20 text-on-primary-fixed-variant',
  shipped: 'bg-primary/10 text-primary',
  delivered: 'bg-secondary/10 text-secondary',
}

function formatOrderId(id: string) {
  const num = id.split('-').pop() ?? id
  return `#ORD-${num.padStart(4, '0')}`
}

export default async function SellerOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [t, tCommon, locale] = await Promise.all([
    getTranslations('seller'),
    getTranslations('common'),
    getLocale(),
  ])

  let order: OrderWithDetails
  try {
    order = await serverApiFetch<OrderWithDetails>(`/orders/${id}`)
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound()
    if (err instanceof ApiError && err.status === 403) {
      return (
        <div className="h-[calc(100vh-4rem)] flex flex-col items-center justify-center gap-4 text-center px-8">
          <div className="w-16 h-16 rounded-full bg-error-container/20 flex items-center justify-center">
            <IconLock size={28} className="text-error" />
          </div>
          <div>
            <p className="font-semibold text-on-surface text-lg">{t('orders.detail.accessDenied')}</p>
            <p className="text-sm text-on-surface-variant mt-1">{t('orders.detail.accessDeniedHint')}</p>
          </div>
          <Link
            href={`/${locale}/seller/orders`}
            className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1.5"
          >
            <IconArrowLeft size={16} />
            {t('orders.detail.backToList')}
          </Link>
        </div>
      )
    }
    throw err
  }

  const STATUS_LABELS: Record<OrderStatus, string> = {
    pending: tCommon('status.pending'),
    confirmed: tCommon('status.confirmed'),
    shipped: tCommon('status.shipped'),
    delivered: tCommon('status.delivered'),
  }

  return (
    <div className="p-8 flex flex-col gap-6 max-w-360 mx-auto">

      <div className="flex justify-between items-end flex-wrap gap-4">
        <div className="flex flex-col gap-2">
          <Link
            href={`/${locale}/seller/orders`}
            className="text-xs font-semibold text-on-surface-variant hover:text-on-surface flex items-center gap-1 transition-colors w-fit"
          >
            <IconArrowLeft size={16} />
            {t('orders.detail.back')}
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-bold tracking-tight text-on-surface">{formatOrderId(order.id)}</h1>
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLE[order.status]}`}>
              {STATUS_LABELS[order.status]}
            </span>
          </div>
          <p className="text-sm text-on-surface-variant">{formatDate(order.created_at, locale)}</p>
        </div>
        <OrderStatusActions orderId={order.id} status={order.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container border-b border-outline-variant/30">
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                    {t('orders.detail.product')}
                  </th>
                  <th className="p-4 text-right text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                    {t('orders.detail.qty')}
                  </th>
                  <th className="p-4 text-right text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                    {t('orders.detail.unitPrice')}
                  </th>
                  <th className="p-4 text-right text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                    {t('orders.detail.lineTotal')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td className="p-4 text-sm font-medium text-on-surface">{item.product.name}</td>
                    <td className="p-4 text-right text-sm text-on-surface">{item.quantity}</td>
                    <td className="p-4 text-right text-sm text-on-surface-variant">
                      {formatCurrency(item.unit_price, locale)}
                    </td>
                    <td className="p-4 text-right text-sm font-semibold text-on-surface">
                      {formatCurrency(item.unit_price * item.quantity, locale)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-outline-variant/30">
                  <td colSpan={3} className="p-4 text-right text-sm font-semibold text-on-surface-variant">
                    {t('orders.detail.total')}
                  </td>
                  <td className="p-4 text-right text-lg font-bold text-on-surface">
                    {formatCurrency(order.total, locale)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 p-6 flex flex-col gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-2">
                {t('orders.detail.buyer')}
              </p>
              <div className="flex items-center gap-3">
                <Avatar name={order.buyer.name} size="md" colorScheme="surface" />
                <p className="text-sm font-semibold text-on-surface">{order.buyer.name}</p>
              </div>
            </div>

            <div className="border-t border-outline-variant/20 pt-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-2">
                {t('orders.detail.requestedBy')}
              </p>
              <div className="flex items-center gap-3">
                <Avatar name={order.created_by_user.name} size="md" colorScheme="secondary" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-on-surface truncate">{order.created_by_user.name}</p>
                  <p className="text-xs text-on-surface-variant truncate">{order.created_by_user.email}</p>
                </div>
              </div>
            </div>

            {order.needs_approval && (
              <div className="border-t border-outline-variant/20 pt-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-2">
                  {t('orders.detail.approval')}
                </p>
                <p className="text-sm text-on-surface">
                  {order.approved_by ? t('orders.detail.approved') : t('orders.detail.pendingApproval')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  )
}
