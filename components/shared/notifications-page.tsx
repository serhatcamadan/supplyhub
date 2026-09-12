'use client'

import { useState, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Button } from '@/components/ui/button'
import { NotificationItem } from './notification-item'
import { NotificationFilterSidebar, type FilterType } from './notification-filter-sidebar'
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '@/lib/api/notifications'
import { translateNotification, timeAgo } from '@/lib/notifications'
import { IconChecks, IconChevronLeft, IconChevronRight, IconCircleCheck, IconSettings } from '@tabler/icons-react'
import type { Notification } from '@/types'

function matches(n: Notification, filter: FilterType, search: string, title: string, message: string): boolean {
  const q = search.toLowerCase()
  if (q && !title.toLowerCase().includes(q) && !message.toLowerCase().includes(q)) return false
  if (filter === 'unread') return !n.read
  if (filter === 'orders') return n.category === 'order'
  if (filter === 'quotes') return n.category === 'quote'
  if (filter === 'system') return n.category === 'system'
  return true
}

export function NotificationsPage() {
  const t = useTranslations('common')
  const locale = useLocale()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [activeFilter,  setActiveFilter]  = useState<FilterType>('all')
  const [search,        setSearch]        = useState('')

  useEffect(() => {
    getNotifications().then(setNotifications).catch(() => {})
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length

  const translated = notifications.map((n) => ({ n, ...translateNotification(t, n, locale) }))
  const visible = translated.filter(({ n, title, message }) => matches(n, activeFilter, search, title, message))

  const countByFilter: Record<FilterType, number> = {
    all:    notifications.length,
    unread: unreadCount,
    orders: notifications.filter((n) => n.category === 'order').length,
    quotes: notifications.filter((n) => n.category === 'quote').length,
    system: notifications.filter((n) => n.category === 'system').length,
  }

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    markAllNotificationsRead().catch(() => {})
  }
  function dismiss(id: string) {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
    markNotificationRead(id).catch(() => {})
  }
  function handleAction(n: Notification) {
    if (n.read) return
    setNotifications((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)))
    markNotificationRead(n.id).catch(() => {})
  }

  return (
    <div className="px-8 py-8 max-w-360 mx-auto">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-on-surface mb-1 flex items-center gap-3">
            {t('notifications.heading')}
            {unreadCount > 0 && (
              <span className="text-xl font-semibold text-on-surface-variant bg-surface-variant px-3 py-1 rounded-full">
                {unreadCount} {t('notifications.filters.unread')}
              </span>
            )}
          </h1>
          <p className="text-sm text-on-surface-variant">
            {t('notifications.page.subheading')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={markAllRead} className="gap-2">
            <IconChecks className="text-[20px]" />
            {t('notifications.markAllRead')}
          </Button>
          <Button variant="ghost" className="w-10 h-10 p-0">
            <IconSettings />
          </Button>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">

        <NotificationFilterSidebar
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          countByFilter={countByFilter}
          search={search}
          onSearchChange={setSearch}
        />

        <div className="flex-1 min-w-0">
          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 flex flex-col overflow-hidden">
            {visible.length === 0 ? (
              <div className="py-20 flex flex-col items-center gap-4 text-center">
                <div className="w-16 h-16 bg-secondary-fixed/20 rounded-full flex items-center justify-center">
                  <IconCircleCheck className="text-secondary text-[32px]" />
                </div>
                <div>
                  <p className="font-semibold text-on-surface text-lg">{t('notifications.page.allCaughtUp')}</p>
                  <p className="text-sm text-on-surface-variant mt-1">{t('notifications.page.noMatch')}</p>
                </div>
              </div>
            ) : (
              visible.map(({ n, title, message, actionLabel }) => (
                <NotificationItem
                  key={n.id}
                  n={n}
                  title={title}
                  message={message}
                  actionLabel={actionLabel}
                  timeLabel={timeAgo(t, n.created_at)}
                  href={n.action_href ? `/${locale}${n.action_href}` : '#'}
                  onDismiss={dismiss}
                  onAction={handleAction}
                />
              ))
            )}

            <div className="p-4 flex items-center justify-between bg-surface-container-lowest border-t border-outline-variant/10">
              <span className="text-xs text-on-surface-variant">
                {t('notifications.page.showing', { shown: visible.length, total: notifications.length })}
              </span>
              <div className="flex gap-2">
                <button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant/50 text-on-surface-variant opacity-50 cursor-not-allowed">
                  <IconChevronLeft className="text-[20px]" />
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant/50 text-on-surface-variant opacity-50 cursor-not-allowed">
                  <IconChevronRight className="text-[20px]" />
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
