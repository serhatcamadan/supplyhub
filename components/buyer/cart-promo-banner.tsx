import Link from 'next/link'
import type { CartItem } from '@/components/buyer/cart-item'

interface CartPromoBannerProps {
  item: CartItem
}

export function CartPromoBanner({ item }: CartPromoBannerProps) {
  const toNextTier = Math.ceil(item.qty * 0.5)
  return (
    <div className="relative bg-surface-container rounded-xl px-5 py-4 overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-r from-primary/8 to-transparent pointer-events-none" />
      <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="material-symbols-outlined text-primary" style={{ fontSize: '22px' }}>
            local_offer
          </span>
          <div>
            <p className="text-sm font-semibold text-on-surface">Toplu İndirim Fırsatı</p>
            <p className="text-sm text-on-surface-variant mt-0.5">
              <span className="font-semibold text-primary">{item.name}</span> için{' '}
              <span className="font-semibold">{toNextTier} adet</span> daha ekleyerek Tier 3 fiyatına ulaşın.
            </p>
          </div>
        </div>
        <Link
          href={`/buyer/discover/${encodeURIComponent('product-1')}`}
          className="text-xs font-bold uppercase tracking-wider text-primary border border-primary/30 hover:bg-primary/5 transition-colors px-3 py-2 rounded-lg whitespace-nowrap"
        >
          Hemen Ekle
        </Link>
      </div>
    </div>
  )
}
