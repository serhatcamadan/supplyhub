'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CATEGORY_STYLE } from '@/lib/notifications'
import { cn } from '@/lib/utils'
import { IconX } from '@tabler/icons-react'
import type { Notification } from '@/types'

interface NotificationItemProps {
  n: Notification
  title: string
  message: string
  actionLabel: string
  timeLabel: string
  href: string
  onDismiss: (id: string) => void
  onAction: (n: Notification) => void
}

export function NotificationItem({ n, title, message, actionLabel, timeLabel, href, onDismiss, onAction }: NotificationItemProps) {
  const { icon: Icon, bg, color } = CATEGORY_STYLE[n.category]
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

      <div className={cn('w-12 h-12 rounded-full flex items-center justify-center shrink-0 mt-0.5 shadow-inner', bg)}>
        <Icon className={color} size={24} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2 mb-1">
          <h3 className="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors flex items-center gap-2">
            {title}
            {!n.read && <span className="w-2 h-2 rounded-full bg-primary shrink-0" />}
          </h3>
          <span className="text-xs text-on-surface-variant whitespace-nowrap">{timeLabel}</span>
        </div>
        <p className="text-sm text-on-surface-variant mb-3 line-clamp-2 leading-relaxed">{message}</p>
        {n.action_href && (
          <div className="flex flex-wrap items-center gap-2">
            <Link href={href} onClick={() => onAction(n)}>
              <Button variant="secondary" size="sm">
                {actionLabel}
              </Button>
            </Link>
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
