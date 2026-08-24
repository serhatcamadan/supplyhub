'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { formatCurrency, formatDate, cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import type { OrderWithDetails } from '@/types'
import { Avatar } from '@/components/ui/avatar'
import { TablePagination } from '@/components/ui/table-pagination'
import { TableEmptyRow } from '@/components/ui/table-empty-row'

type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered'

const STATUS_STYLE: Record<OrderStatus, { dot: string; badge: string }> = {
  delivered: { dot: 'bg-secondary',          badge: 'bg-secondary-container/20 text-secondary' },
  shipped:   { dot: 'bg-on-tertiary-container', badge: 'bg-tertiary-container/20 text-on-tertiary-container' },
  confirmed: { dot: 'bg-primary-fixed-dim',  badge: 'bg-primary-container/20 text-on-primary-container' },
  pending:   { dot: 'bg-outline',            badge: 'bg-surface-container-high text-on-surface-variant' },
}

function StatusBadge({ status, label }: { status: OrderStatus; label: string }) {
  const cfg = STATUS_STYLE[status]
  return (
    <span className={cn('inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider', cfg.badge)}>
      <span className={cn('w-1.5 h-1.5 rounded-full mr-1.5', cfg.dot)} />
      {label}
    </span>
  )
}

export function OrderHistoryTable({ orders }: { orders: OrderWithDetails[] }) {
  const t = useTranslations('buyer')
  const router = useRouter()
  const [reorderingId, setReorderingId] = useState<string | null>(null)

  const COLUMNS = [
    t('orders.table.orderId'),
    t('orders.table.supplier'),
    t('orders.table.date'),
    t('orders.table.total'),
    t('orders.table.status'),
    t('orders.table.action'),
  ]

  async function handleReorder(order: OrderWithDetails) {
    setReorderingId(order.id)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setReorderingId(null); return }

    const companyId = user.user_metadata?.company_id as string

    const { data: newOrder, error } = await supabase
      .from('orders')
      .insert({
        buyer_id: companyId,
        seller_id: order.seller.id,
        status: 'pending',
        total: order.total,
        needs_approval: false,
        created_by: user.id,
      })
      .select('id')
      .single()

    if (!error && newOrder && order.items.length > 0) {
      await supabase.from('order_items').insert(
        order.items.map((item) => ({
          order_id: newOrder.id,
          product_id: item.product.id,
          quantity: item.quantity,
          unit_price: item.unit_price,
        }))
      )
    }

    setReorderingId(null)
    router.refresh()
  }

  return (
    <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-180">
          <thead>
            <tr className="bg-surface-container-low border-b border-outline-variant/20">
              {COLUMNS.map((h, i) => (
                <th
                  key={h}
                  className={cn(
                    'px-6 py-4 text-xs font-semibold uppercase tracking-wider text-on-surface-variant whitespace-nowrap',
                    i >= 3 && i !== 4 ? 'text-right' : ''
                  )}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <TableEmptyRow icon="shopping_bag" message={t('orders.table.empty')} colSpan={6} />
            ) : (
              orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-outline-variant/10 hover:bg-surface-container-lowest/50 transition-colors group cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-mono text-sm text-primary font-medium">
                      #{order.id.toUpperCase()}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <Avatar name={order.seller.name} size="sm" colorScheme="surface" />
                      <span className="text-sm font-medium text-on-surface">{order.seller.name}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-variant">
                    {formatDate(order.created_at)}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="text-sm font-semibold text-on-surface">
                      {formatCurrency(order.total)}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge
                      status={order.status as OrderStatus}
                      label={t(`orders.table.status.${order.status as OrderStatus}`)}
                    />
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => handleReorder(order)}
                      disabled={reorderingId === order.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-low hover:bg-primary hover:text-on-primary text-primary rounded-lg text-xs font-semibold uppercase tracking-wider transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>refresh</span>
                      {reorderingId === order.id ? t('orders.table.reordering') : t('orders.table.reorder')}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <TablePagination
        label={t('orders.table.paginationShowing', {
          shown: Math.min(orders.length, 5),
          total: orders.length,
        })}
      />
    </div>
  )
}
