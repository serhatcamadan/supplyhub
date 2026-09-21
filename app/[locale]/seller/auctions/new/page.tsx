'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { getSellerProducts, type ApiProduct } from '@/lib/api/products'
import { createAuction } from '@/lib/api/auctions'
import { Button } from '@/components/ui/button'
import { FormInput } from '@/components/ui/form-input'
import { FormSelect } from '@/components/ui/form-select'
import { SectionHeading } from '@/components/ui/section-heading'
import { IconChevronRight, IconGavel, IconDeviceFloppy } from '@tabler/icons-react'

function localDatetimeMin(): string {
  const now = new Date(Date.now() + 5 * 60_000) // at least 5 minutes out
  now.setSeconds(0, 0)
  const offset = now.getTimezoneOffset()
  const local = new Date(now.getTime() - offset * 60_000)
  return local.toISOString().slice(0, 16)
}

export default function NewAuctionPage() {
  const router = useRouter()
  const t = useTranslations('seller')
  const locale = useLocale()

  const [products, setProducts] = useState<ApiProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [productId, setProductId] = useState('')
  const [startingPrice, setStartingPrice] = useState('')
  const [endsAt, setEndsAt] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getSellerProducts()
      .then((data) => setProducts(data.filter((p) => p.status === 'active')))
      .catch(() => setProducts([]))
      .finally(() => setIsLoading(false))
  }, [])

  async function handleSave() {
    setError(null)
    if (!productId || !startingPrice || !endsAt) {
      setError(t('auctions.form.errorRequired'))
      return
    }
    setIsSubmitting(true)
    try {
      const auction = await createAuction({
        productId,
        starting_price: parseFloat(startingPrice),
        ends_at: new Date(endsAt).toISOString(),
      })
      router.push(`/${locale}/seller/auctions/${auction.id}`)
    } catch {
      setError(t('auctions.form.errorSave'))
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col w-full min-h-full">
      <div className="flex items-center justify-between px-8 py-8 border-b border-outline-variant/20 bg-surface">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-2">
            <Link href={`/${locale}/seller/auctions`} className="hover:text-primary transition-colors">
              {t('auctions.list.heading')}
            </Link>
            <IconChevronRight className="text-[16px]" />
            <span className="text-on-surface">{t('auctions.form.heading')}</span>
          </div>
          <h1 className="text-2xl font-semibold text-on-surface tracking-tight">{t('auctions.form.heading')}</h1>
        </div>
        <div className="flex items-center gap-4">
          {error && <p className="text-sm text-error">{error}</p>}
          <Link href={`/${locale}/seller/auctions`} className="px-4 py-2 rounded-lg text-sm font-semibold text-on-surface hover:bg-surface-container-high transition-colors">
            {t('auctions.form.back')}
          </Link>
          <Button type="button" variant="secondary" onClick={handleSave} disabled={isSubmitting}>
            <IconDeviceFloppy size={18} />
            {isSubmitting ? t('auctions.form.submitting') : t('auctions.form.submit')}
          </Button>
        </div>
      </div>

      <div className="flex-1 px-8 py-8">
        <div className="max-w-160 mx-auto bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-sm p-8">
          <SectionHeading icon={IconGavel} label={t('auctions.form.heading')} />

          {isLoading ? (
            <p className="text-sm text-on-surface-variant">{t('auctions.form.selectProductPlaceholder')}</p>
          ) : products.length === 0 ? (
            <p className="text-sm text-on-surface-variant">{t('auctions.form.noActiveProducts')}</p>
          ) : (
            <div className="flex flex-col gap-6">
              <FormSelect
                id="productId"
                label={t('auctions.form.selectProduct')}
                placeholder={t('auctions.form.selectProductPlaceholder')}
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                options={products.map((p) => ({ value: p.id, label: p.name }))}
              />
              <FormInput
                id="startingPrice"
                type="number"
                min={0.01}
                step="0.01"
                label={t('auctions.form.startingPrice')}
                value={startingPrice}
                onChange={(e) => setStartingPrice(e.target.value)}
              />
              <FormInput
                id="endsAt"
                type="datetime-local"
                min={localDatetimeMin()}
                label={t('auctions.form.endsAt')}
                value={endsAt}
                onChange={(e) => setEndsAt(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
