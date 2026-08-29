import { getTranslations, getLocale } from 'next-intl/server'
import { createServiceClient } from '@/lib/supabase/server'
import { getServerUser } from '@/lib/auth/server'
import { formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { OrderStatCards } from '@/components/buyer/order-stat-cards'
import { OrderHistoryTable } from '@/components/buyer/order-history-table'
import { OrdersCsvButton } from '@/components/buyer/orders-csv-button'
import type { OrderWithDetails } from '@/types'
import { IconFilter } from '@tabler/icons-react'

export default async function BuyerOrdersPage() {
  const [user, t, locale] = await Promise.all([getServerUser(), getTranslations('buyer'), getLocale()])
  const supabase = createServiceClient()
  const companyId = user?.companyId ?? ''

  const { data } = await supabase
    .from('orders')
    .select(`
      *,
      buyer:companies!orders_buyer_id_fkey(*),
      seller:companies!orders_seller_id_fkey(*),
      created_by_user:users!orders_created_by_fkey(*),
      approved_by_user:users!orders_approved_by_fkey(*),
      items:order_items(*, product:products(*))
    `)
    .eq('buyer_id', companyId)
    .order('created_at', { ascending: false })

  const orders = (data as unknown as OrderWithDetails[]) ?? []

  const totalSpend = orders.reduce((sum, o) => sum + o.total, 0)
  const inTransit  = orders.filter((o) => o.status === 'shipped').length

  return (
    <div className="px-8 py-8 max-w-360 mx-auto space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-bold text-on-surface">{t('orders.heading')}</h1>
          <p className="text-sm text-on-surface-variant mt-2">{t('orders.subHeading')}</p>
        </div>
        <div className="flex gap-3">
          <OrdersCsvButton orders={orders} />
          <Button variant="primary" size="md">
            <IconFilter size={18} />
            {t('orders.filter')}
          </Button>
        </div>
      </div>

      <OrderStatCards
        totalOrders={orders.length}
        totalSpend={formatCurrency(totalSpend, locale)}
        inTransit={inTransit}
      />

      <OrderHistoryTable orders={orders} />
    </div>
  )
}
