import { getTranslations, getLocale } from 'next-intl/server'
import { formatCurrency } from '@/lib/utils'

export type PriceComparison = {
  product: string
  unit: string
  myPrice: number
  marketPrice: number
}

function PriceBar({ item, unitLabel, marketLabel, locale }: { item: PriceComparison; unitLabel: string; marketLabel: string; locale: string }) {
  const max = Math.max(item.myPrice, item.marketPrice) * 1.2
  const myPct = Math.round((item.myPrice / max) * 100)
  const mktPct = Math.round((item.marketPrice / max) * 100)
  const cheaper = item.myPrice <= item.marketPrice

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-end">
        <span className="text-sm font-medium text-on-surface">{item.product}</span>
        <span className="text-xs font-mono text-on-surface-variant">{unitLabel}</span>
      </div>
      <div className="relative h-8 w-full bg-surface-container rounded-lg">
        {/* Market bar (background) */}
        <div
          className="absolute left-0 top-0 h-full bg-outline-variant/30 rounded-lg"
          style={{ width: `${mktPct}%` }}
        />
        {/* My price bar */}
        <div
          className={`absolute left-0 top-0 h-full ${cheaper ? 'bg-secondary/20 border-r-2 border-secondary' : 'bg-error/20 border-r-2 border-error'} rounded-l-lg`}
          style={{ width: `${myPct}%` }}
        />
        {/* Labels */}
        <span
          className={`absolute -top-5 text-xs font-semibold ${cheaper ? 'text-secondary' : 'text-error'}`}
          style={{ left: `${myPct}%`, transform: 'translateX(-50%)' }}
        >
          {formatCurrency(item.myPrice, locale)}
        </span>
        <span
          className="absolute top-full mt-1 text-xs text-on-surface-variant"
          style={{ left: `${mktPct}%`, transform: 'translateX(-50%)' }}
        >
          {marketLabel}
        </span>
      </div>
    </div>
  )
}

export async function PriceIndex({ comparisons }: { comparisons: PriceComparison[] }) {
  const [t, locale] = await Promise.all([getTranslations('seller'), getLocale()])

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-on-surface">{t('discover.priceIndex.heading')}</h2>
      <div className="bg-surface-container-lowest rounded-xl shadow-sm p-6 flex flex-col gap-10">
        <div className="flex items-center justify-between">
          <p className="text-xs text-on-surface-variant">{t('discover.priceIndex.subheading')}</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-xs text-on-surface-variant">{t('discover.priceIndex.you')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-outline-variant" />
              <span className="text-xs text-on-surface-variant">{t('discover.priceIndex.market')}</span>
            </div>
          </div>
        </div>
        {comparisons.map((c) => (
          <PriceBar
            key={c.product}
            item={c}
            locale={locale}
            unitLabel={t('discover.priceIndex.unitLabel', { unit: c.unit })}
            marketLabel={t('discover.priceIndex.marketLabel', { price: formatCurrency(c.marketPrice, locale) })}
          />
        ))}
      </div>
    </section>
  )
}
