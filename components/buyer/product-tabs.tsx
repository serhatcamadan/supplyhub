'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

type Tab = 'overview' | 'specs' | 'docs'

const MOCK_DOCS = [
  { icon: 'description',    name: 'Ürün Güvenlik Bilgi Formu (SDS)', ext: 'PDF', size: '2.1 MB' },
  { icon: 'verified',       name: 'Kalite Güvencesi Sertifikası',      ext: 'PDF', size: '0.8 MB' },
  { icon: 'eco',            name: 'Organik Sertifikasyon',              ext: 'PDF', size: '1.2 MB' },
  { icon: 'science',        name: 'Laboratuvar Test Raporu',            ext: 'PDF', size: '3.4 MB' },
]

interface ProductTabsProps {
  description: string
  features: string[]
  specs?: { label: string; value: string }[]
}

const TABS: { id: Tab; label: string }[] = [
  { id: 'overview', label: 'Genel Bakış' },
  { id: 'specs',    label: 'Teknik Özellikler' },
  { id: 'docs',     label: 'Belgeler' },
]

export function ProductTabs({ description, features, specs = [] }: ProductTabsProps) {
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
            <p className="text-sm text-on-surface-variant">Teknik özellik bilgisi mevcut değil.</p>
          )
        )}
        {active === 'docs' && (
          <div className="flex flex-col gap-3">
            {MOCK_DOCS.map((doc) => (
              <div
                key={doc.name}
                className="flex items-center gap-4 p-4 rounded-xl border border-outline-variant/30 hover:bg-surface-container-low transition-colors group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary" style={{ fontSize: '22px' }}>{doc.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-on-surface truncate">{doc.name}</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">{doc.ext} · {doc.size}</p>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100" style={{ fontSize: '20px' }}>
                  download
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
