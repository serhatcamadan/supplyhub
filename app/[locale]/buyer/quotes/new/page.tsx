'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { getCurrentUserFromCookie } from '@/lib/auth/client'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Product } from '@/types'
import {
  IconArrowLeft, IconCalendar, IconCurrencyLira, IconInfoCircle,
  IconPackage, IconPaperclip, IconRulerMeasure, IconSend, IconTag,
} from '@tabler/icons-react'
import type { ElementType } from 'react'

const FIELD_CLASS =
  'w-full bg-surface-container hover:bg-surface-container-high focus:bg-surface-container-lowest border border-outline-variant/50 focus:border-primary text-on-surface rounded-xl px-4 py-3 text-sm transition-all shadow-sm outline-none'

function FieldLabel({ htmlFor, label, required, suffix }: { htmlFor: string; label: string; required?: boolean; suffix?: string }) {
  return (
    <label className="block text-sm font-semibold text-on-surface mb-1.5" htmlFor={htmlFor}>
      {label}
      {required && <span className="text-error ml-1">*</span>}
      {suffix && <span className="text-xs font-normal text-on-surface-variant ml-2">{suffix}</span>}
    </label>
  )
}

function SectionCard({ icon: Icon, heading, children }: { icon: ElementType; heading: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 shadow-sm p-6">
      <div className="flex items-center gap-3 mb-5 pb-4 border-b border-outline-variant/20">
        <span className="p-2 rounded-xl bg-primary/10 text-primary">
          <Icon size={18} />
        </span>
        <h2 className="text-base font-semibold text-on-surface">{heading}</h2>
      </div>
      {children}
    </div>
  )
}

const UNITS = ['pieces', 'kg', 'tons', 'meters', 'liters'] as const

export default function BuyerQuoteNewPage() {
  const router = useRouter()
  const t = useTranslations('buyer')
  const locale = useLocale()

  const [products, setProducts]       = useState<Product[]>([])
  const [companyId, setCompanyId]     = useState<string | null>(null)
  const [productId, setProductId]     = useState('')
  const [deadline, setDeadline]       = useState('')
  const [qty, setQty]                 = useState('')
  const [unit, setUnit]               = useState<typeof UNITS[number]>('pieces')
  const [targetPrice, setTargetPrice] = useState('')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const selectedProduct = products.find((p) => p.id === productId) ?? null

  useEffect(() => {
    async function load() {
      const authUser = getCurrentUserFromCookie()
      setCompanyId(authUser?.companyId ?? null)
      const supabase = createClient()
      const { data: prods } = await supabase.from('products').select('*').eq('status', 'active').order('name')
      if (prods?.length) {
        setProducts(prods as Product[])
        setProductId(prods[0].id)
      }
    }
    load()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!productId || !companyId) return
    setIsSubmitting(true)
    setSubmitError(null)
    const supabase = createClient()
    const quantity = parseInt(qty, 10) || selectedProduct?.min_order_qty || 1
    const { error } = await supabase.from('quote_requests').insert({
      buyer_id: companyId,
      product_id: productId,
      quantity,
      buyer_note: description.trim() || null,
      status: 'pending',
    })
    if (error) { setSubmitError(error.message); setIsSubmitting(false); return }
    router.push(`/${locale}/buyer/quotes`)
  }

  const charCount = description.length
  const maxChars = 2000

  return (
    <div className="px-8 py-8 max-w-360 mx-auto">

      <div className="mb-8">
        <Link
          href={`/${locale}/buyer/quotes`}
          className="inline-flex items-center gap-2 text-sm text-on-surface-variant hover:text-on-surface transition-colors mb-4"
        >
          <IconArrowLeft size={16} />
          {t('quotes.form.back')}
        </Link>
        <h1 className="text-3xl font-bold text-on-surface">{t('quotes.form.heading')}</h1>
        <p className="text-sm text-on-surface-variant mt-1">{t('quotes.form.subHeading')}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* ─── Left: form sections ─── */}
          <div className="lg:col-span-8 space-y-4">

            <SectionCard icon={IconPackage} heading={t('quotes.form.basicDetails.heading')}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <FieldLabel htmlFor="product" label={t('quotes.form.basicDetails.product')} required />
                  <select
                    id="product"
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    className={FIELD_CLASS}
                    required
                  >
                    {products.length === 0 && (
                      <option value="">{t('quotes.form.basicDetails.productPlaceholder')}</option>
                    )}
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                  {selectedProduct && (
                    <p className="text-xs text-on-surface-variant mt-1.5">{selectedProduct.category}</p>
                  )}
                </div>
                <div>
                  <FieldLabel htmlFor="deadline" label={t('quotes.form.basicDetails.deadline')} required />
                  <div className="relative">
                    <input
                      id="deadline"
                      type="date"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className={cn(FIELD_CLASS, 'pl-10')}
                      required
                    />
                    <IconCalendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
                  </div>
                </div>
              </div>
            </SectionCard>

            <SectionCard icon={IconTag} heading={t('quotes.form.volume.heading')}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <FieldLabel htmlFor="qty" label={t('quotes.form.volume.quantity')} required />
                  <div className="relative">
                    <input
                      id="qty"
                      type="number"
                      min={selectedProduct?.min_order_qty ?? 1}
                      value={qty}
                      onChange={(e) => setQty(e.target.value)}
                      placeholder={t('quotes.form.volume.quantityPlaceholder')}
                      className={cn(FIELD_CLASS, 'pl-10')}
                      required
                    />
                    <IconRulerMeasure size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
                  </div>
                </div>
                <div>
                  <FieldLabel htmlFor="unit" label={t('quotes.form.volume.unit')} />
                  <select
                    id="unit"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value as typeof UNITS[number])}
                    className={FIELD_CLASS}
                  >
                    {UNITS.map((u) => (
                      <option key={u} value={u}>{t(`quotes.form.volume.units.${u}` as Parameters<typeof t>[0])}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <FieldLabel htmlFor="target_price" label={t('quotes.form.volume.targetPrice')} suffix={t('quotes.form.volume.optional')} />
                  <div className="relative">
                    <input
                      id="target_price"
                      type="number"
                      step={0.01}
                      value={targetPrice}
                      onChange={(e) => setTargetPrice(e.target.value)}
                      placeholder="0.00"
                      className={cn(FIELD_CLASS, 'pl-10')}
                    />
                    <IconCurrencyLira size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
                  </div>
                </div>
              </div>
            </SectionCard>

            <SectionCard icon={IconInfoCircle} heading={t('quotes.form.specs.heading')}>
              <div className="space-y-5">
                <div>
                  <FieldLabel htmlFor="description" label={t('quotes.form.specs.description')} />
                  <textarea
                    id="description"
                    rows={5}
                    maxLength={maxChars}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={t('quotes.form.specs.descriptionPlaceholder')}
                    className={cn(FIELD_CLASS, 'resize-y')}
                  />
                  <p className={cn('text-xs mt-1 text-right', charCount >= maxChars * 0.9 ? 'text-error' : 'text-on-surface-variant')}>
                    {t('quotes.form.specs.charCount', { count: charCount })}
                  </p>
                </div>

                <div>
                  <FieldLabel htmlFor="attachments" label={t('quotes.form.specs.attachments')} />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-outline-variant/50 hover:border-primary/50 rounded-xl p-6 text-center transition-colors group/dz"
                  >
                    <IconPaperclip size={24} className="mx-auto mb-2 text-on-surface-variant group-hover/dz:text-primary transition-colors" />
                    <p className="text-sm font-medium text-on-surface">{t('quotes.form.specs.dropzoneTitle')}</p>
                    <p className="text-xs text-on-surface-variant mt-1">{t('quotes.form.specs.dropzoneHint')}</p>
                  </button>
                  <input ref={fileInputRef} type="file" multiple accept=".pdf,.step,.iges,.dwg,.zip" className="hidden" />
                </div>
              </div>
            </SectionCard>

            <div className="flex items-center justify-between pt-2">
              {submitError && <p className="text-sm text-error">{submitError}</p>}
              <div className={cn('flex gap-3', submitError ? '' : 'ml-auto')}>
                <Link href={`/${locale}/buyer/quotes`}>
                  <Button type="button" variant="ghost" size="lg">
                    {t('quotes.form.actions.cancel')}
                  </Button>
                </Link>
                <Button type="submit" size="lg" disabled={isSubmitting} data-testid="rfq-submit">
                  <IconSend size={18} className={isSubmitting ? '' : 'group-hover:translate-x-0.5 transition-transform'} />
                  {isSubmitting ? t('quotes.form.actions.submitting') : t('quotes.form.actions.submit')}
                </Button>
              </div>
            </div>
          </div>

          {/* ─── Right: tips sidebar ─── */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">

            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 shadow-sm p-5">
              <h3 className="text-sm font-semibold text-on-surface mb-4">{t('quotes.form.tips.heading')}</h3>
              <div className="space-y-4">
                {(['specific', 'drawings', 'deadline'] as const).map((key) => (
                  <div key={key} className="flex gap-3">
                    <span className="mt-0.5 w-5 h-5 rounded-full bg-secondary/15 text-secondary flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[14px]">check</span>
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-on-surface">{t(`quotes.form.tips.${key}.title` as Parameters<typeof t>[0])}</p>
                      <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">{t(`quotes.form.tips.${key}.desc` as Parameters<typeof t>[0])}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 shadow-sm p-5">
              <h3 className="text-sm font-semibold text-on-surface mb-4">{t('quotes.form.activity.heading')}</h3>
              <div className="flex gap-4">
                <div className="flex-1 text-center py-3 rounded-xl bg-surface-container">
                  <p className="text-2xl font-bold text-secondary">
                    {/* active = pending + responded */}
                    —
                  </p>
                  <p className="text-xs text-on-surface-variant mt-1">{t('quotes.form.activity.active')}</p>
                </div>
                <div className="flex-1 text-center py-3 rounded-xl bg-surface-container">
                  <p className="text-2xl font-bold text-on-surface">—</p>
                  <p className="text-xs text-on-surface-variant mt-1">{t('quotes.form.activity.received')}</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </form>
    </div>
  )
}
