import Link from 'next/link'
import { getLocale, getTranslations } from 'next-intl/server'
import { buttonVariants } from '@/components/ui/button'
import { DiscoverSearch } from '@/components/seller/discover-search'
import { MarketTrends, type MarketTrend } from '@/components/seller/market-trends'
import { BuyerSearches, type SearchKeyword } from '@/components/seller/buyer-searches'
import { PriceIndex, type PriceComparison } from '@/components/seller/price-index'
import { ProductRecommendations, type ProductRecommendation } from '@/components/seller/product-recommendations'
import {
  getTrends,
  getPriceIndex,
  getRecommendations,
  getBuyerSearches,
  type TrendData,
  type PriceComparisonData,
  type RecommendationData,
  type BuyerSearchData,
} from '@/lib/api/discover'
import { CATEGORY_ICON, DEFAULT_CATEGORY_ICON, CATEGORY_UNIT_KEY, DEFAULT_UNIT_KEY } from '@/lib/category-meta'
import { buildSparklinePath } from '@/lib/sparkline'
import { IconPlus } from '@tabler/icons-react'

export default async function SellerDiscoverPage() {
  const [locale, t] = await Promise.all([getLocale(), getTranslations('seller')])

  const [trends, priceComparisons, recommendations, buyerSearches] = await Promise.all([
    getTrends().catch(() => [] as TrendData[]),
    getPriceIndex().catch(() => [] as PriceComparisonData[]),
    getRecommendations().catch(() => [] as RecommendationData[]),
    getBuyerSearches().catch(() => [] as BuyerSearchData[]),
  ])

  const TRENDS: MarketTrend[] = trends.map((tr, i) => ({
    category: tr.category,
    icon: CATEGORY_ICON[tr.category] ?? DEFAULT_CATEGORY_ICON,
    growth: tr.growth,
    demandPct: tr.demandPct,
    buyerCount: tr.buyerCount,
    colorScheme: i % 2 === 0 ? 'secondary' : 'tertiary',
  }))

  const PRICE_COMPARISONS: PriceComparison[] = priceComparisons.map((c) => {
    const unitKey = CATEGORY_UNIT_KEY[c.category] ?? DEFAULT_UNIT_KEY
    return {
      product: c.product,
      unit: t(`discover.priceIndex.units.${unitKey}`),
      myPrice: c.myPrice,
      marketPrice: c.marketPrice,
    }
  })

  const RECOMMENDATIONS: ProductRecommendation[] = recommendations.map((rec) => ({
    category: rec.category,
    icon: CATEGORY_ICON[rec.category] ?? DEFAULT_CATEGORY_ICON,
    buyerCount: rec.buyerCount,
  }))

  const KEYWORDS: SearchKeyword[] = buyerSearches.map((kw, i) => ({
    rank: i + 1,
    keyword: kw.keyword,
    count: kw.count,
    sparkPath: buildSparklinePath(kw.dailyCounts),
    growing: kw.growing,
  }))

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
