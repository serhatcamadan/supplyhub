'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { IconAdjustments, IconSearch } from '@tabler/icons-react'

export function DiscoverSearch() {
  const [query, setQuery] = useState('')

  return (
    <section className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1 group">
        <IconSearch size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-12 pr-20 py-3 bg-surface-container-lowest rounded-xl text-sm text-on-surface border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
          placeholder="Search product categories, materials, or market keywords…"
          type="text"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-on-surface-variant/50 text-[10px] font-mono tracking-widest uppercase select-none">
          <span className="px-1.5 py-0.5 bg-surface-container rounded">⌘</span>
          <span className="px-1.5 py-0.5 bg-surface-container rounded">K</span>
        </div>
      </div>
      <Button variant="outline" size="lg" className="whitespace-nowrap">
        <IconAdjustments size={18} />
        Filtrele
      </Button>
    </section>
  )
}
