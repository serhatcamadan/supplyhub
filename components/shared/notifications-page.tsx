'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { NotificationItem, type FullNotification } from './notification-item'
import { NotificationFilterSidebar, FILTERS, type FilterType } from './notification-filter-sidebar'
import { IconAlertTriangle, IconChecks, IconChevronLeft, IconChevronRight, IconCircleCheck, IconFileInvoice, IconPackage, IconSettings, IconShoppingBag } from '@tabler/icons-react'

const INITIAL: FullNotification[] = [
  {
    id: '1',
    category: 'order',
    icon: IconShoppingBag,
    iconBg: 'bg-primary-container',
    iconColor: 'text-on-primary-container',
    title: 'Order #ORD-8472 Shipped',
    message: 'Your wholesale order for 500x Industrial Widgets has been dispatched via Freight Forwarding Inc. Expected delivery is Thursday, Oct 12.',
    time: '10 mins ago',
    read: false,
    actions: [
      { label: 'Track Shipment', variant: 'primary' },
      { label: 'View Order',     variant: 'outline' },
    ],
  },
  {
    id: '2',
    category: 'quote',
    icon: IconFileInvoice,
    iconBg: 'bg-secondary-container',
    iconColor: 'text-on-secondary-container',
    title: 'New Quote Received: RFQ-992',
    message: "TechCorp Supplies has submitted a quote for your request regarding 'Bulk Silicone Sealant'. The quoted price is 15% below your target.",
    time: '2 hours ago',
    read: false,
    actions: [{ label: 'Review Quote', variant: 'secondary' }],
  },
  {
    id: '3',
    category: 'system',
    icon: IconAlertTriangle,
    iconBg: 'bg-error-container',
    iconColor: 'text-on-error-container',
    title: 'Payment Failed: Invoice #INV-102',
    message: 'Your scheduled ACH transfer for Invoice #INV-102 was declined by your bank. Please update your payment method to avoid shipping delays.',
    time: 'Yesterday, 14:30',
    read: false,
    actions: [{ label: 'Update Payment', variant: 'destructive' }],
  },
  {
    id: '4',
    category: 'system',
    icon: IconCircleCheck,
    iconBg: 'bg-surface-container-highest',
    iconColor: 'text-on-surface-variant',
    title: 'Account Verified',
    message: 'Your business credentials have been successfully verified. You now have full access to the B2B wholesale marketplace.',
    time: 'Oct 4, 2023',
    read: true,
  },
  {
    id: '5',
    category: 'order',
    icon: IconPackage,
    iconBg: 'bg-surface-container-highest',
    iconColor: 'text-on-surface-variant',
    title: 'Low Stock Alert',
    message: 'Item SKU: AL-9902 is running low. Only 15 units remain in your reserved inventory. Consider restocking soon.',
    time: 'Oct 2, 2023',
    read: true,
    actions: [{ label: 'Reorder', variant: 'outline' }],
  },
]

function matches(n: FullNotification, filter: FilterType, search: string): boolean {
  const q = search.toLowerCase()
  if (q && !n.title.toLowerCase().includes(q) && !n.message.toLowerCase().includes(q)) return false
  if (filter === 'unread')  return !n.read
  if (filter === 'orders')  return n.category === 'order'
  if (filter === 'quotes')  return n.category === 'quote'
  if (filter === 'system')  return n.category === 'system'
  return true
}

export function NotificationsPage() {
  const [notifications, setNotifications] = useState(INITIAL)
  const [activeFilter,  setActiveFilter]  = useState<FilterType>('all')
  const [search,        setSearch]        = useState('')

  const unreadCount    = notifications.filter((n) => !n.read).length
  const visible        = notifications.filter((n) => matches(n, activeFilter, search))
  const countByFilter: Record<FilterType, number> = {
    all:    notifications.length,
    unread: notifications.filter((n) => !n.read).length,
    orders: notifications.filter((n) => n.category === 'order').length,
    quotes: notifications.filter((n) => n.category === 'quote').length,
    system: notifications.filter((n) => n.category === 'system').length,
  }

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }
  function dismiss(id: string) {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  return (
    <div className="px-8 py-8 max-w-360 mx-auto">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-on-surface mb-1 flex items-center gap-3">
            Notifications
            {unreadCount > 0 && (
              <span className="text-xl font-semibold text-on-surface-variant bg-surface-variant px-3 py-1 rounded-full">
                {unreadCount} Unread
              </span>
            )}
          </h1>
          <p className="text-sm text-on-surface-variant">
            Stay updated on your orders, quotes, and account activity.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={markAllRead} className="gap-2">
            <IconChecks className="text-[20px]" />
            Mark all as read
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
                  <p className="font-semibold text-on-surface text-lg">All caught up!</p>
                  <p className="text-sm text-on-surface-variant mt-1">No notifications match this filter.</p>
                </div>
              </div>
            ) : (
              visible.map((n) => (
                <NotificationItem key={n.id} n={n} onDismiss={dismiss} />
              ))
            )}

            <div className="p-4 flex items-center justify-between bg-surface-container-lowest border-t border-outline-variant/10">
              <span className="text-xs text-on-surface-variant">
                Showing {visible.length} of {notifications.length} notifications
              </span>
              <div className="flex gap-2">
                <button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant/50 text-on-surface-variant opacity-50 cursor-not-allowed">
                  <IconChevronLeft className="text-[20px]" />
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant/50 text-on-surface-variant hover:bg-surface-variant hover:text-primary transition-colors">
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
