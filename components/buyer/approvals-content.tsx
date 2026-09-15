'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { ApprovalCard } from './approval-card'
import { ApprovalStatCards } from './approval-stat-cards'
import { Button } from '@/components/ui/button'
import type { OrderWithDetails } from '@/types'
import { IconCircleCheck, IconFilter, IconFilterOff } from '@tabler/icons-react'

interface ApprovalsContentProps {
  pendingApprovals: OrderWithDetails[]
}

export function ApprovalsContent({ pendingApprovals }: ApprovalsContentProps) {
  const t = useTranslations('buyer')
  const [sellerFilter, setSellerFilter] = useState<Set<string>>(new Set())
  const [requesterFilter, setRequesterFilter] = useState<Set<string>>(new Set())
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const sellers = useMemo(() => {
    const map = new Map<string, string>()
    pendingApprovals.forEach((o) => map.set(o.seller.id, o.seller.name))
    return Array.from(map, ([id, name]) => ({ id, name }))
  }, [pendingApprovals])

  const requesters = useMemo(() => {
    const map = new Map<string, string>()
    pendingApprovals.forEach((o) => map.set(o.created_by_user.id, o.created_by_user.name))
    return Array.from(map, ([id, name]) => ({ id, name }))
  }, [pendingApprovals])

  const filtered = pendingApprovals.filter((o) => {
    if (sellerFilter.size > 0 && !sellerFilter.has(o.seller.id)) return false
    if (requesterFilter.size > 0 && !requesterFilter.has(o.created_by_user.id)) return false
    return true
  })

  const totalValue = filtered.reduce((sum, o) => sum + o.total, 0)
  const totalItems = filtered.reduce((sum, o) => sum + o.items.length, 0)
  const activeFilterCount = sellerFilter.size + requesterFilter.size

  function toggleSeller(id: string) {
    setSellerFilter((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleRequester(id: string) {
    setRequesterFilter((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function clearFilters() {
    setSellerFilter(new Set())
    setRequesterFilter(new Set())
  }

  return (
    <>
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-on-surface">{t('approvals.heading')}</h1>
          <p className="text-sm text-on-surface-variant mt-2">{t('approvals.subHeading')}</p>
        </div>
        <div className="relative" ref={ref}>
          <Button variant="outline" onClick={() => setIsOpen((v) => !v)}>
            <IconFilter size={18} />
            {t('approvals.filter')}
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 flex items-center justify-center rounded-full bg-primary text-on-primary text-[10px]">
                {activeFilterCount}
              </span>
            )}
          </Button>
          {isOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant/30 z-20 p-3">
              {sellers.length > 0 && (
                <>
                  <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-2">
                    {t('approvals.filterBySeller')}
                  </p>
                  <div className="flex flex-col gap-1 mb-3">
                    {sellers.map((s) => (
                      <label
                        key={s.id}
                        className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-surface-container cursor-pointer text-sm text-on-surface"
                      >
                        <input
                          type="checkbox"
                          checked={sellerFilter.has(s.id)}
                          onChange={() => toggleSeller(s.id)}
                          className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary"
                        />
                        <span className="truncate">{s.name}</span>
                      </label>
                    ))}
                  </div>
                </>
              )}

              {requesters.length > 0 && (
                <>
                  <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-2">
                    {t('approvals.filterByRequester')}
                  </p>
                  <div className="flex flex-col gap-1 mb-3">
                    {requesters.map((r) => (
                      <label
                        key={r.id}
                        className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-surface-container cursor-pointer text-sm text-on-surface"
                      >
                        <input
                          type="checkbox"
                          checked={requesterFilter.has(r.id)}
                          onChange={() => toggleRequester(r.id)}
                          className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary"
                        />
                        <span className="truncate">{r.name}</span>
                      </label>
                    ))}
                  </div>
                </>
              )}

              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="w-full text-center text-xs font-semibold text-primary hover:underline py-1"
                >
                  {t('approvals.clearFilters')}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <ApprovalStatCards pendingCount={filtered.length} totalItems={totalItems} totalValue={totalValue} />

      {filtered.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 py-20 flex flex-col items-center gap-4 text-center">
          <div
            className={cn(
              'w-16 h-16 rounded-full flex items-center justify-center',
              pendingApprovals.length === 0 ? 'bg-secondary-fixed/20' : 'bg-surface-container-high'
            )}
          >
            {pendingApprovals.length === 0 ? (
              <IconCircleCheck className="text-secondary text-[32px]" />
            ) : (
              <IconFilterOff className="text-on-surface-variant text-[32px]" />
            )}
          </div>
          <div>
            <p className="font-semibold text-on-surface text-lg">
              {pendingApprovals.length === 0 ? t('approvals.empty.heading') : t('approvals.noFilterResults.heading')}
            </p>
            <p className="text-sm text-on-surface-variant mt-1">
              {pendingApprovals.length === 0 ? t('approvals.empty.subtext') : t('approvals.noFilterResults.subtext')}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {filtered.map((order) => (
            <ApprovalCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </>
  )
}
