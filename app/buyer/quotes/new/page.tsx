'use client'

import { useState } from 'react'
import { products, companies } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { RfqProductCard } from '@/components/buyer/rfq-product-card'
import { RfqSupplierSidebar } from '@/components/buyer/rfq-supplier-sidebar'

const PRODUCT_ID = 'product-1'
const SELLER_ID  = 'company-seller-1'

const product = products.find((p) => p.id === PRODUCT_ID)!
const seller  = companies.find((c) => c.id === SELLER_ID)!

const SUPPLIER_STATS = [
  { label: 'Response Time',    value: '< 24 Hours',  accent: false },
  { label: 'On-Time Delivery', value: '98.5%',        accent: true  },
  { label: 'Location',         value: 'İstanbul, TR', accent: false },
]

function FormSectionHeader({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-6 border-b border-outline-variant/20 pb-4">
      <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-lg">{icon}</span>
      <h2 className="text-xl font-semibold text-on-surface">{label}</h2>
    </div>
  )
}

const FIELD_CLASS =
  'w-full bg-surface-container hover:bg-surface-container-high focus:bg-surface-container-lowest border border-outline-variant/50 focus:border-primary text-on-surface rounded-xl px-4 py-3 pl-12 text-base transition-all shadow-sm outline-none'

function IconInput({
  id,
  label,
  icon,
  required,
  hint,
  labelSuffix,
  ...inputProps
}: {
  id: string
  label: string
  icon: string
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
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within/input:text-primary transition-colors">
          {icon}
        </span>
      </div>
      {hint && <p className="text-xs text-on-surface-variant">{hint}</p>}
    </div>
  )
}

export default function BuyerQuoteNewPage() {
  const [qty,          setQty]          = useState('')
  const [deliveryDate, setDeliveryDate] = useState('')
  const [targetPrice,  setTargetPrice]  = useState('')
  const [message,      setMessage]      = useState('')

  return (
    <div className="flex flex-col w-full relative overflow-hidden">
      <div className="absolute -top-64 -right-64 w-150 h-150 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -left-64 w-100 h-100 bg-secondary-fixed/5 rounded-full blur-3xl pointer-events-none" />

      <div className="px-8 py-12 relative z-10 w-full max-w-360 mx-auto">

        {/* Page header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1.5 h-6 bg-primary rounded-full" />
            <h1 className="text-4xl font-bold tracking-tight text-on-surface">Request for Quote</h1>
          </div>
          <p className="text-base text-on-surface-variant max-w-2xl leading-relaxed ml-4">
            Provide detailed specifications to receive an accurate wholesale quotation.
            Suppliers typically respond within 24–48 hours.
          </p>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left — form */}
          <div className="lg:col-span-8">
            <form className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden relative group/form transition-shadow hover:shadow-md duration-300">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-linear-to-r from-primary via-primary-fixed to-secondary-container scale-x-0 group-hover/form:scale-x-100 transition-transform origin-left duration-500" />

              <div className="p-8 space-y-10">

                <section>
                  <FormSectionHeader icon="inventory_2" label="Product Selection" />
                  <RfqProductCard product={product} seller={seller} />
                </section>

                <section>
                  <FormSectionHeader icon="scale" label="Requirements" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <IconInput
                      id="quantity"
                      label="Requested Quantity"
                      icon="tag"
                      type="number"
                      required
                      min={product.min_order_qty}
                      value={qty}
                      onChange={(e) => setQty(e.target.value)}
                      placeholder={`Minimum ${product.min_order_qty} units`}
                      hint={`Pricing tiers available for ${product.price_tiers.length > 1 ? `${product.price_tiers[1]?.min_qty}+` : '100+'} units.`}
                    />
                    <IconInput
                      id="deadline"
                      label="Target Delivery Date"
                      icon="calendar_month"
                      type="date"
                      required
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                    />
                  </div>
                  <div className="mt-6 w-full md:w-1/2">
                    <IconInput
                      id="target_price"
                      label="Target Price per Unit"
                      icon="currency_lira"
                      type="number"
                      step={0.01}
                      labelSuffix="(Optional)"
                      value={targetPrice}
                      onChange={(e) => setTargetPrice(e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                </section>

                <section>
                  <FormSectionHeader icon="chat" label="Message to Supplier" />
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-on-surface block" htmlFor="message">
                      Detailed Specifications &amp; Inquiry
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      maxLength={1000}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Include details such as material grades, custom packaging requirements, shipping preferences, or reference documents..."
                      className="w-full bg-surface-container hover:bg-surface-container-high focus:bg-surface-container-lowest border border-outline-variant/50 focus:border-primary text-on-surface rounded-xl p-4 text-base transition-all shadow-sm outline-none resize-y"
                    />
                    <div className="flex justify-between items-center mt-2">
                      <Button type="button" variant="ghost" size="sm" className="text-primary hover:bg-primary/5">
                        <span className="material-symbols-outlined text-[18px]">attachment</span>
                        Attach Files
                      </Button>
                      <span className={`text-xs ${message.length >= 900 ? 'text-error' : 'text-on-surface-variant'}`}>
                        {message.length}/1000 characters
                      </span>
                    </div>
                  </div>
                </section>

              </div>

              <div className="bg-surface-container-low px-8 py-5 border-t border-outline-variant/30 flex items-center justify-between">
                <Button type="button" variant="ghost" size="lg" className="text-on-surface-variant">
                  Save Draft
                </Button>
                <Button type="submit" size="lg" className="relative overflow-hidden group/btn shadow-md hover:shadow-lg">
                  <span className="relative z-10">Submit Request</span>
                  <span className="material-symbols-outlined relative z-10 group-hover/btn:translate-x-1 transition-transform">send</span>
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 z-0" />
                </Button>
              </div>
            </form>
          </div>

          {/* Right — sidebar */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <RfqSupplierSidebar seller={seller} stats={SUPPLIER_STATS} />
          </div>

        </div>
      </div>
    </div>
  )
}
