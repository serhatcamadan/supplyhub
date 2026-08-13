import { Button } from '@/components/ui/button'
import { DiscoverSearch } from '@/components/seller/discover-search'
import { MarketTrends, type MarketTrend } from '@/components/seller/market-trends'
import { BuyerSearches, type SearchKeyword } from '@/components/seller/buyer-searches'
import { PriceIndex, type PriceComparison } from '@/components/seller/price-index'
import { ProductRecommendations, type ProductRecommendation } from '@/components/seller/product-recommendations'

const TRENDS: MarketTrend[] = [
  {
    category: 'Eko-Ambalaj',
    subcategory: 'Endüstriyel Malzemeler',
    icon: 'eco',
    growth: '+24%',
    demand: 'Yüksek',
    demandPct: 75,
    colorScheme: 'secondary',
  },
  {
    category: 'Endüstriyel Sensörler',
    subcategory: 'Elektronik & IoT',
    icon: 'sensors',
    growth: '+18%',
    demand: 'Orta-Yüksek',
    demandPct: 65,
    colorScheme: 'tertiary',
  },
]

const KEYWORDS: SearchKeyword[] = [
  { rank: 1, keyword: 'Toplu Oluklu Kutu',          volume: '14.2k', growing: true,  sparkPath: 'M0 20 Q 25 15, 50 10 T 100 0' },
  { rank: 2, keyword: 'Biyobozunur Palet Sargısı',  volume: '8.9k',  growing: true,  sparkPath: 'M0 15 Q 25 20, 50 10 T 100 5' },
  { rank: 3, keyword: 'Lityum Hücre (18650)',        volume: '6.1k',  growing: false, sparkPath: 'M0 10 Q 25 10, 50 15 T 100 10' },
  { rank: 4, keyword: 'Organik Zeytinyağı 5L',       volume: '5.4k',  growing: true,  sparkPath: 'M0 18 Q 25 14, 50 8 T 100 3' },
  { rank: 5, keyword: 'Kepek Unu 25kg',              volume: '3.9k',  growing: false, sparkPath: 'M0 12 Q 25 14, 50 13 T 100 11' },
]

const PRICE_COMPARISONS: PriceComparison[] = [
  { product: 'Organik Zeytinyağı (5L)',  unit: 'Adet',      myPrice: 165,  marketPrice: 195 },
  { product: 'Tam Buğday Unu (25kg)',    unit: 'Çuval',     myPrice: 42,   marketPrice: 38 },
]

const RECOMMENDATIONS: ProductRecommendation[] = [
  {
    name: 'Su Aktivasyonlu Kraft Bant',
    description: 'Eko-Ambalaj segmentinde yüksek talep. Düşük satıcı rekabeti.',
    margin: '%35–40',
    icon: 'package_2',
  },
  {
    name: 'Termal Transfer Etiket (4×6)',
    description: 'Bölgenizde yüksek hacimli sürekli aramalar. Hızlı tüketim ürünü.',
    margin: '%20–25',
    icon: 'label',
  },
  {
    name: 'Dolum Gazı (N₂ — 10L)',
    description: 'Gıda sektöründe artan MAP ambalaj talebi.',
    margin: '%28–33',
    icon: 'science',
  },
]

export default function SellerDiscoverPage() {
  return (
    <div className="p-8 flex flex-col gap-8">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-on-surface">Market Discovery</h1>
          <p className="text-sm text-on-surface-variant mt-2 max-w-2xl">
            Sektör trendlerini analiz edin, alıcı taleplerini takip edin ve yeni ürün fırsatları keşfedin.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost">
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>download</span>
            Rapor İndir
          </Button>
          <Button variant="primary">
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
            Ürün Ekle
          </Button>
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
