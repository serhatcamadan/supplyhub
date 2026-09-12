'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { Button } from '@/components/ui/button'
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '@/lib/api/notifications'
import { translateNotification, timeAgo, CATEGORY_STYLE } from '@/lib/notifications'
import { IconArrowRight, IconBell } from '@tabler/icons-react'
import type { Notification } from '@/types'

export function NotificationBell() {
  const [open,          setOpen]          = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const pathname     = usePathname()
  const t            = useTranslations('common')
  const locale       = useLocale()
  const allNotificationsHref = pathname.startsWith('/buyer') ? `/${locale}/buyer/notifications` : `/${locale}/seller/notifications`

  const unreadCount = notifications.filter((n) => !n.read).length

  useEffect(() => {
    getNotifications().then(setNotifications).catch(() => {})
  }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    markAllNotificationsRead().catch(() => {})
  }

  function handleAction(n: Notification) {
    setOpen(false)
    if (!n.read) {
      setNotifications((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)))
      markNotificationRead(n.id).catch(() => {})
    }
  }

  return (
    <div className="relative" ref={containerRef}>
      {/* Bell button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors"
        aria-label="Notifications"
      >
        <IconBell />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full border-2 border-surface" />
        )}
      </button>

      {/* Dropdown */}
      <div
        className={`
          absolute right-0 top-full mt-3 w-96 bg-surface-container-lowest rounded-xl shadow-xl
          border border-outline-variant/20 overflow-hidden flex flex-col z-50
          origin-top-right transition-all duration-200
          ${open ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}
        `}
      >
        {/* Header */}
        <div className="px-6 py-4 flex justify-between items-center bg-surface-container-low border-b border-outline-variant/20">
          <h3 className="text-base font-semibold text-on-surface">{t('notifications.heading')}</h3>
          <button
            onClick={markAllRead}
            className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            {t('notifications.markAllRead')}
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto max-h-100">
          {notifications.length === 0 ? (
            <div className="py-10 text-center text-sm text-on-surface-variant">{t('notifications.empty')}</div>
          ) : (
            notifications.map((n) => {
              const { icon: Icon, bg, color } = CATEGORY_STYLE[n.category]
              const { title, message, actionLabel } = translateNotification(t, n, locale)
              return (
                <div
                  key={n.id}
                  className={`
                    group relative px-6 py-4 flex gap-4 cursor-pointer transition-colors hover:bg-surface-container-low
                    ${n.read ? 'bg-surface-container-lowest opacity-75 hover:opacity-100' : 'bg-surface'}
                  `}
                >
                  {!n.read && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
                  )}

                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${bg}`}>
                    <Icon className={color} size={20} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-sm font-semibold text-on-surface truncate">{title}</p>
                      <span className="text-xs text-on-surface-variant whitespace-nowrap ml-2">{timeAgo(t, n.created_at)}</span>
                    </div>
                    <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">{message}</p>
                    {n.action_href && (
                      <div className="mt-3">
                        <Link href={`/${locale}${n.action_href}`} onClick={() => handleAction(n)}>
                          <Button size="sm" className="text-xs">
                            {actionLabel}
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>

                  {!n.read && (
                    <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5 shadow-[0_0_8px_rgba(2,36,72,0.4)]" />
                  )}
                </div>
              )
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-surface-container-lowest border-t border-outline-variant/10 flex justify-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <Link
            href={allNotificationsHref}
            onClick={() => setOpen(false)}
            className="text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 group/link"
          >
            {t('notifications.viewAll')}
            <IconArrowRight className="text-[15px] group-hover/link:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  )
}
