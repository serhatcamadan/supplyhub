'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { RfqProductCard } from '@/components/buyer/rfq-product-card'
import { RfqSupplierSidebar } from '@/components/buyer/rfq-supplier-sidebar'
import type { Product, Company } from '@/types'
import { IconCalendar, IconCurrencyLira, IconMessage, IconPackage, IconPaperclip, IconScale, IconSend, IconTag } from '@tabler/icons-react'
import type { ElementType } from 'react'

function FormSectionHeader({ icon: Icon, label }: { icon: ElementType; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-6 border-b border-outline-variant/20 pb-4">
      <Icon size={20} className="text-primary bg-primary/10 p-2 rounded-lg box-content" />
      <h2 className="text-xl font-semibold text-on-surface">{label}</h2>
    </div>
  )
}

const FIELD_CLASS =
  'w-full bg-surface-container hover:bg-surface-container-high focus:bg-surface-container-lowest border border-outline-variant/50 focus:border-primary text-on-surface rounded-xl px-4 py-3 pl-12 text-base transition-all shadow-sm outline-none'

function IconInput({
  id,
  label,
  icon: Icon,
  required,
  hint,
  labelSuffix,
  ...inputProps
}: {
  id: string
  label: string
  icon: ElementType
  required?: boolean
  hint?: string
  labelSuffix?: string
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-2 relative group/input">
      <label className="text-sm font-semibold text-on-surface flex items-center gap-2" htmlFor={id}>
        {label}
        {required && <span className="text-error">*</span>}
        {labelSuffix && <span className="text-xs font-normal text-on-surface-variant">{labelSuffix}</span>}
      </label>
      <div className="relative">
        <input id={id} className={FIELD_CLASS} {...inputProps} />
        <Icon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within/input:text-primary transition-colors" />
      </div>
      {hint && <p className="text-xs text-on-surface-variant">{hint}</p>}
    </div>
  )
}

export default function BuyerQuoteNewPage() {
  const router = useRouter()
  const t = useTranslations('buyer')
  const locale = useLocale()

  const [product,      setProduct]      = useState<Product | null>(null)
  const [seller,       setSeller]       = useState<Company | null>(null)
  const [companyId,    setCompanyId]    = useState<string | null>(null)
  const [qty,          setQty]          = useState('')
  const [deliveryDate, setDeliveryDate] = useState('')
  const [targetPrice,  setTargetPrice]  = useState('')
  const [message,      setMessage]      = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError,  setSubmitError]  = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setCompanyId(user?.user_metadata?.company_id ?? null)

      const { data: firstProduct } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .order('created_at')
        .limit(1)
        .single()
      if (!firstProduct) return
      setProduct(firstProduct as Product)
      const { data: sellerData } = await supabase
        .from('companies')
        .select('*')
        .eq('id', firstProduct.seller_id)
        .single()
      if (sellerData) setSeller(sellerData as Company)
    }
    load()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!product || !companyId) return
    setIsSubmitting(true)
    setSubmitError(null)
    const supabase = createClient()
    const quantity = parseInt(qty, 10) || product.min_order_qty
    const { error } = await supabase.from('quote_requests').insert({
      buyer_id:   companyId,
      product_id: product.id,
      quantity,
      buyer_note: message.trim() || null,
      status:     'pending',
    })
    if (error) { setSubmitError(error.message); setIsSubmitting(false); return }
    router.push(`/${locale}/buyer/quotes`)
  }

  const supplierStats = [
    { label: t('quotes.supplier.stats.responseTime'),    value: '< 24h',        accent: false },
    { label: t('quotes.supplier.stats.onTimeDelivery'),  value: '98.5%',        accent: true  },
    { label: t('quotes.supplier.stats.location'),        value: 'İstanbul, TR', accent: false },
  ]

  const tierCount = (product?.price_tiers.length ?? 0) > 1
    ? product!.price_tiers[1]?.min_qty
    : 100

  return (
    <div className="flex flex-col w-full relative overflow-hidden">
      <div className="absolute -top-64 -right-64 w-150 h-150 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -left-64 w-100 h-100 bg-secondary-fixed/5 rounded-full blur-3xl pointer-events-none" />

      <div className="px-8 py-12 relative z-10 w-full max-w-360 mx-auto">

        <div className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1.5 h-6 bg-primary rounded-full" />
            <h1 className="text-4xl font-bold tracking-tight text-on-surface">{t('quotes.heading')}</h1>
          </div>
          <p className="text-base text-on-surface-variant max-w-2xl leading-relaxed ml-4">
            {t('quotes.subHeading')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          <div className="lg:col-span-8">
            <form onSubmit={handleSubmit} className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden relative group/form transition-shadow hover:shadow-md duration-300">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-linear-to-r from-primary via-primary-fixed to-secondary-container scale-x-0 group-hover/form:scale-x-100 transition-transform origin-left duration-500" />

              <div className="p-8 space-y-10">

                <section>
                  <FormSectionHeader icon={IconPackage} label={t('quotes.sections.productSelection')} />
                  {product && seller && <RfqProductCard product={product} seller={seller} />}
                </section>

                <section>
                  <FormSectionHeader icon={IconScale} label={t('quotes.sections.requirements')} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <IconInput
                      id="quantity"
                      label={t('quotes.fields.quantity')}
                      icon={IconTag}
                      type="number"
                      required
                      min={product?.min_order_qty ?? 1}
                      value={qty}
                      onChange={(e) => setQty(e.target.value)}
                      placeholder={t('quotes.fields.quantityPlaceholder', { min: product?.min_order_qty ?? 1 })}
                      hint={t('quotes.fields.quantityHint', { count: tierCount })}
                    />
                    <IconInput
                      id="deadline"
                      label={t('quotes.fields.deliveryDate')}
                      icon={IconCalendar}
                      type="date"
                      required
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                    />
                  </div>
                  <div className="mt-6 w-full md:w-1/2">
                    <IconInput
                      id="target_price"
                      label={t('quotes.fields.targetPrice')}
                      icon={IconCurrencyLira}
                      type="number"
                      step={0.01}
                      labelSuffix={t('quotes.fields.optional')}
                      value={targetPrice}
                      onChange={(e) => setTargetPrice(e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                </section>

                <section>
                  <FormSectionHeader icon={IconMessage} label={t('quotes.sections.message')} />
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-on-surface block" htmlFor="message">
                      {t('quotes.fields.messageLabel')}
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      maxLength={1000}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={t('quotes.fields.messagePlaceholder')}
                      className="w-full bg-surface-container hover:bg-surface-container-high focus:bg-surface-container-lowest border border-outline-variant/50 focus:border-primary text-on-surface rounded-xl p-4 text-base transition-all shadow-sm outline-none resize-y"
                    />
                    <div className="flex justify-between items-center mt-2">
                      <Button type="button" variant="ghost" size="sm" className="text-primary hover:bg-primary/5">
                        <IconPaperclip className="text-[18px]" />
                        {t('quotes.actions.attachFiles')}
                      </Button>
                      <span className={`text-xs ${message.length >= 900 ? 'text-error' : 'text-on-surface-variant'}`}>
                        {t('quotes.fields.charCount', { count: message.length })}
                      </span>
                    </div>
                  </div>
                </section>

              </div>

              <div className="bg-surface-container-low px-8 py-5 border-t border-outline-variant/30 flex items-center justify-between">
                {submitError && <p className="text-sm text-error">{submitError}</p>}
                <Button type="button" variant="ghost" size="lg" className="text-on-surface-variant">
                  {t('quotes.actions.saveDraft')}
                </Button>
                <Button type="submit" size="lg" disabled={isSubmitting} className="relative overflow-hidden group/btn shadow-md hover:shadow-lg" data-testid="rfq-submit">
                  <span className="relative z-10">
                    {isSubmitting ? t('quotes.actions.submitting') : t('quotes.actions.submit')}
                  </span>
                  <IconSend className="relative z-10 group-hover/btn:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 z-0" />
                </Button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-4 lg:sticky lg:top-24">
            {seller && <RfqSupplierSidebar seller={seller} stats={supplierStats} />}
          </div>

        </div>
      </div>
    </div>
  )
}
