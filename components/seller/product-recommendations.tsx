import { getTranslations } from 'next-intl/server'
import { Button } from '@/components/ui/button'
import { IconSparkles } from '@tabler/icons-react'
import type { ElementType } from 'react'

export type ProductRecommendation = {
  name: string
  description: string
  margin: string
  icon: ElementType
}

function RecItem({ rec, marginLabel, createDraftLabel }: { rec: ProductRecommendation; marginLabel: string; createDraftLabel: string }) {
  return (
    <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-surface-container-low transition-colors">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-lg bg-surface-container flex items-center justify-center shrink-0">
          <rec.icon size={28} className="text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-on-surface">{rec.name}</h3>
          <p className="text-xs text-on-surface-variant mt-0.5 line-clamp-1">{rec.description}</p>
          <span className="inline-block mt-2 px-2 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded">
            {marginLabel}
          </span>
        </div>
      </div>
      <Button variant="outline" size="sm" className="text-primary/50 shrink-0 whitespace-nowrap cursor-not-allowed" disabled>
        {createDraftLabel}
      </Button>
    </div>
  )
}

export async function ProductRecommendations({ recommendations }: { recommendations: ProductRecommendation[] }) {
  const t = await getTranslations('seller')

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <IconSparkles size={20} className="text-on-tertiary-container" />
        <h2 className="text-xl font-semibold text-on-surface">{t('discover.recommendations.heading')}</h2>
      </div>
      <div className="bg-surface-container-lowest rounded-xl shadow-sm flex flex-col divide-y divide-surface-container overflow-hidden">
        {recommendations.map((rec) => (
          <RecItem
            key={rec.name}
            rec={rec}
            marginLabel={t('discover.recommendations.marginLabel', { margin: rec.margin })}
            createDraftLabel={t('discover.recommendations.createDraft')}
          />
        ))}
      </div>
    </section>
  )
}
