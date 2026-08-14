'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

type Tab = 'overview' | 'specs' | 'docs'

interface ProductTabsProps {
  description: string
  features: string[]
}

const TABS: { id: Tab; label: string }[] = [
  { id: 'overview', label: 'Genel Bakış' },
  { id: 'specs',    label: 'Teknik Özellikler' },
  { id: 'docs',     label: 'Belgeler' },
]

export function ProductTabs({ description, features }: ProductTabsProps) {
  const [active, setActive] = useState<Tab>('overview')

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
      {/* Tab bar */}
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

      {/* Content */}
      <div className="p-8">
        {active === 'overview' && (
          <div className="flex flex-col gap-6">
            <p className="text-sm text-on-surface-variant leading-relaxed">{description}</p>
            {features.length > 0 && (
              <>
                <h3 className="text-base font-semibold text-on-surface">Temel Özellikler</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <span
                        className="material-symbols-outlined text-secondary mt-0.5"
                        style={{ fontSize: '20px', fontVariationSettings: "'FILL' 1" }}
                      >
                        check_circle
                      </span>
                      <span className="text-sm text-on-surface-variant">{feature}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
        {active === 'specs' && (
          <p className="text-sm text-on-surface-variant">Teknik özellikler yakında eklenecek.</p>
        )}
        {active === 'docs' && (
          <p className="text-sm text-on-surface-variant">Belgeler yakında eklenecek.</p>
        )}
      </div>
    </div>
  )
}
