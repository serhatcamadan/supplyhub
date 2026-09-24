import { getTranslations } from 'next-intl/server'
import { IconArrowRight, IconTrendingUp, IconTrendingDown, IconChartBarOff } from '@tabler/icons-react'
import { EmptyState } from '@/components/ui/empty-state'
import type { ElementType } from 'react'

export type MarketTrend = {
  category: string
  icon: ElementType
  growth: number
  demandPct: number
  buyerCount: number
  colorScheme: 'secondary' | 'tertiary'
}

const COLOR = {
  secondary: {
    bg: 'bg-secondary/10',
    text: 'text-secondary',
    bar: 'bg-secondary',
    badge: 'bg-secondary/10 text-secondary',
  },
  tertiary: {
    bg: 'bg-tertiary/10',
    text: 'text-on-tertiary-container',
    bar: 'bg-on-tertiary-container',
    badge: 'bg-tertiary/10 text-on-tertiary-container',
  },
}

function demandLabelKey(demandPct: number): 'high' | 'mediumHigh' | 'medium' | 'low' {
  if (demandPct >= 75) return 'high'
  if (demandPct >= 50) return 'mediumHigh'
  if (demandPct >= 25) return 'medium'
  return 'low'
}

function TrendCard({ trend, demandLabel, demandValue, buyerCountLabel }: {
  trend: MarketTrend
  demandLabel: string
  demandValue: string
  buyerCountLabel: string
}) {
  const c = COLOR[trend.colorScheme]
  const growing = trend.growth >= 0
  return (
    <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
      <div className={`absolute -right-4 -top-4 w-24 h-24 ${c.bg} rounded-full blur-xl group-hover:scale-150 transition-transform duration-700`} />

      <div className="flex items-start justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg ${c.bg} flex items-center justify-center ${c.text}`}>
            <trend.icon size={22} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-on-surface">{trend.category}</h3>
            <p className="text-xs text-on-surface-variant">{buyerCountLabel}</p>
          </div>
        </div>
        <div className={`flex items-center gap-1 ${c.badge} px-2 py-1 rounded-md text-xs font-semibold`}>
          {growing ? <IconTrendingUp size={14} /> : <IconTrendingDown size={14} />}
          {growing ? '+' : ''}{trend.growth}%
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-2 relative z-10">
        <div className="flex justify-between text-xs">
          <span className="text-on-surface-variant">{demandLabel}</span>
          <span className="font-semibold text-on-surface">{demandValue}</span>
        </div>
        <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
          <div className={`h-full ${c.bar} rounded-full transition-all`} style={{ width: `${trend.demandPct}%` }} />
        </div>
      </div>
    </div>
  )
}

export async function MarketTrends({ trends }: { trends: MarketTrend[] }) {
  const t = await getTranslations('seller')

  return (
    <section className="lg:col-span-2 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-on-surface">{t('discover.trends.heading')}</h2>
        <button
          type="button"
          disabled
          className="text-xs font-semibold text-primary/50 cursor-not-allowed flex items-center gap-1"
        >
          {t('discover.trends.viewAll')}
          <IconArrowRight size={16} />
        </button>
      </div>
      {trends.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-xl shadow-sm">
          <EmptyState icon={IconChartBarOff} message={t('discover.trends.empty')} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {trends.map((tr) => (
            <TrendCard
              key={tr.category}
              trend={tr}
              demandLabel={t('discover.trends.demandLabel')}
              demandValue={t(`discover.trends.demand.${demandLabelKey(tr.demandPct)}`)}
              buyerCountLabel={t('discover.trends.buyerCountLabel', { count: tr.buyerCount })}
            />
          ))}
        </div>
      )}
    </section>
  )
}
