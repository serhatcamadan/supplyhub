'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency } from '@/lib/utils'
import type { OrderStatus, OrderWithDetails } from '@/types'
import { TableControls } from '@/components/seller/table-controls'
import { OrderTable } from '@/components/seller/order-table'

type OrderTab = 'all' | 'pending' | 'confirmed' | 'shipped' | 'delivered'

export default function SellerOrdersPage() {
  const t = useTranslations('seller')
  const [tab, setTab]             = useState<OrderTab>('all')
  const [search, setSearch]       = useState('')
  const [allOrders, setAllOrders] = useState<OrderWithDetails[]>([])

  const TABS = [
    { value: 'all',       label: t('orders.tabs.all') },
    { value: 'pending',   label: t('orders.tabs.pending') },
    { value: 'confirmed', label: t('orders.tabs.confirmed') },
    { value: 'shipped',   label: t('orders.tabs.shipped') },
    { value: 'delivered', label: t('orders.tabs.delivered') },
  ]

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      const companyId = user?.user_metadata?.company_id
      if (!companyId) return

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
        .eq('seller_id', companyId)
        .order('created_at', { ascending: false })

      setAllOrders((data as unknown as OrderWithDetails[]) ?? [])
    }
    load()
  }, [])

  const pendingCount = allOrders.filter((o) => o.status === 'pending').length
  const shippedCount = allOrders.filter((o) => o.status === 'shipped').length
  const totalRevenue = allOrders.reduce((sum, o) => sum + o.total, 0)

  async function handleStatusChange(orderId: string, newStatus: OrderStatus) {
    const supabase = createClient()
    await supabase.from('orders').update({ status: newStatus }).eq('id', orderId)
    setAllOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)))
  }

  const byTab    = allOrders.filter((o) => tab === 'all' || o.status === tab)
  const filtered = search
    ? byTab.filter(
        (o) =>
          o.id.includes(search.toLowerCase()) ||
          o.buyer.name.toLowerCase().includes(search.toLowerCase())
      )
    : byTab

  return (
    <div className="p-8 flex flex-col gap-8">

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-on-surface">{t('orders.heading')}</h1>
          <p className="text-sm text-on-surface-variant mt-2">{t('orders.subHeading')}</p>
        </div>
        <div className="flex gap-3">
          <button className="h-10 px-4 inline-flex items-center gap-2 bg-surface text-on-surface border border-outline-variant rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-surface-container-low transition-colors shadow-sm">
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>filter_list</span>
            {t('orders.filter')}
          </button>
          <button className="h-10 px-4 inline-flex items-center gap-2 bg-surface text-primary border border-outline-variant rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-surface-container-low transition-colors shadow-sm">
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>download</span>
            {t('orders.exportCsv')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
          <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-2">{t('orders.stats.totalOrders')}</p>
          <p className="text-4xl font-bold text-on-surface">{allOrders.length}</p>
        </div>

        <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-tertiary-container/20 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-2">{t('orders.stats.awaitingAction')}</p>
              <p className="text-4xl font-bold text-on-surface">{pendingCount}</p>
            </div>
            <span className="material-symbols-outlined text-on-tertiary-container bg-tertiary-container/30 p-2 rounded-lg shrink-0">schedule</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-primary-fixed-dim/20 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-2">{t('orders.stats.inTransit')}</p>
              <p className="text-4xl font-bold text-on-surface">{shippedCount}</p>
            </div>
            <span className="material-symbols-outlined text-on-primary-fixed-variant bg-primary-fixed-dim/30 p-2 rounded-lg shrink-0">local_shipping</span>
          </div>
        </div>

        <div className="bg-primary p-5 rounded-xl shadow-md relative overflow-hidden text-on-primary">
          <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-xl -mr-10 -mt-10" />
          <p className="text-xs font-semibold uppercase tracking-wider mb-2 text-on-primary/80">{t('orders.stats.totalRevenue')}</p>
          <p className="text-4xl font-bold tracking-tight relative z-10">{formatCurrency(totalRevenue)}</p>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-md flex flex-col overflow-hidden">
        <TableControls
          tabs={TABS}
          activeTab={tab}
          onTabChange={(v) => setTab(v as OrderTab)}
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder={t('orders.searchPlaceholder')}
        />
        <OrderTable orders={filtered} onStatusChange={handleStatusChange} />
      </div>

    </div>
  )
}
