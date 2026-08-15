'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'

type Notification = {
  id: string
  icon: string
  iconBg: string
  iconColor: string
  title: string
  message: string
  time: string
  read: boolean
  action?: { label: string }
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    icon: 'request_quote',
    iconBg: 'bg-primary-container',
    iconColor: 'text-on-primary-container',
    title: 'New Quote Response',
    message: 'Supplier Acme Corp has responded to your RFQ for Industrial Bearings. Review the updated pricing.',
    time: '2m ago',
    read: false,
    action: { label: 'View Quote' },
  },
  {
    id: '2',
    icon: 'local_shipping',
    iconBg: 'bg-secondary-container',
    iconColor: 'text-on-secondary-container',
    title: 'Order #552 Shipped',
    message: 'Your order for 500x Steel Brackets has been shipped. Estimated delivery: Oct 24.',
    time: '1h ago',
    read: false,
  },
  {
    id: '3',
    icon: 'check_circle',
    iconBg: 'bg-surface-container-high',
    iconColor: 'text-on-surface-variant',
    title: 'Payment Confirmed',
    message: 'Invoice INV-2023-089 has been successfully settled.',
    time: 'Yesterday',
    read: true,
  },
  {
    id: '4',
    icon: 'warning',
    iconBg: 'bg-tertiary-container',
    iconColor: 'text-on-tertiary-container',
    title: 'Action Required: Compliance',
    message: 'Please update your tax certification documents before the end of Q4 to avoid disruptions.',
    time: 'Oct 20',
    read: true,
  },
]

export function NotificationBell() {
  const [open,          setOpen]          = useState(false)
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS)
  const containerRef = useRef<HTMLDivElement>(null)
  const pathname     = usePathname()
  const allNotificationsHref = pathname.startsWith('/buyer') ? '/buyer/notifications' : '/seller/notifications'

  const unreadCount = notifications.filter((n) => !n.read).length

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
  }

  return (
    <div className="relative" ref={containerRef}>
      {/* Bell button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors"
        aria-label="Notifications"
      >
        <span className="material-symbols-outlined">notifications</span>
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
          <h3 className="text-base font-semibold text-on-surface">Notifications</h3>
          <button
            onClick={markAllRead}
            className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            Mark all as read
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto max-h-100">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`
                group relative px-6 py-4 flex gap-4 cursor-pointer transition-colors hover:bg-surface-container-low
                ${n.read ? 'bg-surface-container-lowest opacity-75 hover:opacity-100' : 'bg-surface'}
              `}
            >
              {/* Unread accent bar */}
              {!n.read && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
              )}

              {/* Icon */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${n.iconBg}`}>
                <span className={`material-symbols-outlined ${n.iconColor}`} style={{ fontSize: '20px' }}>
                  {n.icon}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <p className="text-sm font-semibold text-on-surface truncate">{n.title}</p>
                  <span className="text-xs text-on-surface-variant whitespace-nowrap ml-2">{n.time}</span>
                </div>
                <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">{n.message}</p>
                {n.action && (
                  <div className="mt-3">
                    <Button size="sm" className="text-xs">
                      {n.action.label}
                    </Button>
                  </div>
                )}
              </div>

              {/* Unread dot */}
              {!n.read && (
                <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5 shadow-[0_0_8px_rgba(2,36,72,0.4)]" />
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-surface-container-lowest border-t border-outline-variant/10 flex justify-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <Link
            href={allNotificationsHref}
            onClick={() => setOpen(false)}
            className="text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 group/link"
          >
            View all notifications
            <span className="material-symbols-outlined text-[15px] group-hover/link:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </Link>
        </div>
      </div>
    </div>
  )
}
