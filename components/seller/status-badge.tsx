const CONFIG = {
  active: {
    bg: 'bg-secondary-container text-on-secondary-container',
    dot: 'bg-on-secondary-container',
    label: 'Active',
  },
  draft: {
    bg: 'bg-surface-container-highest text-on-surface-variant',
    dot: 'bg-on-surface-variant',
    label: 'Draft',
  },
  inactive: {
    bg: 'bg-error-container text-on-error-container',
    dot: 'bg-error',
    label: 'Inactive',
  },
} as const

type StatusKey = keyof typeof CONFIG

interface StatusBadgeProps {
  status: string
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const cfg = CONFIG[status as StatusKey] ?? CONFIG.draft
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  )
}
