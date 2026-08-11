'use client'

import { useState } from 'react'
import { quoteRequests, products, companies } from '@/lib/mock-data'
import { formatCurrency } from '@/lib/utils'
import { QuoteControls, type QuoteTab } from '@/components/seller/quote-controls'
import { QuoteTable, type EnrichedQuote } from '@/components/seller/quote-table'

const SELLER_ID = 'company-seller-1'

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000

function getInitials(name: string) {
  return name
    .split(' ')
    .filter((w) => w.length > 2 && !w.includes('.'))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')
}

export default function SellerQuotesPage() {
  const [tab, setTab] = useState<QuoteTab>('all')
  const [search, setSearch] = useState('')

  const sellerProductIds = new Set(
    products.filter((p) => p.seller_id === SELLER_ID).map((p) => p.id)
  )
  const relevantQuotes = quoteRequests.filter((q) => sellerProductIds.has(q.product_id))

  // Stats
  const pendingCount = relevantQuotes.filter((q) => q.status === 'pending').length
  const closedCount = relevantQuotes.filter(
    (q) => q.status === 'accepted' || q.status === 'declined'
  ).length
  const acceptedCount = relevantQuotes.filter((q) => q.status === 'accepted').length
  const conversionRate = closedCount > 0 ? Math.round((acceptedCount / closedCount) * 100) : 0
  const pipelineValue = relevantQuotes
    .filter((q) => q.status === 'pending')
    .reduce((sum, q) => {
      const product = products.find((p) => p.id === q.product_id)
      return sum + q.quantity * (product?.price_tiers[0]?.price ?? 0)
    }, 0)

  // Enrich quotes with buyer/product info
  const enriched: EnrichedQuote[] = relevantQuotes.map((q) => {
    const buyer = companies.find((c) => c.id === q.buyer_id)
    const product = products.find((p) => p.id === q.product_id)
    const listPrice =
      product?.price_tiers.find(
        (t) => q.quantity >= t.min_qty && (t.max_qty === null || q.quantity <= t.max_qty)
      )?.price ?? null
    const ageMs = Date.now() - new Date(q.created_at).getTime()

    return {
      ...q,
      buyerName: buyer?.name ?? q.buyer_id,
      buyerInitials: buyer ? getInitials(buyer.name) : '??',
      productName: product?.name ?? q.product_id,
      productCategory: product?.category ?? '—',
      listPrice,
      isExpiring: ageMs > SEVEN_DAYS_MS,
    }
  })

  // Tab filter
  const byTab = enriched.filter((q) => {
    if (tab === 'pending') return q.status === 'pending'
    if (tab === 'responded') return q.status === 'responded'
    if (tab === 'archived') return q.status === 'accepted' || q.status === 'declined'
    return true
  })

  // Search filter
  const filtered = search
    ? byTab.filter(
        (q) =>
          q.id.toLowerCase().includes(search.toLowerCase()) ||
          q.buyerName.toLowerCase().includes(search.toLowerCase()) ||
          q.productName.toLowerCase().includes(search.toLowerCase())
      )
    : byTab

  return (
    <div className="p-8 flex flex-col gap-8">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-on-surface">Quote Requests</h1>
          <p className="text-sm text-on-surface-variant mt-2">
            Manage incoming RFQs and respond to potential buyers.
          </p>
        </div>
        <button className="h-10 px-4 inline-flex items-center gap-2 bg-surface text-primary border border-outline-variant rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-surface-container-low transition-colors shadow-sm">
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>download</span>
          Export CSV
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
          <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-2">
            Total Active RFQs
          </p>
          <p className="text-4xl font-bold text-on-surface">{relevantQuotes.length}</p>
        </div>

        <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-tertiary-container/20 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-2">
                Pending Response
              </p>
              <p className="text-4xl font-bold text-on-surface">{pendingCount}</p>
            </div>
            <span className="material-symbols-outlined text-on-tertiary-container bg-tertiary-container/30 p-2 rounded-lg shrink-0">
              schedule
            </span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-secondary-fixed-dim/20 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-2">
                Converted (30d)
              </p>
              <p className="text-4xl font-bold text-on-surface">{conversionRate}%</p>
            </div>
            <span className="material-symbols-outlined text-secondary bg-secondary-fixed/30 p-2 rounded-lg shrink-0">
              trending_up
            </span>
          </div>
        </div>

        <div className="bg-primary p-5 rounded-xl shadow-md relative overflow-hidden text-on-primary">
          <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-xl -mr-10 -mt-10" />
          <p className="text-xs font-semibold uppercase tracking-wider mb-2 text-on-primary/80">
            Est. Pipeline Value
          </p>
          <p className="text-4xl font-bold tracking-tight relative z-10">
            {formatCurrency(pipelineValue)}
          </p>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-surface-container-lowest rounded-xl shadow-md flex flex-col overflow-hidden">
        <QuoteControls
          tab={tab}
          onTab={setTab}
          search={search}
          onSearch={setSearch}
        />
        <QuoteTable quotes={filtered} />
      </div>

    </div>
  )
}
