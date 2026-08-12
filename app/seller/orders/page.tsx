'use client'

import { useState } from 'react'
import { getOrdersWithDetails } from '@/lib/mock-data'
import { formatCurrency } from '@/lib/utils'
import { OrderControls, type OrderTab } from '@/components/seller/order-controls'
import { OrderTable } from '@/components/seller/order-table'

const SELLER_ID = 'company-seller-1'

export default function SellerOrdersPage() {
  const [tab, setTab] = useState<OrderTab>('all')
  const [search, setSearch] = useState('')

  const allOrders = getOrdersWithDetails().filter((o) => o.seller_id === SELLER_ID)

  // Stats
  const pendingCount = allOrders.filter((o) => o.status === 'pending').length
  const shippedCount = allOrders.filter((o) => o.status === 'shipped').length
  const totalRevenue = allOrders.reduce((sum, o) => sum + o.total, 0)

  // Tab filter
  const byTab = allOrders.filter((o) => tab === 'all' || o.status === tab)

  // Search filter
  const filtered = search
    ? byTab.filter(
        (o) =>
          o.id.includes(search.toLowerCase()) ||
          o.buyer.name.toLowerCase().includes(search.toLowerCase())
      )
    : byTab

  return (
    <div className="p-8 flex flex-col gap-8">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-on-surface">Orders</h1>
          <p className="text-sm text-on-surface-variant mt-2">
            Manage and track wholesale orders from your buyers.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="h-10 px-4 inline-flex items-center gap-2 bg-surface text-on-surface border border-outline-variant rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-surface-container-low transition-colors shadow-sm">
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>filter_list</span>
            Filter
          </button>
          <button className="h-10 px-4 inline-flex items-center gap-2 bg-surface text-primary border border-outline-variant rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-surface-container-low transition-colors shadow-sm">
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>download</span>
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
          <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-2">
            Total Orders
          </p>
          <p className="text-4xl font-bold text-on-surface">{allOrders.length}</p>
        </div>

        <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-tertiary-container/20 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-2">
                Awaiting Action
              </p>
              <p className="text-4xl font-bold text-on-surface">{pendingCount}</p>
            </div>
            <span className="material-symbols-outlined text-on-tertiary-container bg-tertiary-container/30 p-2 rounded-lg shrink-0">
              schedule
            </span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-primary-fixed-dim/20 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-2">
                In Transit
              </p>
              <p className="text-4xl font-bold text-on-surface">{shippedCount}</p>
            </div>
            <span className="material-symbols-outlined text-on-primary-fixed-variant bg-primary-fixed-dim/30 p-2 rounded-lg shrink-0">
              local_shipping
            </span>
          </div>
        </div>

        <div className="bg-primary p-5 rounded-xl shadow-md relative overflow-hidden text-on-primary">
          <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-xl -mr-10 -mt-10" />
          <p className="text-xs font-semibold uppercase tracking-wider mb-2 text-on-primary/80">
            Total Revenue
          </p>
          <p className="text-4xl font-bold tracking-tight relative z-10">
            {formatCurrency(totalRevenue)}
          </p>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-surface-container-lowest rounded-xl shadow-md flex flex-col overflow-hidden">
        <OrderControls
          tab={tab}
          onTab={setTab}
          search={search}
          onSearch={setSearch}
        />
        <OrderTable orders={filtered} />
      </div>

    </div>
  )
}
