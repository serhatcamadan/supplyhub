'use client'

import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { IconShoppingBag, IconCreditCard, IconTruck } from '@tabler/icons-react'
import type { ElementType } from 'react'

interface StatCardProps {
  icon: ElementType
  label: string
  value: string
  badge?: string
  color: 'primary' | 'secondary' | 'tertiary'
}

const ICON_COLOR = {
  primary:   'text-primary bg-primary-container/20',
  secondary: 'text-secondary bg-secondary-container/20',
  tertiary:  'text-on-tertiary-container bg-tertiary-container/20',
} as const

const GRADIENT_FROM = {
  primary:   'from-primary/5',
  secondary: 'from-secondary/5',
  tertiary:  'from-on-tertiary-container/5',
} as const

function StatCard({ icon: Icon, label, value, badge, color }: StatCardProps) {
  return (
    <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col justify-between h-32 relative overflow-hidden group">
      <div
        className={`absolute inset-0 bg-linear-to-br ${GRADIENT_FROM[color]} to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`}
      />
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <Icon className={cn('p-2 rounded-lg', ICON_COLOR[color])} size={20} />
          <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
            {label}
          </span>
        </div>
        {badge && (
          <span className="text-xs font-semibold text-secondary bg-secondary-container/30 px-2 py-1 rounded">
            {badge}
          </span>
        )}
      </div>
      <div className="text-4xl font-bold text-on-surface relative z-10">{value}</div>
    </div>
  )
}

interface OrderStatCardsProps {
  totalOrders: number
  totalSpend: string
  inTransit: number
}

export function OrderStatCards({ totalOrders, totalSpend, inTransit }: OrderStatCardsProps) {
  const t = useTranslations('buyer')

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard
        icon={IconShoppingBag}
        label={t('orders.stats.totalOrders')}
        value={String(totalOrders)}
        color="primary"
      />
      <StatCard
        icon={IconCreditCard}
        label={t('orders.stats.totalSpend')}
        value={totalSpend}
        badge="+12%"
        color="secondary"
      />
      <StatCard
        icon={IconTruck}
        label={t('orders.stats.inTransit')}
        value={String(inTransit)}
        color="tertiary"
      />
    </div>
  )
}
