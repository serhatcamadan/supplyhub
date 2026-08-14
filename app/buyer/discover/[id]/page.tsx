import { notFound } from 'next/navigation'
import Link from 'next/link'
import { products, companies } from '@/lib/mock-data'
import { ProductImageGallery } from '@/components/buyer/product-image-gallery'
import { ProductTabs } from '@/components/buyer/product-tabs'
import { ProductOrderPanel } from '@/components/buyer/product-order-panel'
import { SellerInfoCard } from '@/components/buyer/seller-info-card'

// Ürün başına gösterilen özellik maddeleri
const FEATURES: Record<string, string[]> = {
  'product-1': [
    'Soğuk sıkım tekniği ile üretilmiş',
    'AB organik sertifikalı',
    'Ege bölgesi zeytinlerinden',
    'Cam şişe, ışık geçirmez ambalaj',
  ],
  'product-2': [
    'Doğrudan değirmenden tedarik',
    'Yüksek protein içeriği (%13+)',
    'Standar 25 kg lük çuval ambalaj',
    'Uzun raf ömrü (18 ay)',
  ],
  'product-3': [
    'Saf ve katkısız, ham bal',
    'Karadeniz yayla çiçeklerinden',
    'Mikrobiyolojik test onaylı',
    'Yıl boyunca stok garantisi',
  ],
  'product-4': [
    'Günlük taze üretim',
    'Serbest gezen tavuk yumurtası',
    '500g vakumlu paket',
    'Soğuk zincir taşımacılık',
  ],
  'product-5': [
    'Gıda sınıfı 304 paslanmaz çelik',
    'ISO 9001 sertifikalı üretim',
    'Hava geçirmez sızdırmaz kapak',
    'Çizilmez ve paslanmaz iç yüzey',
  ],
}

const RATINGS: Record<string, number> = {
  'product-1': 4.8,
  'product-2': 4.6,
  'product-3': 5.0,
  'product-4': 4.9,
  'product-5': 4.7,
}

// SVG sparkline path'i: son 30 günde stabil fiyat trendi
const SPARKLINE = 'M0,25 L10,22 L20,24 L30,15 L40,18 L50,12 L60,14 L70,8 L80,10 L90,5 L100,5'

export default async function BuyerProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = products.find((p) => p.id === id)
  if (!product) notFound()

  const seller = companies.find((c) => c.id === product.seller_id)!
  const features = FEATURES[product.id] ?? []
  const rating = RATINGS[product.id] ?? 4.5

  return (
    <div className="p-8 flex flex-col gap-8">

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant">
        <Link href="/buyer/discover" className="hover:text-primary transition-colors">
          Keşfet
        </Link>
        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>chevron_right</span>
        <Link href="/buyer/discover" className="hover:text-primary transition-colors">
          {product.category}
        </Link>
        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>chevron_right</span>
        <span className="text-on-surface">{product.name}</span>
      </nav>

      {/* Main grid — 8/4 split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Left column: gallery + tabs */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          <ProductImageGallery imageUrl={product.image_url} productName={product.name} />
          <ProductTabs description={product.description} features={features} />
        </div>

        {/* Right column: sticky */}
        <div className="lg:col-span-4 flex flex-col gap-6 sticky top-24">

          <ProductOrderPanel product={product} sellerName={seller.name} rating={rating} />

          <SellerInfoCard sellerName={seller.name} />

          {/* Price trend sparkline */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-surface via-primary-container/5 to-surface-container" />
            <div className="relative z-10 flex flex-col gap-4">
              <div>
                <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-0.5">
                  Fiyat Trendi (30 Gün)
                </p>
                <p className="text-sm font-semibold text-on-surface">Stabil</p>
              </div>
              <div className="h-20 w-full">
                <svg
                  viewBox="0 0 100 30"
                  preserveAspectRatio="none"
                  className="w-full h-full"
                >
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
