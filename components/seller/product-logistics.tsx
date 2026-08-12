'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

const INPUT = 'w-full px-3 py-2 bg-surface border border-outline-variant/40 rounded-lg text-sm font-mono text-on-surface focus:outline-none focus:border-primary'

export function ProductLogistics() {
  const [isActive, setIsActive] = useState(true)

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm p-8 border border-outline-variant/20">
      <h2 className="text-sm font-semibold text-on-surface mb-6 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary text-[20px]">local_shipping</span>
        Logistics
      </h2>

      <div className="space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-outline-variant/10">
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-on-surface">Available for Order</span>
            <span className="text-xs text-on-surface-variant">Product is visible to buyers</span>
          </div>
          <button
            type="button"
            onClick={() => setIsActive((v) => !v)}
            className={cn('relative w-11 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-secondary/30', isActive ? 'bg-secondary' : 'bg-surface-container-highest')}
          >
            <span className={cn('absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform', isActive ? 'translate-x-5' : 'translate-x-0')} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">WEIGHT (KG)</label>
            <input type="number" step="0.01" min={0} placeholder="0.00" className={INPUT} />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">LEAD TIME (DAYS)</label>
            <input type="number" min={0} placeholder="14" className={INPUT} />
          </div>
        </div>
      </div>
    </div>
  )
}
