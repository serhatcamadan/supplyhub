export type SearchKeyword = {
  rank: number
  keyword: string
  volume: string
  sparkPath: string
  growing: boolean
}

function MiniSparkline({ path, growing }: { path: string; growing: boolean }) {
  return (
    <svg className={`w-16 h-4 fill-none stroke-2 stroke-linecap-round stroke-linejoin-round ${growing ? 'stroke-secondary' : 'stroke-on-surface-variant/40'}`} viewBox="0 0 100 20">
      <path d={path} />
    </svg>
  )
}

export function BuyerSearches({ keywords }: { keywords: SearchKeyword[] }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-on-surface">Alıcı Aramaları</h2>
      <div className="bg-surface-container-lowest rounded-xl shadow-sm p-5 flex flex-col gap-4 flex-1">
        <div className="flex items-center justify-between pb-3 border-b border-surface-container">
          <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Anahtar Kelime</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Hacim</span>
        </div>
        {keywords.map((kw) => (
          <div
            key={kw.keyword}
            className="flex items-center justify-between group cursor-pointer hover:bg-surface-container-low p-2 -mx-2 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-xs text-on-surface-variant w-4">{kw.rank}.</span>
              <span className="text-sm font-medium text-on-surface group-hover:text-primary transition-colors">{kw.keyword}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-on-surface-variant">{kw.volume}</span>
              <MiniSparkline path={kw.sparkPath} growing={kw.growing} />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
