import { getTranslations } from 'next-intl/server'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { IconSparkles, IconBulbOff } from '@tabler/icons-react'
import type { ElementType } from 'react'

export type ProductRecommendation = {
  category: string
  icon: ElementType
  buyerCount: number
}

function RecItem({ rec, buyerCountLabel, createDraftLabel }: {
  rec: ProductRecommendation
  buyerCountLabel: string
  createDraftLabel: string
}) {
  return (
    <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-surface-container-low transition-colors">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-lg bg-surface-container flex items-center justify-center shrink-0">
          <rec.icon size={28} className="text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-on-surface">{rec.category}</h3>
          <span className="inline-block mt-2 px-2 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded">
            {buyerCountLabel}
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
        {recommendations.length === 0 ? (
          <EmptyState icon={IconBulbOff} message={t('discover.recommendations.empty')} />
        ) : (
          recommendations.map((rec) => (
            <RecItem
              key={rec.category}
              rec={rec}
              buyerCountLabel={t('discover.recommendations.buyerCountLabel', { count: rec.buyerCount })}
              createDraftLabel={t('discover.recommendations.createDraft')}
            />
          ))
        )}
      </div>
    </section>
  )
}
