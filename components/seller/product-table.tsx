'use client'

import { useTranslations } from 'next-intl'
import { cn, formatCurrency } from '@/lib/utils'
import { StatusBadge } from '@/components/seller/status-badge'
import { StockBar } from '@/components/seller/stock-bar'
import { ProductRowActions } from '@/components/seller/product-row-actions'
import type { Product, PriceTier } from '@/types'

interface ProductTableProps {
  products: Product[]
}

function getPriceRange(tiers: PriceTier[]) {
  const prices = tiers.map((t) => t.price)
  return { min: Math.min(...prices), max: Math.max(...prices) }
}

const MOCK_STOCK: Record<string, number> = {
  'product-1': 5240,
  'product-2': 120,
  'product-3': 0,
  'product-4': 1800,
}

export function ProductTable({ products }: ProductTableProps) {
  const t = useTranslations('seller')

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container border-b border-outline-variant">
              <th className="p-4 w-14 text-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary bg-surface cursor-pointer"
                />
              </th>
              <th className="p-4 w-20 text-xs font-semibold uppercase tracking-wider text-on-surface">{t('products.table.image')}</th>
              <th className="p-4 min-w-60 text-xs font-semibold uppercase tracking-wider text-on-surface">{t('products.table.productInfo')}</th>
              <th className="p-4 text-xs font-semibold uppercase tracking-wider text-on-surface">{t('products.table.category')}</th>
              <th className="p-4 text-right text-xs font-semibold uppercase tracking-wider text-on-surface">{t('products.table.priceRange')}</th>
              <th className="p-4 text-right text-xs font-semibold uppercase tracking-wider text-on-surface">{t('products.table.stockLevel')}</th>
              <th className="p-4 text-center text-xs font-semibold uppercase tracking-wider text-on-surface">{t('products.table.status')}</th>
              <th className="p-4 text-right text-xs font-semibold uppercase tracking-wider text-on-surface">{t('products.table.actions')}</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-outline-variant/30">
            {products.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-12 text-center">
                  <span
                    className="material-symbols-outlined block mx-auto mb-3 text-outline-variant"
                    style={{ fontSize: '40px' }}
                  >
                    inventory_2
                  </span>
                  <span className="text-sm text-on-surface-variant">{t('products.table.noResults')}</span>
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const stock = MOCK_STOCK[product.id] ?? 500
                const { min, max } = getPriceRange(product.price_tiers)

                return (
                  <tr
                    key={product.id}
                    className={cn(
                      'hover:bg-surface-container/50 transition-colors group',
                      stock === 0 && 'bg-error-container/5'
                    )}
                  >
                    <td className="p-4 text-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary bg-surface cursor-pointer"
                      />
                    </td>
                    <td className="p-4">
                      <div className="w-12 h-12 bg-surface-container rounded-lg overflow-hidden border border-outline-variant/20 flex items-center justify-center">
                        {product.image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="material-symbols-outlined text-outline-variant" style={{ fontSize: '24px' }}>
                            image
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors cursor-pointer block">
                        {product.name}
                      </span>
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
                      <span className="text-sm font-semibold text-on-surface block">
                        {formatCurrency(min)} – {formatCurrency(max)}
                      </span>
                      <span className="text-xs text-on-surface-variant">{t('products.table.perUnit')}</span>
                    </td>
                    <td className="p-4 text-right">
                      <StockBar productId={product.id} />
                    </td>
                    <td className="p-4 text-center">
                      <StatusBadge status={product.status} />
                    </td>
                    <td className="p-4 text-right">
                      <ProductRowActions productId={product.id} />
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="border-t border-outline-variant/30 p-4 flex items-center justify-between">
        <span className="text-xs text-on-surface-variant">
          {t('products.table.rowsPerPage')}: <strong>10</strong>
        </span>
        <div className="flex items-center gap-1">
          <button className="w-8 h-8 flex items-center justify-center rounded-md text-on-surface-variant hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>chevron_left</span>
          </button>
          {[1, 2, 3].map((n) => (
            <button
              key={n}
              className={cn(
                'w-8 h-8 flex items-center justify-center rounded-md text-xs font-semibold transition-colors',
                n === 1 ? 'bg-primary text-on-primary' : 'text-on-surface hover:bg-surface-container'
              )}
            >
              {n}
            </button>
          ))}
          <span className="text-on-surface-variant text-xs mx-1">...</span>
          <button className="w-8 h-8 flex items-center justify-center rounded-md text-on-surface hover:bg-surface-container transition-colors text-xs font-semibold">
            15
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-md text-on-surface-variant hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  )
}
