'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'

type Tab = 'overview' | 'specs'

interface ProductTabsProps {
  description: string
  specs?: { label: string; value: string }[]
}

export function ProductTabs({ description, specs = [] }: ProductTabsProps) {
  const t = useTranslations('buyer')
  const [active, setActive] = useState<Tab>('overview')

  const TABS: { id: Tab; label: string }[] = [
    { id: 'overview', label: t('productTabs.overview') },
    { id: 'specs',    label: t('productTabs.specs') },
  ]

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
      <div className="flex border-b border-outline-variant/30 px-4">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={cn(
              'py-4 px-4 text-sm font-semibold transition-colors whitespace-nowrap',
              active === tab.id
                ? 'text-primary border-b-2 border-primary'
                : 'text-on-surface-variant hover:text-on-surface'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-8">
        {active === 'overview' && (
          <p className="text-sm text-on-surface-variant leading-relaxed">{description}</p>
        )}
        {active === 'specs' && (
          specs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 border border-outline-variant/30 rounded-xl overflow-hidden">
              {specs.map((row, i) => (
                <div
                  key={row.label}
                  className={cn(
                    'flex justify-between items-center px-5 py-3.5 text-sm',
                    i % 2 === 0 ? 'bg-surface-container-low/40' : 'bg-surface-container-lowest',
                    'border-b border-outline-variant/20 last:border-0'
                  )}
                >
                  <span className="font-semibold text-on-surface-variant">{row.label}</span>
                  <span className="text-on-surface font-medium">{row.value}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-on-surface-variant">{t('productTabs.noSpecs')}</p>
          )
        )}
      </div>
    </div>
  )
}
