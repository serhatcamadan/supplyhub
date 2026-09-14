import { getTranslations } from 'next-intl/server'
import { Button } from '@/components/ui/button'
import { IconAdjustments, IconSearch } from '@tabler/icons-react'

export async function DiscoverSearch() {
  const t = await getTranslations('seller')

  return (
    <section className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <IconSearch size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50" />
        <input
          disabled
          className="w-full pl-12 pr-24 py-3 bg-surface-container-lowest rounded-xl text-sm text-on-surface-variant border border-outline-variant/50 shadow-sm cursor-not-allowed placeholder:text-on-surface-variant/50"
          placeholder={t('discover.search.placeholder')}
          type="text"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant/70 bg-surface-container px-2 py-1 rounded select-none">
          {t('discover.search.comingSoon')}
        </span>
      </div>
      <Button variant="outline" size="lg" className="whitespace-nowrap opacity-50 cursor-not-allowed" disabled>
        <IconAdjustments size={18} />
        {t('discover.search.filter')}
      </Button>
    </section>
  )
}
