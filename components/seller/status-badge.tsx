'use client'

import { useTranslations } from 'next-intl'

const STYLE = {
  active:   { bg: 'bg-secondary-container text-on-secondary-container', dot: 'bg-on-secondary-container' },
  draft:    { bg: 'bg-surface-container-highest text-on-surface-variant', dot: 'bg-on-surface-variant' },
  inactive: { bg: 'bg-error-container text-on-error-container', dot: 'bg-error' },
} as const

type StatusKey = keyof typeof STYLE

interface StatusBadgeProps {
  status: string
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const t = useTranslations('seller')
  const key = status as StatusKey
  const cfg = STYLE[key] ?? STYLE.draft
  const label = key in STYLE ? t(`products.status.${key}`) : status

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {label}
    </span>
  )
}
