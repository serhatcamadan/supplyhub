import { IconAlertTriangle, IconFileInvoice, IconShoppingBag } from '@tabler/icons-react'
import { formatCurrency } from '@/lib/utils'
import type { ElementType } from 'react'
import type { Notification, NotificationCategory } from '@/types'

export const CATEGORY_STYLE: Record<NotificationCategory, { icon: ElementType; bg: string; color: string }> = {
  order:  { icon: IconShoppingBag,   bg: 'bg-primary-container',   color: 'text-on-primary-container' },
  quote:  { icon: IconFileInvoice,   bg: 'bg-secondary-container', color: 'text-on-secondary-container' },
  system: { icon: IconAlertTriangle, bg: 'bg-tertiary-container',  color: 'text-on-tertiary-container' },
}

/** Expects `t` scoped to the `common` namespace (i.e. `useTranslations('common')`). */
type Translate = (key: string, values?: Record<string, string | number>) => string

export function translateNotification(t: Translate, n: Notification, locale: string): { title: string; message: string; actionLabel: string } {
  const data = n.data as Record<string, string | number>
  const base = `notifications.types.${n.type}`

  const values: Record<string, string | number> = { ...data }
  if (typeof data.total === 'number') values.total = formatCurrency(data.total, locale)
  if (typeof data.status === 'string') values.status = t(`status.${data.status}`)

  return {
    title: t(`${base}.title`),
    message: t(`${base}.message`, values),
    actionLabel: t(`${base}.actionLabel`),
  }
}

export function timeAgo(t: Translate, iso: string): string {
  const diffSec = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (diffSec < 60) return t('notifications.justNow')
  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return t('notifications.minutesAgo', { count: diffMin })
  const diffHour = Math.floor(diffMin / 60)
  if (diffHour < 24) return t('notifications.hoursAgo', { count: diffHour })
  const diffDay = Math.floor(diffHour / 24)
  return t('notifications.daysAgo', { count: diffDay })
}
