'use client'

import { useState } from 'react'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'
import { Button, buttonVariants } from '@/components/ui/button'

interface QuoteResponseFormProps {
  quoteId: string
  quantity: number
  listPrice: number | null
  existingResponse: {
    price: number | null
    message: string | null
  }
}

const LEAD_TIME_OPTIONS = [
  { value: '7-14', label: '7–14 Days' },
  { value: '14-21', label: '14–21 Days' },
  { value: '21-30', label: '21–30 Days' },
  { value: '30+', label: '30+ Days' },
]

function defaultValidUntil() {
  const d = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  return d.toISOString().split('T')[0]
}

export function QuoteResponseForm({
  quoteId: _quoteId,
  quantity,
  listPrice,
  existingResponse,
}: QuoteResponseFormProps) {
  const initialPrice = existingResponse.price ?? listPrice ?? 0
  const [price, setPrice] = useState<number>(initialPrice)
  const [volumeDiscount, setVolumeDiscount] = useState(false)
  const [leadTime, setLeadTime] = useState('14-21')
  const [validUntil, setValidUntil] = useState(defaultValidUntil())
  const [message, setMessage] = useState(existingResponse.message ?? '')
  const [savedAt, setSavedAt] = useState<number | null>(existingResponse.price !== null ? Date.now() : null)
  const [isSent, setIsSent] = useState(false)

  const total = price * quantity
  const isSaved = savedAt !== null

  function handleSaveDraft() {
    setSavedAt(Date.now())
  }

  function handleSend() {
    setIsSent(true)
  }

  if (isSent) {
    return (
      <div className="flex-1 flex flex-col bg-surface-container-lowest rounded-2xl shadow-xl overflow-hidden border border-outline-variant/20 items-center justify-center gap-5">
        <div className="w-20 h-20 rounded-full bg-secondary-container flex items-center justify-center">
          <span
            className="material-symbols-outlined text-secondary"
            style={{ fontSize: '40px', fontVariationSettings: "'FILL' 1" }}
          >
            check_circle
          </span>
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-on-surface">Quote Sent!</h2>
          <p className="text-sm text-on-surface-variant mt-2 max-w-xs">
            Your response has been sent to the buyer. They will be notified shortly.
          </p>
        </div>
        <Link href="/seller/quotes" className={buttonVariants({ variant: 'primary' }) + ' mt-2'}>
          Back to Quotes
        </Link>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-surface-container-lowest rounded-2xl shadow-xl overflow-hidden border border-outline-variant/20 relative">

      {/* Decorative orb */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-secondary-container rounded-full blur-[100px] opacity-20 pointer-events-none" />

      {/* Header */}
      <div className="p-6 border-b border-outline-variant/20 flex justify-between items-center bg-surface/50 backdrop-blur-sm z-10 shrink-0">
        <h2 className="text-2xl font-semibold text-on-surface">Draft Response</h2>
        <span className="px-3 py-1 bg-surface-container-high rounded-full text-xs font-semibold text-on-surface-variant flex items-center gap-1.5">
          <span
            className={`w-2 h-2 rounded-full transition-colors ${isSaved ? 'bg-secondary' : 'bg-on-tertiary-container'}`}
          />
          {isSaved ? 'Draft Saved' : 'Unsaved'}
        </span>
      </div>

      {/* Body */}
      <div className="p-8 flex-1 overflow-y-auto z-10 flex flex-col gap-8">

        {/* Pricing Proposal */}
        <div className="space-y-6">
          <h3 className="text-base font-semibold text-on-surface border-b border-outline-variant/20 pb-2">
            Pricing Proposal
          </h3>

          <div className="bg-surface rounded-xl p-5 border border-outline-variant/20">
            <div className="flex justify-between items-end mb-3">
              <label className="text-base font-semibold text-on-surface">Unit Price</label>
              {listPrice && (
                <span className="text-xs text-on-surface-variant">
                  List price: {formatCurrency(listPrice)}/adet
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
                  onChange={(e) => {
                    setPrice(parseFloat(e.target.value) || 0)
                    setSavedAt(null)
                  }}
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-3 pl-8 pr-4 font-mono text-base text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
                />
              </div>
              <span className="text-sm text-on-surface-variant shrink-0">per adet</span>
              <div className="h-10 w-px bg-outline-variant/30 shrink-0" />
              <div className="text-right shrink-0 min-w-[100px]">
                <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                  Total Value
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
                <span className="text-sm text-on-surface">
                  Offer volume discount tier for larger quantities
                </span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-on-surface block">
                Estimated Lead Time
              </label>
              <div className="relative group">
                <span
                  className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors"
                  style={{ fontSize: '18px' }}
                >
                  calendar_today
                </span>
                <select
                  value={leadTime}
                  onChange={(e) => {
                    setLeadTime(e.target.value)
                    setSavedAt(null)
                  }}
                  className="w-full bg-surface border border-outline-variant rounded-lg py-3 pl-10 pr-8 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary appearance-none shadow-sm"
                >
                  {LEAD_TIME_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <span
                  className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none"
                  style={{ fontSize: '18px' }}
                >
                  expand_more
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-on-surface block">Valid Until</label>
              <input
                type="date"
                value={validUntil}
                onChange={(e) => {
                  setValidUntil(e.target.value)
                  setSavedAt(null)
                }}
                className="w-full bg-surface border border-outline-variant rounded-lg py-3 px-4 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="flex flex-col gap-2 flex-1">
          <div className="flex justify-between items-end">
            <label className="text-sm font-semibold text-on-surface">Message to Buyer</label>
            <button className="text-xs font-semibold text-primary flex items-center gap-1 hover:underline">
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                smart_toy
              </span>
              Generate AI Draft
            </button>
          </div>
          <textarea
            value={message}
            onChange={(e) => {
              setMessage(e.target.value)
              setSavedAt(null)
            }}
            className="flex-1 min-h-[160px] bg-surface border border-outline-variant rounded-xl p-4 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary resize-none shadow-sm"
            placeholder="Write your response here..."
          />
        </div>

      </div>

      {/* Footer */}
      <div className="p-6 bg-surface-container-low border-t border-outline-variant/20 flex justify-between items-center z-10 shrink-0">
        <Button variant="outline" onClick={handleSaveDraft}>
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>save</span>
          Save Draft
        </Button>
        <Button variant="secondary" size="lg" onClick={handleSend} className="hover:-translate-y-0.5 shadow-md">
          Send Quote
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>send</span>
        </Button>
      </div>
    </div>
  )
}
