import { formatCurrency } from '@/lib/utils'
import type { PriceTier } from '@/types'

interface TierRowProps {
  tier: PriceTier
  isActive: boolean
  baseTierPrice: number
}

export function TierRow({ tier, isActive, baseTierPrice }: TierRowProps) {
  const savingsPct =
    baseTierPrice > 0
      ? Math.round(((baseTierPrice - tier.price) / baseTierPrice) * 100)
      : 0
  const rangeLabel = tier.max_qty
    ? `${tier.min_qty} – ${tier.max_qty} adet`
    : `${tier.min_qty}+ adet`

  return (
    <div
      className={`flex justify-between items-center px-4 py-3 transition-colors ${
        isActive ? 'bg-surface-container-low' : 'hover:bg-surface-container-high'
      }`}
    >
      <span className="text-sm text-on-surface">{rangeLabel}</span>
      <div className="text-right">
        <span className="text-sm font-semibold text-on-surface">
          {formatCurrency(tier.price)}{' '}
          <span className="text-xs font-normal text-on-surface-variant">/adet</span>
        </span>
        {savingsPct > 0 && (
          <p className="text-xs text-secondary">%{savingsPct} indirim</p>
        )}
      </div>
    </div>
  )
}
