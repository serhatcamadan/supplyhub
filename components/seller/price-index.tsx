export type PriceComparison = {
  product: string
  unit: string
  myPrice: number
  marketPrice: number
}

function PriceBar({ item }: { item: PriceComparison }) {
  const max = Math.max(item.myPrice, item.marketPrice) * 1.2
  const myPct = Math.round((item.myPrice / max) * 100)
  const mktPct = Math.round((item.marketPrice / max) * 100)
  const cheaper = item.myPrice <= item.marketPrice

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-end">
        <span className="text-sm font-medium text-on-surface">{item.product}</span>
        <span className="text-xs font-mono text-on-surface-variant">Birim: {item.unit}</span>
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
          {item.myPrice.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 })}
        </span>
        <span
          className="absolute top-full mt-1 text-xs text-on-surface-variant"
          style={{ left: `${mktPct}%`, transform: 'translateX(-50%)' }}
        >
          Pazar: {item.marketPrice.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 })}
        </span>
      </div>
    </div>
  )
}

export function PriceIndex({ comparisons }: { comparisons: PriceComparison[] }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-on-surface">Rakip Fiyat Endeksi</h2>
      <div className="bg-surface-container-lowest rounded-xl shadow-sm p-6 flex flex-col gap-10">
        <div className="flex items-center justify-between">
          <p className="text-xs text-on-surface-variant">Aktif kategorileriniz vs. pazar ortalaması · Son 30 gün</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-xs text-on-surface-variant">Siz</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-outline-variant" />
              <span className="text-xs text-on-surface-variant">Pazar</span>
            </div>
          </div>
        </div>
        {comparisons.map((c) => (
          <PriceBar key={c.product} item={c} />
        ))}
      </div>
    </section>
  )
}
