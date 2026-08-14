import { formatCurrency } from '@/lib/utils'

export type CartItem = {
  id: string
  name: string
  sku: string
  supplierName: string
  imageUrl: string | null
  qty: number
  unitPrice: number
  originalUnitPrice: number
  tierLabel: string | null
  stockStatus: 'in_stock' | 'low_stock'
  tierPct: number
  minQty: number
}

const STOCK_BADGE: Record<CartItem['stockStatus'], { label: string; className: string }> = {
  in_stock:  { label: 'STOKTA',    className: 'text-secondary bg-secondary-container/30' },
  low_stock: { label: 'AZ STOK',   className: 'text-on-tertiary-container bg-tertiary-container/20' },
}

interface CartItemCardProps {
  item: CartItem
  onQtyChange: (id: string, qty: number) => void
  onRemove: (id: string) => void
}

export function CartItemCard({ item, onQtyChange, onRemove }: CartItemCardProps) {
  const total = item.unitPrice * item.qty
  const hasDiscount = item.unitPrice < item.originalUnitPrice
  const originalTotal = item.originalUnitPrice * item.qty
  const badge = STOCK_BADGE[item.stockStatus]

  function decrement() {
    onQtyChange(item.id, Math.max(item.minQty, item.qty - 1))
  }
  function increment() {
    onQtyChange(item.id, item.qty + 1)
  }
  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const v = Number(e.target.value)
    if (v >= item.minQty) onQtyChange(item.id, v)
  }

  return (
    <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-6 relative overflow-hidden">

      {/* Image */}
      <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg flex-shrink-0 overflow-hidden bg-surface-container relative group">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="material-symbols-outlined text-on-surface-variant/20" style={{ fontSize: '40px' }}>image</span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 flex flex-col justify-between">
        {/* Header row */}
        <div className="flex justify-between items-start gap-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs text-on-surface-variant bg-surface-container px-2 py-0.5 rounded">
                {item.sku}
              </span>
              <span className={`text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${badge.className}`}>
                {badge.label}
              </span>
            </div>
            <h3 className="text-base font-semibold text-on-surface">{item.name}</h3>
            <p className="text-sm text-on-surface-variant mt-0.5">
              Tedarikçi:{' '}
              <span className="text-primary">{item.supplierName}</span>
            </p>
          </div>
          <button
            onClick={() => onRemove(item.id)}
            className="text-on-surface-variant hover:text-error transition-colors p-1 rounded-full hover:bg-error-container/30 shrink-0"
            aria-label="Kaldır"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Footer row: qty + price */}
        <div className="flex flex-wrap items-end justify-between gap-4 mt-4">
          {/* Qty stepper */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Miktar</span>
            <div className="flex items-center bg-surface-container rounded-lg p-1 w-fit shadow-sm">
              <button
                onClick={decrement}
                className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-surface-container-high text-on-surface transition-colors"
                aria-label="Azalt"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>remove</span>
              </button>
              <input
                type="number"
                value={item.qty}
                min={item.minQty}
                onChange={handleInput}
                className="w-16 bg-transparent text-center font-mono text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary rounded-md py-1 appearance-none"
              />
              <button
                onClick={increment}
                className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-surface-container-high text-on-surface transition-colors"
                aria-label="Artır"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
              </button>
            </div>
          </div>

          {/* Price */}
          <div className="text-right">
            {hasDiscount && (
              <div className="text-sm text-on-surface-variant line-through opacity-70">
                {formatCurrency(originalTotal)}
              </div>
            )}
            <div className="text-xl font-bold text-on-surface">{formatCurrency(total)}</div>
            {item.tierLabel && (
              <div className="text-xs text-secondary mt-0.5">{item.tierLabel}</div>
            )}
            {!item.tierLabel && (
              <div className="text-xs text-on-surface-variant mt-0.5">{formatCurrency(item.unitPrice)} / adet</div>
            )}
          </div>
        </div>
      </div>

      {/* Tier progress bar — bottom edge */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-surface-container">
        <div
          className={`h-full transition-all ${item.tierPct > 20 ? 'bg-primary-fixed' : 'bg-outline-variant'}`}
          style={{ width: `${item.tierPct}%` }}
        />
      </div>
    </div>
  )
}
