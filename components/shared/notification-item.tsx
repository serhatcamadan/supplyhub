'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { IconX } from '@tabler/icons-react'
import type { ElementType } from 'react'

export type FullNotification = {
  id: string
  category: 'order' | 'quote' | 'system'
  icon: ElementType
  iconBg: string
  iconColor: string
  title: string
  message: string
  time: string
  read: boolean
  actions?: { label: string; variant: 'primary' | 'secondary' | 'outline' | 'destructive' }[]
}

export function NotificationItem({
  n,
  onDismiss,
}: {
  n: FullNotification
  onDismiss: (id: string) => void
}) {
  const Icon = n.icon
  return (
    <div
      className={cn(
        'group relative flex gap-4 p-5 border-b border-outline-variant/20 hover:bg-surface-container-low transition-colors',
        n.read ? 'opacity-75 hover:opacity-100' : 'bg-surface-container-lowest'
      )}
    >
      {!n.read && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-sm" />
      )}

      <div className={cn('w-12 h-12 rounded-full flex items-center justify-center shrink-0 mt-0.5 shadow-inner', n.iconBg)}>
        <Icon className={n.iconColor} size={24} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2 mb-1">
          <h3 className="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors flex items-center gap-2">
            {n.title}
            {!n.read && <span className="w-2 h-2 rounded-full bg-primary shrink-0" />}
          </h3>
          <span className="text-xs text-on-surface-variant whitespace-nowrap">{n.time}</span>
        </div>
        <p className="text-sm text-on-surface-variant mb-3 line-clamp-2 leading-relaxed">{n.message}</p>
        {n.actions && n.actions.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {n.actions.map((a) => (
              <Button key={a.label} variant={a.variant} size="sm">
                {a.label}
              </Button>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={() => onDismiss(n.id)}
        className="absolute top-4 right-4 text-on-surface-variant hover:text-error opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Dismiss"
      >
        <IconX size={20} />
      </button>
    </div>
  )
}
