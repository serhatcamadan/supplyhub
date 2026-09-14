'use client'

import { useTranslations } from 'next-intl'
import { cn, formatCurrency, getStockBucket } from '@/lib/utils'
import { StatusBadge } from '@/components/seller/status-badge'
import { ProductRowActions } from '@/components/seller/product-row-actions'
import type { Product, PriceTier } from '@/types'
import { IconPackage, IconPhoto } from '@tabler/icons-react'

interface ProductGridProps {
  products: Product[]
  onDelete: (id: string) => void
  onStatusChange: (id: string, status: 'active' | 'draft') => void
  selectedIds: Set<string>
  onToggleSelect: (id: string) => void
}

function getPriceRange(tiers: PriceTier[]) {
  const prices = tiers.map((t) => t.price)
  return { min: Math.min(...prices), max: Math.max(...prices) }
}

const STOCK_STYLE = {
  out_of_stock: 'text-error',
  low_stock: 'text-tertiary',
  in_stock: 'text-secondary',
}

export function ProductGrid({ products, onDelete, onStatusChange, selectedIds, onToggleSelect }: ProductGridProps) {
  const t = useTranslations('seller')

  if (products.length === 0) {
    return (
      <div className="py-16 text-center">
        <IconPackage size={40} className="block mx-auto mb-3 text-outline-variant" />
        <span className="text-sm text-on-surface-variant">{t('products.table.noResults')}</span>
      </div>
    )
  }

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {products.map((product) => {
        const { min, max } = getPriceRange(product.price_tiers)
        const bucket = getStockBucket(product.stock_quantity ?? 0)

        return (
          <div
            key={product.id}
            className="bg-surface-container-lowest rounded-xl shadow-md overflow-hidden border border-outline-variant/20 group flex flex-col"
          >
            <div className="relative aspect-4/3 bg-surface-container flex items-center justify-center">
              <input
                type="checkbox"
                checked={selectedIds.has(product.id)}
                onChange={() => onToggleSelect(product.id)}
                className="absolute top-2 left-2 w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary bg-surface cursor-pointer z-10"
              />
              <div className="absolute top-2 right-2 z-10">
                <StatusBadge status={product.status} />
              </div>
              {product.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <IconPhoto size={32} className="text-outline-variant" />
              )}
            </div>

            <div className="p-3 flex-1 flex flex-col gap-1.5">
              <span className="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors line-clamp-1">
                {product.name}
              </span>
              <span className="inline-flex w-fit items-center px-2 py-0.5 rounded-md bg-secondary-container/30 text-on-secondary-container text-xs border border-secondary-container/50">
                {product.category}
              </span>
              <div className="flex items-center justify-between mt-1">
                <span className={cn('text-xs font-semibold tabular-nums', STOCK_STYLE[bucket])}>
                  {t('products.table.stockLevel')}: {product.stock_quantity ?? 0}
                </span>
              </div>
              <span className="text-sm font-semibold text-on-surface">
                {formatCurrency(min)} – {formatCurrency(max)}
                <span className="text-xs font-normal text-on-surface-variant"> / {t('products.table.perUnit')}</span>
              </span>
            </div>

            <div className="border-t border-outline-variant/20 px-2 py-1.5 flex justify-end">
              <ProductRowActions
                productId={product.id}
                status={product.status}
                onDelete={() => onDelete(product.id)}
                onStatusChange={(s) => onStatusChange(product.id, s)}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
