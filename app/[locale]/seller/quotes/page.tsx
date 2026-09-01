'use client'

import { useState, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { getQuoteRequests } from '@/lib/api/quotes'
import { formatCurrency, getInitials } from '@/lib/utils'
import { TableControls } from '@/components/seller/table-controls'
import { QuoteTable, type EnrichedQuote } from '@/components/seller/quote-table'
import { PageHeaderSkeleton } from '@/components/skeletons/page-header-skeleton'
import { StatCardsSkeleton } from '@/components/skeletons/stat-cards-skeleton'
import { TableSkeleton } from '@/components/skeletons/table-skeleton'
import { IconClock, IconDownload, IconTrendingUp } from '@tabler/icons-react'

type QuoteTab = 'all' | 'pending' | 'responded' | 'archived'

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000

export default function SellerQuotesPage() {
  const t = useTranslations('seller')
  const locale = useLocale()
  const [tab, setTab]           = useState<QuoteTab>('all')
  const [search, setSearch]     = useState('')
  const [enriched, setEnriched] = useState<EnrichedQuote[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const TABS = [
    { value: 'all',       label: t('quotes.tabs.all') },
    { value: 'pending',   label: t('quotes.tabs.pending') },
    { value: 'responded', label: t('quotes.tabs.responded') },
    { value: 'archived',  label: t('quotes.tabs.archived') },
  ]

  useEffect(() => {
    getQuoteRequests()
      .then((quotes) => {
        const result: EnrichedQuote[] = quotes.map((q) => {
          const buyerName = q.buyer.name
          const listPrice =
            q.product.price_tiers.find(
              (tier) =>
                q.quantity >= tier.min_qty &&
                (tier.max_qty === null || q.quantity <= tier.max_qty)
            )?.price ?? null
          const ageMs = Date.now() - new Date(q.created_at).getTime()
          return {
            ...q,
            buyerName,
            buyerInitials: getInitials(buyerName),
            productName: q.product.name,
            productCategory: q.product.category,
            listPrice,
            isExpiring: ageMs > SEVEN_DAYS_MS,
          }
        })
        setEnriched(result)
      })
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [])

  if (isLoading) {
    return (
      <div className="p-8 flex flex-col gap-8">
        <PageHeaderSkeleton actionCount={1} />
        <StatCardsSkeleton count={4} />
        <div className="bg-surface-container-lowest rounded-xl shadow-md flex flex-col overflow-hidden">
          <TableSkeleton rows={6} cols={5} />
        </div>
      </div>
    )
  }

  const pendingCount   = enriched.filter((q) => q.status === 'pending').length
  const closedCount    = enriched.filter((q) => q.status === 'accepted' || q.status === 'declined').length
  const acceptedCount  = enriched.filter((q) => q.status === 'accepted').length
  const conversionRate = closedCount > 0 ? Math.round((acceptedCount / closedCount) * 100) : 0
  const pipelineValue  = enriched
    .filter((q) => q.status === 'pending')
    .reduce((sum, q) => sum + q.quantity * (q.listPrice ?? 0), 0)

  const byTab = enriched.filter((q) => {
    if (tab === 'pending')   return q.status === 'pending'
    if (tab === 'responded') return q.status === 'responded'
    if (tab === 'archived')  return q.status === 'accepted' || q.status === 'declined'
    return true
  })

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

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-on-surface">{t('quotes.heading')}</h1>
          <p className="text-sm text-on-surface-variant mt-2">{t('quotes.subHeading')}</p>
        </div>
        <button className="h-10 px-4 inline-flex items-center gap-2 bg-surface text-primary border border-outline-variant rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-surface-container-low transition-colors shadow-sm">
          <IconDownload size={18} />
          {t('quotes.exportCsv')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
          <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-2">{t('quotes.stats.totalActive')}</p>
          <p className="text-4xl font-bold text-on-surface">{enriched.length}</p>
        </div>

        <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-tertiary-container/20 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-2">{t('quotes.stats.pendingResponse')}</p>
              <p className="text-4xl font-bold text-on-surface">{pendingCount}</p>
            </div>
            <IconClock className="text-on-tertiary-container bg-tertiary-container/30 p-2 rounded-lg shrink-0" />
          </div>
        </div>

        <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-secondary-fixed-dim/20 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-2">{t('quotes.stats.converted')}</p>
              <p className="text-4xl font-bold text-on-surface">{conversionRate}%</p>
            </div>
            <IconTrendingUp className="text-secondary bg-secondary-fixed/30 p-2 rounded-lg shrink-0" />
          </div>
        </div>

        <div className="bg-primary p-5 rounded-xl shadow-md relative overflow-hidden text-on-primary">
          <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-xl -mr-10 -mt-10" />
          <p className="text-xs font-semibold uppercase tracking-wider mb-2 text-on-primary/80">{t('quotes.stats.pipelineValue')}</p>
          <p className="text-4xl font-bold tracking-tight relative z-10">{formatCurrency(pipelineValue, locale)}</p>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-md flex flex-col overflow-hidden">
        <TableControls
          tabs={TABS}
          activeTab={tab}
          onTabChange={(v) => setTab(v as QuoteTab)}
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder={t('quotes.searchPlaceholder')}
        />
        <QuoteTable quotes={filtered} />
      </div>

    </div>
  )
}
