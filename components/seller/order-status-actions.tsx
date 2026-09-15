'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { updateOrderStatus } from '@/lib/api/orders'
import { Button } from '@/components/ui/button'
import type { OrderStatus } from '@/types'
import { IconChecks, IconCircleCheck, IconTruck } from '@tabler/icons-react'

interface OrderStatusActionsProps {
  orderId: string
  status: OrderStatus
}

export function OrderStatusActions({ orderId, status }: OrderStatusActionsProps) {
  const t = useTranslations('seller')
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function handleTransition(next: OrderStatus) {
    setIsLoading(true)
    try {
      await updateOrderStatus(orderId, next)
      router.refresh()
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'pending') {
    return (
      <Button variant="primary" onClick={() => handleTransition('confirmed')} disabled={isLoading}>
        <IconCircleCheck size={18} />
        {t('orders.table.rowActions.confirm')}
      </Button>
    )
  }
  if (status === 'confirmed') {
    return (
      <Button variant="primary" onClick={() => handleTransition('shipped')} disabled={isLoading}>
        <IconTruck size={18} />
        {t('orders.table.rowActions.ship')}
      </Button>
    )
  }
  if (status === 'shipped') {
    return (
      <Button variant="secondary" onClick={() => handleTransition('delivered')} disabled={isLoading}>
        <IconChecks size={18} />
        {t('orders.table.rowActions.deliver')}
      </Button>
    )
  }
  return null
}
