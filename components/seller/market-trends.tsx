import { getTranslations } from 'next-intl/server'
import { IconArrowRight, IconTrendingUp } from '@tabler/icons-react'
import type { ElementType } from 'react'

export type MarketTrend = {
  category: string
  subcategory: string
  icon: ElementType
  growth: string
  demand: string
  demandPct: number
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

function TrendCard({ trend, demandLabel }: { trend: MarketTrend; demandLabel: string }) {
  const c = COLOR[trend.colorScheme]
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
            <p className="text-xs text-on-surface-variant">{trend.subcategory}</p>
          </div>
        </div>
        <div className={`flex items-center gap-1 ${c.badge} px-2 py-1 rounded-md text-xs font-semibold`}>
          <IconTrendingUp size={14} />
          {trend.growth}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-2 relative z-10">
        <div className="flex justify-between text-xs">
          <span className="text-on-surface-variant">{demandLabel}</span>
          <span className="font-semibold text-on-surface">{trend.demand}</span>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {trends.map((tr) => (
          <TrendCard key={tr.category} trend={tr} demandLabel={t('discover.trends.demandLabel')} />
        ))}
      </div>
    </section>
  )
}
