import { IconArrowDown, IconArrowUp, IconMinus } from '@tabler/icons-react'
import type { PricePoint } from '@/lib/api/products'

interface PriceTrendChartProps {
  history: PricePoint[]
  noDataLabel: string
  upLabel: string
  downLabel: string
  stableLabel: string
}

export function PriceTrendChart({ history, noDataLabel, upLabel, downLabel, stableLabel }: PriceTrendChartProps) {
  if (history.length < 2) {
    return <p className="text-sm text-on-surface-variant">{noDataLabel}</p>
  }

  const prices = history.map((h) => h.price)
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  const range = max - min || 1

  const points = history.map((h, i) => {
    const x = history.length > 1 ? (i / (history.length - 1)) * 100 : 0
    const y = 28 - ((h.price - min) / range) * 26
    return `${x},${y}`
  })
  const [lastX, lastY] = points[points.length - 1].split(',')

  const first = prices[0]
  const last = prices[prices.length - 1]
  const changePct = first > 0 ? Math.round(((last - first) / first) * 100) : 0
  const direction = changePct > 0 ? 'up' : changePct < 0 ? 'down' : 'stable'

  const colorClass =
    direction === 'up' ? 'text-error' : direction === 'down' ? 'text-secondary' : 'text-primary'
  const Icon = direction === 'up' ? IconArrowUp : direction === 'down' ? IconArrowDown : IconMinus
  const label =
    direction === 'stable'
      ? stableLabel
      : `${direction === 'up' ? upLabel : downLabel} (${changePct > 0 ? '+' : ''}${changePct}%)`

  return (
    <>
      <p className={`text-sm font-semibold flex items-center gap-1 ${colorClass}`}>
        <Icon size={14} />
        {label}
      </p>
      <div className="h-20 w-full mt-2">
        <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="w-full h-full">
          <polyline
            points={points.join(' ')}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`${colorClass} opacity-50`}
          />
          <circle cx={lastX} cy={lastY} r="2" fill="currentColor" className={colorClass} />
        </svg>
      </div>
    </>
  )
}
