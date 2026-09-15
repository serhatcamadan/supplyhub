'use client'

import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { formatCurrency, getStockBucket } from '@/lib/utils'
import { StatusBadge } from '@/components/seller/status-badge'
import { ProductRowActions } from '@/components/seller/product-row-actions'
import type { Product, PriceTier } from '@/types'
import { IconPackage, IconPhoto } from '@tabler/icons-react'

interface ProductTableProps {
  products: Product[]
  onDelete: (id: string) => void
  onStatusChange: (id: string, status: 'active' | 'draft') => void
  selectedIds: Set<string>
  onToggleSelect: (id: string) => void
  onToggleSelectAll: () => void
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

export function ProductTable({
  products,
  onDelete,
  onStatusChange,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
}: ProductTableProps) {
  const t = useTranslations('seller')
  const locale = useLocale()
  const allSelected = products.length > 0 && products.every((p) => selectedIds.has(p.id))

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-surface-container border-b border-outline-variant">
            <th className="p-4 w-14 text-center">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={onToggleSelectAll}
                disabled={products.length === 0}
                className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary bg-surface cursor-pointer"
              />
            </th>
            <th className="p-4 w-20 text-xs font-semibold uppercase tracking-wider text-on-surface">{t('products.table.image')}</th>
            <th className="p-4 min-w-60 text-xs font-semibold uppercase tracking-wider text-on-surface">{t('products.table.productInfo')}</th>
            <th className="p-4 text-xs font-semibold uppercase tracking-wider text-on-surface">{t('products.table.category')}</th>
            <th className="p-4 text-right text-xs font-semibold uppercase tracking-wider text-on-surface">{t('products.table.stockLevel')}</th>
            <th className="p-4 text-right text-xs font-semibold uppercase tracking-wider text-on-surface">{t('products.table.priceRange')}</th>
            <th className="p-4 text-center text-xs font-semibold uppercase tracking-wider text-on-surface">{t('products.table.status')}</th>
            <th className="p-4 text-right text-xs font-semibold uppercase tracking-wider text-on-surface">{t('products.table.actions')}</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-outline-variant/30">
          {products.length === 0 ? (
            <tr>
              <td colSpan={8} className="p-12 text-center">
                <IconPackage size={40} className="block mx-auto mb-3 text-outline-variant" />
                <span className="text-sm text-on-surface-variant">{t('products.table.noResults')}</span>
              </td>
            </tr>
          ) : (
            products.map((product) => {
              const { min, max } = getPriceRange(product.price_tiers)
              const bucket = getStockBucket(product.stock_quantity ?? 0)

              return (
                <tr
                  key={product.id}
                  className="hover:bg-surface-container/50 transition-colors group"
                >
                  <td className="p-4 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(product.id)}
                      onChange={() => onToggleSelect(product.id)}
                      className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary bg-surface cursor-pointer"
                    />
                  </td>
                  <td className="p-4">
                    <div className="w-12 h-12 bg-surface-container rounded-lg overflow-hidden border border-outline-variant/20 flex items-center justify-center">
                      {product.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <IconPhoto className="text-outline-variant" />
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <Link
                      href={`/${locale}/seller/products/${product.id}`}
                      className="text-sm font-semibold text-on-surface hover:text-primary transition-colors block"
                    >
                      {product.name}
                    </Link>
                    <span className="font-mono text-xs text-on-surface-variant mt-1 block">
                      ID: {product.id.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-secondary-container/30 text-on-secondary-container text-xs border border-secondary-container/50">
                      {product.category}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <span className={`text-sm font-semibold tabular-nums ${STOCK_STYLE[bucket]}`}>
                      {product.stock_quantity ?? 0}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <span className="text-sm font-semibold text-on-surface block">
                      {formatCurrency(min)} – {formatCurrency(max)}
                    </span>
                    <span className="text-xs text-on-surface-variant">{t('products.table.perUnit')}</span>
                  </td>
                  <td className="p-4 text-center">
                    <StatusBadge status={product.status} />
                  </td>
                  <td className="p-4 text-right">
                    <ProductRowActions
                      productId={product.id}
                      status={product.status}
                      onDelete={() => onDelete(product.id)}
                      onStatusChange={(s) => onStatusChange(product.id, s)}
                    />
                  </td>
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
