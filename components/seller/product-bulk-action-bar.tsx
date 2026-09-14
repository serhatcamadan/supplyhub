'use client'

import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { IconTrash, IconX } from '@tabler/icons-react'

interface ProductBulkActionBarProps {
  count: number
  onSetActive: () => void
  onSetDraft: () => void
  onDelete: () => void
  onClear: () => void
}

export function ProductBulkActionBar({ count, onSetActive, onSetDraft, onDelete, onClear }: ProductBulkActionBarProps) {
  const t = useTranslations('seller')

  return (
    <div className="bg-primary-container/20 border border-primary/30 rounded-xl px-4 py-3 flex flex-col sm:flex-row gap-3 items-center justify-between">
      <span className="text-sm font-semibold text-on-surface">
        {t('products.bulk.selected', { count })}
      </span>
      <div className="flex items-center gap-2 flex-wrap justify-end">
        <Button type="button" variant="outline" size="sm" onClick={onSetActive}>
          {t('products.bulk.setActive')}
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onSetDraft}>
          {t('products.bulk.setDraft')}
        </Button>
        <Button type="button" variant="destructive" size="sm" onClick={onDelete}>
          <IconTrash size={16} />
          {t('products.bulk.delete')}
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={onClear}>
          <IconX size={16} />
          {t('products.bulk.clear')}
        </Button>
      </div>
    </div>
  )
}
