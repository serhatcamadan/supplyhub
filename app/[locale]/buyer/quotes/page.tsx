import Link from 'next/link'
import { getTranslations, getLocale } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { BuyerQuoteTable } from '@/components/buyer/buyer-quote-table'
import type { BuyerEnrichedQuote } from '@/components/buyer/buyer-quote-table'
import type { QuoteRequestWithDetails } from '@/types'
import { IconPlus } from '@tabler/icons-react'

export default async function BuyerQuotesPage() {
  const [supabase, t, locale] = await Promise.all([createClient(), getTranslations('buyer'), getLocale()])
  const { data: { user } } = await supabase.auth.getUser()
  const companyId = user?.user_metadata?.company_id as string

  const { data } = await supabase
    .from('quote_requests')
    .select(`*, product:products(*), buyer:companies!quote_requests_buyer_id_fkey(*)`)
    .eq('buyer_id', companyId)
    .order('created_at', { ascending: false })

  const rawQuotes = (data as unknown as QuoteRequestWithDetails[]) ?? []

  const quotes: BuyerEnrichedQuote[] = rawQuotes.map((q) => ({
    ...q,
    productName: q.product.name,
    productCategory: q.product.category,
    sellerResponsePrice: q.seller_response_price,
  }))

  const totalCount = quotes.length
  const pendingCount = quotes.filter((q) => q.status === 'pending').length
  const respondedCount = quotes.filter((q) => q.status === 'responded').length

  const stats = [
    { label: t('quotes.list.stats.total'),     value: totalCount },
    { label: t('quotes.list.stats.pending'),   value: pendingCount },
    { label: t('quotes.list.stats.responded'), value: respondedCount },
  ]

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">

      <div className="px-8 py-6 border-b border-outline-variant/20 bg-surface-container-lowest">
        <div className="flex items-end justify-between max-w-360 mx-auto">
          <div>
            <h1 className="text-3xl font-bold text-on-surface">{t('quotes.list.heading')}</h1>
            <p className="text-sm text-on-surface-variant mt-1">{t('quotes.list.subHeading')}</p>
          </div>
          <Link href={`/${locale}/buyer/quotes/new`}>
            <Button variant="primary" size="md">
              <IconPlus size={18} />
              {t('quotes.list.newButton')}
            </Button>
          </Link>
        </div>

        <div className="flex gap-6 mt-6 max-w-360 mx-auto">
          {stats.map((s) => (
            <div key={s.label} className="bg-surface-container rounded-xl px-5 py-3 border border-outline-variant/20">
              <p className="text-xs text-on-surface-variant font-medium uppercase tracking-wider">{s.label}</p>
              <p className="text-2xl font-bold text-on-surface mt-0.5">{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 min-h-0 flex flex-col max-w-360 mx-auto w-full px-8 py-6">
        <div className="flex-1 min-h-0 bg-surface-container-lowest rounded-2xl border border-outline-variant/20 shadow-sm overflow-hidden flex flex-col">
          <BuyerQuoteTable quotes={quotes} />
        </div>
      </div>

    </div>
  )
}
