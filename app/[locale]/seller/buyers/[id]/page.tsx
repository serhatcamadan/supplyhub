import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getTranslations, getLocale } from 'next-intl/server'
import { serverApiFetch, ApiError } from '@/lib/api/server-client'
import { formatCurrency, formatDate, formatOrderId } from '@/lib/utils'
import { Avatar } from '@/components/ui/avatar'
import type { OrderWithDetails, OrderStatus, CompanyType } from '@/types'
import { IconArrowLeft, IconBuildingStore, IconCalendarStats, IconReceipt2, IconShoppingBag } from '@tabler/icons-react'

interface CompanyDetail {
  id: string
  name: string
  type: CompanyType
  industry: string | null
  created_at: string
}

const STATUS_STYLE: Record<OrderStatus, string> = {
  pending: 'bg-tertiary-container/20 text-on-tertiary-container',
  confirmed: 'bg-primary-fixed-dim/20 text-on-primary-fixed-variant',
  shipped: 'bg-primary/10 text-primary',
  delivered: 'bg-secondary/10 text-secondary',
}

const INDUSTRY_KEYS = ['manufacturing', 'retail', 'food', 'electronics', 'apparel', 'other']

export default async function SellerBuyerDetailPage({
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

  let company: CompanyDetail
  try {
    company = await serverApiFetch<CompanyDetail>(`/companies/${id}`)
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound()
    throw err
  }

  const allOrders = await serverApiFetch<OrderWithDetails[]>('/orders').catch(() => [] as OrderWithDetails[])
  const buyerOrders = allOrders
    .filter((o) => o.buyer.id === id)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  const totalRevenue = buyerOrders
    .filter((o) => o.status === 'delivered')
    .reduce((sum, o) => sum + o.total, 0)

  const customerSince = buyerOrders.length > 0 ? buyerOrders[buyerOrders.length - 1].created_at : null

  const STATUS_LABELS: Record<OrderStatus, string> = {
    pending: tCommon('status.pending'),
    confirmed: tCommon('status.confirmed'),
    shipped: tCommon('status.shipped'),
    delivered: tCommon('status.delivered'),
  }

  const industryLabel = company.industry && INDUSTRY_KEYS.includes(company.industry)
    ? tCommon(`profileEdit.industries.${company.industry}`)
    : company.industry

  return (
    <div className="p-8 flex flex-col gap-6 max-w-360 mx-auto">

      <Link
        href={`/${locale}/seller/orders`}
        className="text-xs font-semibold text-on-surface-variant hover:text-on-surface flex items-center gap-1 transition-colors w-fit"
      >
        <IconArrowLeft size={16} />
        {t('buyers.detail.back')}
      </Link>

      <div className="flex items-center gap-4">
        <Avatar name={company.name} size="xl" colorScheme="surface" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-on-surface">{company.name}</h1>
          {industryLabel && (
            <span className="inline-flex items-center gap-1.5 mt-1 px-2.5 py-1 bg-surface-container-high text-on-surface-variant text-xs font-semibold rounded-md">
              <IconBuildingStore size={14} />
              {industryLabel}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm flex items-center gap-4">
          <div className="p-2.5 bg-primary-container/20 rounded-lg text-on-primary-container shrink-0">
            <IconShoppingBag size={20} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
              {t('buyers.detail.totalOrders')}
            </p>
            <p className="text-2xl font-bold text-on-surface">{buyerOrders.length}</p>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm flex items-center gap-4">
          <div className="p-2.5 bg-secondary-container/20 rounded-lg text-secondary shrink-0">
            <IconReceipt2 size={20} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
              {t('buyers.detail.totalRevenue')}
            </p>
            <p className="text-2xl font-bold text-on-surface">{formatCurrency(totalRevenue, locale)}</p>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm flex items-center gap-4">
          <div className="p-2.5 bg-tertiary-container/20 rounded-lg text-on-tertiary-container shrink-0">
            <IconCalendarStats size={20} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
              {t('buyers.detail.customerSince')}
            </p>
            <p className="text-2xl font-bold text-on-surface">
              {customerSince ? formatDate(customerSince, locale) : '—'}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
        <div className="px-6 py-4 border-b border-outline-variant/20">
          <h2 className="text-lg font-semibold text-on-surface">{t('buyers.detail.orderHistory')}</h2>
        </div>

        {buyerOrders.length === 0 ? (
          <p className="p-8 text-center text-sm text-on-surface-variant">{t('buyers.detail.noOrders')}</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container border-b border-outline-variant/30">
                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                  {t('orders.table.orderId')}
                </th>
                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                  {t('orders.table.date')}
                </th>
                <th className="p-4 text-right text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                  {t('orders.table.total')}
                </th>
                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                  {t('orders.table.status')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {buyerOrders.map((order) => (
                <tr key={order.id} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="p-4">
                    <Link
                      href={`/${locale}/seller/orders/${order.id}`}
                      className="font-mono text-sm text-primary font-medium hover:underline"
                    >
                      {formatOrderId(order.id)}
                    </Link>
                  </td>
                  <td className="p-4 text-sm text-on-surface-variant">{formatDate(order.created_at, locale)}</td>
                  <td className="p-4 text-right text-sm font-semibold text-on-surface">
                    {formatCurrency(order.total, locale)}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLE[order.status]}`}>
                      {STATUS_LABELS[order.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  )
}
