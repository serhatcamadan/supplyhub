'use client'

import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { IconPrinter } from '@tabler/icons-react'

export function PrintButton() {
  const t = useTranslations('common')
  return (
    <Button variant="outline" className="text-primary" onClick={() => window.print()}>
      <IconPrinter size={20} />
      {t('print')}
    </Button>
  )
}
