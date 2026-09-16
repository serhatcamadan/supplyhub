'use client'

import { useState, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Button } from '@/components/ui/button'
import { TablePagination } from '@/components/ui/table-pagination'
import { Skeleton } from '@/components/ui/skeleton'
import { PageHeaderSkeleton } from '@/components/skeletons/page-header-skeleton'
import { NotificationItem } from './notification-item'
import { NotificationFilterSidebar, type FilterType } from './notification-filter-sidebar'
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '@/lib/api/notifications'
import { translateNotification, timeAgo } from '@/lib/notifications'
import { IconChecks, IconCircleCheck } from '@tabler/icons-react'
import type { Notification } from '@/types'

const ITEMS_PER_PAGE = 10

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
  const [currentPage,   setCurrentPage]   = useState(1)
  const [isLoading,     setIsLoading]     = useState(true)

  useEffect(() => {
    getNotifications().then(setNotifications).catch(() => {}).finally(() => setIsLoading(false))
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length

  const translated = notifications.map((n) => ({ n, ...translateNotification(t, n, locale) }))
  const visible = translated.filter(({ n, title, message }) => matches(n, activeFilter, search, title, message))

  const totalPages = Math.max(1, Math.ceil(visible.length / ITEMS_PER_PAGE))
  const page = Math.min(currentPage, totalPages)
  const paged = visible.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

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

  if (isLoading) {
    return (
      <div className="px-8 py-8 max-w-360 mx-auto">
        <div className="mb-8">
          <PageHeaderSkeleton actionCount={1} />
        </div>
        <div className="flex flex-col xl:flex-row gap-6">
          <div className="w-full xl:w-64 shrink-0">
            <Skeleton className="h-72 w-full rounded-xl" />
          </div>
          <div className="flex-1 min-w-0 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 flex flex-col overflow-hidden">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="px-6 py-4 flex gap-4 border-b border-outline-variant/10 last:border-0">
                <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
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
              paged.map(({ n, title, message, actionLabel }) => (
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

            <TablePagination
              label={t('notifications.page.showing', { shown: paged.length, total: visible.length })}
              page={page}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>

      </div>
    </div>
  )
}
