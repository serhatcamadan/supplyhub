'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { IconCircleCheck, IconDownload, IconFileDescription, IconRosetteDiscountCheck, IconLeaf, IconFlask } from '@tabler/icons-react'
import type { ElementType } from 'react'

type Tab = 'overview' | 'specs' | 'docs'

interface ProductTabsProps {
  description: string
  features: string[]
  specs?: { label: string; value: string }[]
}

const MOCK_DOCS_DEFS: { icon: ElementType; key: string; ext: string; size: string }[] = [
  { icon: IconFileDescription,      key: 'sds',     ext: 'PDF', size: '2.1 MB' },
  { icon: IconRosetteDiscountCheck, key: 'quality', ext: 'PDF', size: '0.8 MB' },
  { icon: IconLeaf,                 key: 'organic', ext: 'PDF', size: '1.2 MB' },
  { icon: IconFlask,                key: 'lab',     ext: 'PDF', size: '3.4 MB' },
]

export function ProductTabs({ description, features, specs = [] }: ProductTabsProps) {
  const t = useTranslations('buyer')
  const [active, setActive] = useState<Tab>('overview')

  const TABS: { id: Tab; label: string }[] = [
    { id: 'overview', label: t('productTabs.overview') },
    { id: 'specs',    label: t('productTabs.specs') },
    { id: 'docs',     label: t('productTabs.docs') },
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
          <div className="flex flex-col gap-6">
            <p className="text-sm text-on-surface-variant leading-relaxed">{description}</p>
            {features.length > 0 && (
              <>
                <h3 className="text-base font-semibold text-on-surface">{t('productTabs.keyFeatures')}</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <IconCircleCheck size={20} className="text-secondary mt-0.5" />
                      <span className="text-sm text-on-surface-variant">{feature}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
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
        {active === 'docs' && (
          <div className="flex flex-col gap-3">
            {MOCK_DOCS_DEFS.map((doc) => (
              <div
                key={doc.key}
                className="flex items-center gap-4 p-4 rounded-xl border border-outline-variant/30 hover:bg-surface-container-low transition-colors group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <doc.icon size={22} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-on-surface truncate">{t(`productTabs.documents.${doc.key}`)}</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">{doc.ext} · {doc.size}</p>
                </div>
                <IconDownload size={20} className="text-on-surface-variant group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
