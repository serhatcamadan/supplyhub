import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ProductImageGallery } from '@/components/buyer/product-image-gallery'
import { ProductTabs } from '@/components/buyer/product-tabs'
import { ProductOrderPanel } from '@/components/buyer/product-order-panel'
import { SellerInfoCard } from '@/components/buyer/seller-info-card'
import type { Product, Company } from '@/types'

const FEATURES_BY_CATEGORY: Record<string, string[]> = {
  'Yağlar': [
    'Soğuk sıkım tekniği ile üretilmiş',
    'AB organik sertifikalı',
    'Ege bölgesi zeytinlerinden',
    'Cam şişe, ışık geçirmez ambalaj',
  ],
  'Tahıllar': [
    'Doğrudan değirmenden tedarik',
    'Yüksek protein içeriği (%13+)',
    'Standart 25 kg çuval ambalaj',
    'Uzun raf ömrü (18 ay)',
  ],
  'Doğal Ürünler': [
    'Saf ve katkısız, ham bal',
    'Karadeniz yayla çiçeklerinden',
    'Mikrobiyolojik test onaylı',
    'Yıl boyunca stok garantisi',
  ],
  'Baklagiller & Makarna': [
    'Günlük taze üretim',
    'Serbest gezen tavuk yumurtası',
    '500g vakumlu paket',
    'Soğuk zincir taşımacılık',
  ],
}

const SPARKLINE = 'M0,25 L10,22 L20,24 L30,15 L40,18 L50,12 L60,14 L70,8 L80,10 L90,5 L100,5'

export default async function BuyerProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

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

  const features = FEATURES_BY_CATEGORY[product.category] ?? []

  return (
    <div className="p-8 flex flex-col gap-8">

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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        <div className="lg:col-span-8 flex flex-col gap-8">
          <ProductImageGallery imageUrl={product.image_url} productName={product.name} />
          <ProductTabs description={product.description} features={features} />
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6 sticky top-24">

          <ProductOrderPanel product={product} sellerName={seller?.name ?? 'Tedarikçi'} rating={4.7} />

          <SellerInfoCard sellerName={seller?.name ?? 'Tedarikçi'} />

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
