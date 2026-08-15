import { cn } from '@/lib/utils'

const MOCK_STOCK: Record<string, number> = {
  'product-1': 5240,
  'product-2': 120,
  'product-3': 0,
  'product-4': 1800,
}

export function StockBar({ productId }: { productId: string }) {
  const stock = MOCK_STOCK[productId] ?? 500

  if (stock === 0) {
    return (
      <div className="flex flex-col items-end">
        <span className="font-mono text-sm font-bold text-error">0</span>
        <div className="w-16 h-1.5 bg-error-container rounded-full mt-1.5 overflow-hidden">
          <div className="h-full bg-error w-0 rounded-full" />
        </div>
        <span className="text-[10px] text-error font-semibold mt-0.5">Out of Stock</span>
      </div>
    )
  }

  const isLow = stock < 200
  const pct = isLow
    ? Math.max(8, Math.round((stock / 200) * 20))
    : Math.min(100, Math.round((stock / 6000) * 100))

  return (
    <div className="flex flex-col items-end">
      <span className="font-mono text-sm font-bold text-on-surface">
        {stock.toLocaleString('tr-TR')}
      </span>
      <div className="w-16 h-1.5 bg-surface-container-high rounded-full mt-1.5 overflow-hidden">
        <div
          className={cn('h-full rounded-full', isLow ? 'bg-on-tertiary-container' : 'bg-secondary')}
          style={{ width: `${pct}%` }}
        />
      </div>
      {isLow && (
        <span className="text-[10px] text-on-tertiary-container font-semibold mt-0.5">Low Stock</span>
      )}
    </div>
  )
}
