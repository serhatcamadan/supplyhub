import { Button } from '@/components/ui/button'

export type ProductRecommendation = {
  name: string
  description: string
  margin: string
  icon: string
}

function RecItem({ rec }: { rec: ProductRecommendation }) {
  return (
    <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-surface-container-low transition-colors">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-lg bg-surface-container flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-primary" style={{ fontSize: '28px' }}>{rec.icon}</span>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-on-surface">{rec.name}</h3>
          <p className="text-xs text-on-surface-variant mt-0.5 line-clamp-1">{rec.description}</p>
          <span className="inline-block mt-2 px-2 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded">
            Tahmini Kar: {rec.margin}
          </span>
        </div>
      </div>
      <Button variant="outline" size="sm" className="text-primary shrink-0 whitespace-nowrap">
        Taslak Oluştur
      </Button>
    </div>
  )
}

export function ProductRecommendations({ recommendations }: { recommendations: ProductRecommendation[] }) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-on-tertiary-container" style={{ fontSize: '20px' }}>auto_awesome</span>
        <h2 className="text-xl font-semibold text-on-surface">Eklemeniz Önerilen Ürünler</h2>
      </div>
      <div className="bg-surface-container-lowest rounded-xl shadow-sm flex flex-col divide-y divide-surface-container overflow-hidden">
        {recommendations.map((rec) => (
          <RecItem key={rec.name} rec={rec} />
        ))}
      </div>
    </section>
  )
}
