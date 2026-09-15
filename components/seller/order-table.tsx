'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { formatCurrency, formatDate, formatOrderId, cn } from '@/lib/utils'
import type { OrderStatus, OrderWithDetails } from '@/types'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { TablePagination } from '@/components/ui/table-pagination'
import { TableEmptyRow } from '@/components/ui/table-empty-row'
import { IconCircleCheck, IconChecks, IconShoppingBag, IconTruck } from '@tabler/icons-react'
import type { ElementType } from 'react'

const STATUS_STYLE: Record<
  OrderStatus,
  { className: string; dot?: boolean; icon?: ElementType }
> = {
  pending:   { className: 'bg-tertiary-container/20 text-on-tertiary-container', dot: true },
  confirmed: { className: 'bg-primary-fixed-dim/20 text-on-primary-fixed-variant', icon: IconCircleCheck },
  shipped:   { className: 'bg-primary/10 text-primary', icon: IconTruck },
  delivered: { className: 'bg-secondary/10 text-secondary', icon: IconChecks },
}

const AVATAR_COLOR_SCHEMES = [
  'bg-primary-container text-on-primary-container',
  'bg-secondary-container text-on-secondary-container',
  'bg-surface-variant text-on-surface-variant',
  'bg-tertiary-container/50 text-on-tertiary-container',
]

function OrderStatusBadge({ status, label }: { status: OrderStatus; label: string }) {
  const cfg = STATUS_STYLE[status]
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold', cfg.className)}>
      {cfg.dot && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
      {cfg.icon && <cfg.icon size={14} />}
      {label}
    </span>
  )
}

function RowActions({
  orderId,
  status,
  onStatusChange,
  labels,
}: {
  orderId: string
  status: OrderStatus
  onStatusChange: (id: string, status: OrderStatus) => void
  labels: { confirm: string; ship: string; deliver: string }
}) {
  return (
    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      {status === 'pending' && (
        <Button variant="primary" size="sm" onClick={() => onStatusChange(orderId, 'confirmed')}>{labels.confirm}</Button>
      )}
      {status === 'confirmed' && (
        <Button variant="primary" size="sm" onClick={() => onStatusChange(orderId, 'shipped')}>{labels.ship}</Button>
      )}
      {status === 'shipped' && (
        <Button variant="secondary" size="sm" onClick={() => onStatusChange(orderId, 'delivered')}>{labels.deliver}</Button>
      )}
    </div>
  )
}

export function OrderTable({
  orders,
  onStatusChange,
}: {
  orders: OrderWithDetails[]
  onStatusChange: (id: string, status: OrderStatus) => void
}) {
  const t = useTranslations('seller')
  const tCommon = useTranslations('common')
  const locale = useLocale()

  const ITEMS_PER_PAGE = 10
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(orders.length / ITEMS_PER_PAGE))
  const page = Math.min(currentPage, totalPages)
  const paged = orders.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const STATUS_LABELS: Record<OrderStatus, string> = {
    pending:   tCommon('status.pending'),
    confirmed: tCommon('status.confirmed'),
    shipped:   tCommon('status.shipped'),
    delivered: tCommon('status.delivered'),
  }

  const headers = [
    t('orders.table.orderId'),
    t('orders.table.buyer'),
    t('orders.table.date'),
    t('orders.table.items'),
    t('orders.table.total'),
    t('orders.table.status'),
    t('orders.table.actionsCol'),
  ]

  const rowActionLabels = {
    confirm: t('orders.table.rowActions.confirm'),
    ship:    t('orders.table.rowActions.ship'),
    deliver: t('orders.table.rowActions.deliver'),
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse min-w-200">
          <thead className="sticky top-0 bg-surface-container-lowest z-10 shadow-[0_1px_0_rgba(0,0,0,0.05)]">
            <tr>
              {headers.map((h, i) => (
                <th
                  key={h}
                  className={cn(
                    'py-3 px-6 text-xs font-semibold uppercase tracking-wider text-on-surface-variant',
                    i === 4 && 'text-right',
                    i === 6 && 'text-right'
                  )}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-outline-variant/20">
            {orders.length === 0 ? (
              <TableEmptyRow icon={IconShoppingBag} message={t('orders.table.noResults')} colSpan={7} />
            ) : (
              paged.map((order, i) => (
                <tr
                  key={order.id}
                  className="hover:bg-surface-container-low/50 transition-colors group"
                >
                  <td className="py-4 px-6">
                    <Link
                      href={`/${locale}/seller/orders/${order.id}`}
                      className="font-mono text-sm text-primary font-medium hover:underline"
                    >
                      {formatOrderId(order.id)}
                    </Link>
                    {order.needs_approval && !order.approved_by && (
                      <p className="text-[10px] text-on-tertiary-container font-semibold mt-0.5">
                        {t('orders.table.awaitingApproval')}
                      </p>
                    )}
                  </td>

                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <Avatar
                        name={order.buyer.name}
                        size="sm"
                        className={AVATAR_COLOR_SCHEMES[i % AVATAR_COLOR_SCHEMES.length]}
                      />
                      <div>
                        <Link
                          href={`/${locale}/seller/buyers/${order.buyer.id}`}
                          className="text-sm font-semibold text-on-surface leading-tight hover:text-primary hover:underline transition-colors block"
                        >
                          {order.buyer.name}
                        </Link>
                        <p className="text-xs text-on-surface-variant">
                          {order.created_by_user.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-6 text-sm text-on-surface-variant">
                    {formatDate(order.created_at, locale)}
                  </td>

                  <td className="py-4 px-6">
                    <span className="text-sm text-on-surface">{order.items.length}</span>
                    <p className="text-xs text-on-surface-variant mt-0.5 max-w-30 truncate">
                      {order.items.map((item) => item.product.name).join(', ')}
                    </p>
                  </td>

                  <td className="py-4 px-6 text-right">
                    <span className="font-mono text-sm font-semibold text-on-surface">
                      {formatCurrency(order.total, locale)}
                    </span>
                  </td>

                  <td className="py-4 px-6">
                    <OrderStatusBadge
                      status={order.status}
                      label={STATUS_LABELS[order.status]}
                    />
                  </td>

                  <td className="py-4 px-6">
                    <RowActions
                      orderId={order.id}
                      status={order.status}
                      onStatusChange={onStatusChange}
                      labels={rowActionLabels}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <TablePagination
        label={t('orders.table.pagination', { shown: paged.length, total: orders.length })}
        page={page}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}
