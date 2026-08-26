import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getTranslations, getLocale } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import { formatCurrency } from '@/lib/utils'
import { ProductImageGallery } from '@/components/buyer/product-image-gallery'
import { ProductTabs } from '@/components/buyer/product-tabs'
import { ProductOrderPanel } from '@/components/buyer/product-order-panel'
import { SellerInfoCard } from '@/components/buyer/seller-info-card'
import type { Product, Company } from '@/types'
import { IconChevronRight } from '@tabler/icons-react'

const CATEGORY_TO_FEATURES_KEY: Record<string, string> = {
  'Yağlar':                'oils',
  'Tahıllar':              'grains',
  'Doğal Ürünler':         'natural',
  'Baklagiller & Makarna': 'legumes',
}

const SPARKLINE = 'M0,25 L10,22 L20,24 L30,15 L40,18 L50,12 L60,14 L70,8 L80,10 L90,5 L100,5'

export default async function BuyerProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [supabase, t, locale] = await Promise.all([
    createClient(),
    getTranslations('buyer'),
    getLocale(),
  ])

  const { data: productData } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (!productData) notFound()

  const product = productData as Product

  const { data: sellerData } = await supabase
    .from('companies')
    .select('*')
    .eq('id', product.seller_id)
    .single()

  const seller = sellerData as Company

  const featuresKey = CATEGORY_TO_FEATURES_KEY[product.category]
  const features: string[] = featuresKey
    ? (t.raw(`discover.features.${featuresKey}`) as string[])
    : []

  const minPrice = product.price_tiers.length > 0
    ? Math.min(...product.price_tiers.map((tier) => tier.price))
    : 0
  const maxPrice = product.price_tiers.length > 0
    ? Math.max(...product.price_tiers.map((tier) => tier.price))
    : 0

  const fallbackSeller = t('discover.unknownSupplier')

  const specs = [
    { label: t('productDetail.specs.category'),         value: product.category },
    { label: t('productDetail.specs.minOrderQty'),      value: t('productDetail.specValues.pieces', { count: product.min_order_qty }) },
    { label: t('productDetail.specs.startingPrice'),    value: formatCurrency(minPrice, locale) + ' ' + t('productDetail.specValues.pricePerPiece') },
    { label: t('productDetail.specs.priceRange'),       value: `${formatCurrency(minPrice, locale)} – ${formatCurrency(maxPrice, locale)}` },
    { label: t('productDetail.specs.priceTiers'),       value: t('productDetail.specValues.tiers', { count: product.price_tiers.length }) },
    { label: t('productDetail.specs.deliveryTime'),     value: t('productDetail.specValues.deliveryDays') },
    { label: t('productDetail.specs.warehouseLocation'),value: t('productDetail.specValues.warehouseLocation') },
    { label: t('productDetail.specs.shelfLife'),        value: t('productDetail.specValues.shelfLife') },
  ]

  return (
    <div className="p-8 flex flex-col gap-8">

      <nav className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant">
        <Link href={`/${locale}/buyer/discover`} className="hover:text-primary transition-colors">
          {t('discover.breadcrumb')}
        </Link>
        <IconChevronRight size={16} />
        <Link href={`/${locale}/buyer/discover`} className="hover:text-primary transition-colors">
          {product.category}
        </Link>
        <IconChevronRight size={16} />
        <span className="text-on-surface">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        <div className="lg:col-span-8 flex flex-col gap-8">
          <ProductImageGallery imageUrl={product.image_url} productName={product.name} />
          <ProductTabs description={product.description} features={features} specs={specs} />
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6 sticky top-24">

          <ProductOrderPanel product={product} sellerName={seller?.name ?? fallbackSeller} rating={4.7} />

          <SellerInfoCard sellerName={seller?.name ?? fallbackSeller} />

          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-surface via-primary-container/5 to-surface-container" />
            <div className="relative z-10 flex flex-col gap-4">
              <div>
                <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-0.5">
                  {t('discover.priceTrend')}
                </p>
                <p className="text-sm font-semibold text-on-surface">{t('discover.priceTrendStable')}</p>
              </div>
              <div className="h-20 w-full">
                <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="w-full h-full">
                  <path
                    d={SPARKLINE}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary opacity-50"
                  />
                  <circle cx="100" cy="5" r="2" fill="currentColor" className="text-primary" />
                </svg>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
