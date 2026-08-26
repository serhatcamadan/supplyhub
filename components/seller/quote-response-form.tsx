'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { QuoteSentScreen } from '@/components/seller/quote-sent-screen'
import { createClient } from '@/lib/supabase/client'
import { IconCalendarEvent, IconChevronDown, IconDeviceFloppy, IconSend } from '@tabler/icons-react'

interface QuoteResponseFormProps {
  quoteId: string
  quantity: number
  listPrice: number | null
  existingResponse: {
    price: number | null
    message: string | null
  }
}

function defaultValidUntil() {
  const d = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  return d.toISOString().split('T')[0]
}

export function QuoteResponseForm({
  quoteId,
  quantity,
  listPrice,
  existingResponse,
}: QuoteResponseFormProps) {
  const t = useTranslations('seller')
  const initialPrice = existingResponse.price ?? listPrice ?? 0
  const [price, setPrice] = useState<number>(initialPrice)
  const [volumeDiscount, setVolumeDiscount] = useState(false)
  const [leadTime, setLeadTime] = useState('14-21')
  const [validUntil, setValidUntil] = useState(defaultValidUntil())
  const [message, setMessage] = useState(existingResponse.message ?? '')
  const [savedAt, setSavedAt]   = useState<number | null>(existingResponse.price !== null ? Date.now() : null)
  const [isSent, setIsSent]     = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const total   = price * quantity
  const isSaved = savedAt !== null

  const LEAD_TIME_OPTIONS = [
    { value: '7-14',  label: t('quotes.response.leadTimeOptions.7-14') },
    { value: '14-21', label: t('quotes.response.leadTimeOptions.14-21') },
    { value: '21-30', label: t('quotes.response.leadTimeOptions.21-30') },
    { value: '30+',   label: t('quotes.response.leadTimeOptions.30+') },
  ]

  async function handleSaveDraft() {
    setIsSaving(true)
    const supabase = createClient()
    await supabase
      .from('quote_requests')
      .update({ seller_response_price: price, seller_message: message })
      .eq('id', quoteId)
    setSavedAt(Date.now())
    setIsSaving(false)
  }

  async function handleSend() {
    const supabase = createClient()
    await supabase
      .from('quote_requests')
      .update({ seller_response_price: price, seller_message: message, status: 'responded' })
      .eq('id', quoteId)
    setIsSent(true)
  }

  if (isSent) {
    return <QuoteSentScreen />
  }

  return (
    <div className="flex-1 flex flex-col bg-surface-container-lowest rounded-2xl shadow-xl overflow-hidden border border-outline-variant/20 relative">

      {/* Decorative orb */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-secondary-container rounded-full blur-[100px] opacity-20 pointer-events-none" />

      {/* Header */}
      <div className="p-6 border-b border-outline-variant/20 flex justify-between items-center bg-surface/50 backdrop-blur-sm z-10 shrink-0">
        <h2 className="text-2xl font-semibold text-on-surface">{t('quotes.response.heading')}</h2>
        <span className="px-3 py-1 bg-surface-container-high rounded-full text-xs font-semibold text-on-surface-variant flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full transition-colors ${isSaved ? 'bg-secondary' : 'bg-on-tertiary-container'}`} />
          {isSaved ? t('quotes.response.draftSaved') : t('quotes.response.unsaved')}
        </span>
      </div>

      {/* Body */}
      <div className="p-8 flex-1 overflow-y-auto z-10 flex flex-col gap-8">

        {/* Pricing Proposal */}
        <div className="space-y-6">
          <h3 className="text-base font-semibold text-on-surface border-b border-outline-variant/20 pb-2">
            {t('quotes.response.pricingProposal')}
          </h3>

          <div className="bg-surface rounded-xl p-5 border border-outline-variant/20">
            <div className="flex justify-between items-end mb-3">
              <label className="text-base font-semibold text-on-surface">{t('quotes.response.unitPrice')}</label>
              {listPrice && (
                <span className="text-xs text-on-surface-variant">
                  {t('quotes.response.listPriceLabel')} {formatCurrency(listPrice)}/{t('quotes.response.perUnit')}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="relative flex-1 group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-mono text-sm group-focus-within:text-primary transition-colors">
                  ₺
                </span>
                <input
                  type="number"
                  step="0.01"
                  min={0}
                  value={price}
                  data-testid="response-price"
                  onChange={(e) => {
                    setPrice(parseFloat(e.target.value) || 0)
                    setSavedAt(null)
                  }}
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-3 pl-8 pr-4 font-mono text-base text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
                />
              </div>
              <span className="text-sm text-on-surface-variant shrink-0">{t('quotes.response.perUnit')}</span>
              <div className="h-10 w-px bg-outline-variant/30 shrink-0" />
              <div className="text-right shrink-0 min-w-25">
                <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                  {t('quotes.response.totalValue')}
                </p>
                <p className="text-xl font-bold text-primary mt-0.5">
                  {formatCurrency(total)}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-outline-variant/20">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={volumeDiscount}
                  onChange={(e) => setVolumeDiscount(e.target.checked)}
                  className="w-4 h-4 rounded text-primary focus:ring-primary border-outline-variant"
                />
                <span className="text-sm text-on-surface">{t('quotes.response.volumeDiscount')}</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-on-surface block">
                {t('quotes.response.leadTime')}
              </label>
              <div className="relative group">
                <IconCalendarEvent size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors" />
                <select
                  value={leadTime}
                  onChange={(e) => { setLeadTime(e.target.value); setSavedAt(null) }}
                  className="w-full bg-surface border border-outline-variant rounded-lg py-3 pl-10 pr-8 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary appearance-none shadow-sm"
                >
                  {LEAD_TIME_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <IconChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-on-surface block">{t('quotes.response.validUntil')}</label>
              <input
                type="date"
                value={validUntil}
                onChange={(e) => { setValidUntil(e.target.value); setSavedAt(null) }}
                className="w-full bg-surface border border-outline-variant rounded-lg py-3 px-4 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="flex flex-col gap-2 flex-1">
          <label className="text-sm font-semibold text-on-surface">{t('quotes.response.messageToBuyer')}</label>
          <textarea
            value={message}
            onChange={(e) => { setMessage(e.target.value); setSavedAt(null) }}
            className="flex-1 min-h-40 bg-surface border border-outline-variant rounded-xl p-4 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary resize-none shadow-sm"
            placeholder={t('quotes.response.messagePlaceholder')}
          />
        </div>

      </div>

      {/* Footer */}
      <div className="p-6 bg-surface-container-low border-t border-outline-variant/20 flex justify-between items-center z-10 shrink-0">
        <Button variant="outline" onClick={handleSaveDraft} disabled={isSaving}>
          <IconDeviceFloppy size={20} />
          {isSaving ? t('quotes.response.saving') : t('quotes.response.saveDraft')}
        </Button>
        <Button variant="secondary" size="lg" onClick={handleSend} className="hover:-translate-y-0.5 shadow-md" data-testid="send-quote">
          {t('quotes.response.sendQuote')}
          <IconSend size={20} />
        </Button>
      </div>
    </div>
  )
}
