import Link from 'next/link'
import { getLocale, getTranslations } from 'next-intl/server'
import { buttonVariants } from '@/components/ui/button'
import { DiscoverSearch } from '@/components/seller/discover-search'
import { MarketTrends, type MarketTrend } from '@/components/seller/market-trends'
import { BuyerSearches, type SearchKeyword } from '@/components/seller/buyer-searches'
import { PriceIndex, type PriceComparison } from '@/components/seller/price-index'
import { ProductRecommendations, type ProductRecommendation } from '@/components/seller/product-recommendations'
import { IconFlask, IconLeaf, IconPackage, IconPlus, IconRadar, IconTag } from '@tabler/icons-react'

export default async function SellerDiscoverPage() {
  const [locale, t] = await Promise.all([getLocale(), getTranslations('seller')])

  const TRENDS: MarketTrend[] = [
    {
      category: t('discover.trends.items.ecoPackaging.category'),
      subcategory: t('discover.trends.items.ecoPackaging.subcategory'),
      icon: IconLeaf,
      growth: '+24%',
      demand: t('discover.trends.demand.high'),
      demandPct: 75,
      colorScheme: 'secondary',
    },
    {
      category: t('discover.trends.items.industrialSensors.category'),
      subcategory: t('discover.trends.items.industrialSensors.subcategory'),
      icon: IconRadar,
      growth: '+18%',
      demand: t('discover.trends.demand.mediumHigh'),
      demandPct: 65,
      colorScheme: 'tertiary',
    },
  ]

  const KEYWORDS: SearchKeyword[] = [
    { rank: 1, keyword: t('discover.buyerSearches.items.corrugatedBoxes'), volume: '14.2k', growing: true,  sparkPath: 'M0 20 Q 25 15, 50 10 T 100 0' },
    { rank: 2, keyword: t('discover.buyerSearches.items.palletWrap'),      volume: '8.9k',  growing: true,  sparkPath: 'M0 15 Q 25 20, 50 10 T 100 5' },
    { rank: 3, keyword: t('discover.buyerSearches.items.lithiumCell'),     volume: '6.1k',  growing: false, sparkPath: 'M0 10 Q 25 10, 50 15 T 100 10' },
    { rank: 4, keyword: t('discover.buyerSearches.items.oliveOil5L'),      volume: '5.4k',  growing: true,  sparkPath: 'M0 18 Q 25 14, 50 8 T 100 3' },
    { rank: 5, keyword: t('discover.buyerSearches.items.branFlour25kg'),   volume: '3.9k',  growing: false, sparkPath: 'M0 12 Q 25 14, 50 13 T 100 11' },
  ]

  const PRICE_COMPARISONS: PriceComparison[] = [
    { product: t('discover.priceIndex.items.oliveOil5L'),     unit: t('discover.priceIndex.units.piece'), myPrice: 165, marketPrice: 195 },
    { product: t('discover.priceIndex.items.wheatFlour25kg'), unit: t('discover.priceIndex.units.sack'),  myPrice: 42,  marketPrice: 38 },
  ]

  const RECOMMENDATIONS: ProductRecommendation[] = [
    {
      name: t('discover.recommendations.items.kraftTape.name'),
      description: t('discover.recommendations.items.kraftTape.description'),
      margin: '%35–40',
      icon: IconPackage,
    },
    {
      name: t('discover.recommendations.items.thermalLabel.name'),
      description: t('discover.recommendations.items.thermalLabel.description'),
      margin: '%20–25',
      icon: IconTag,
    },
    {
      name: t('discover.recommendations.items.fillGas.name'),
      description: t('discover.recommendations.items.fillGas.description'),
      margin: '%28–33',
      icon: IconFlask,
    },
  ]

  return (
    <div className="p-8 flex flex-col gap-8">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-on-surface">{t('discover.title')}</h1>
          <p className="text-sm text-on-surface-variant mt-2 max-w-2xl">
            {t('discover.subtitle')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/${locale}/seller/products/new`} className={buttonVariants({ variant: 'primary' })}>
            <IconPlus size={18} />
            {t('discover.addProduct')}
          </Link>
        </div>
      </div>

      {/* Search */}
      <DiscoverSearch />

      {/* Top row: Trending + Buyer Searches */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <MarketTrends trends={TRENDS} />
        <BuyerSearches keywords={KEYWORDS} />
      </div>

      {/* Bottom row: Price Index + Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PriceIndex comparisons={PRICE_COMPARISONS} />
        <ProductRecommendations recommendations={RECOMMENDATIONS} />
      </div>

    </div>
  )
}
