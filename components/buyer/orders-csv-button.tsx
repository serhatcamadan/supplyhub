'use client'

import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { OrderWithDetails } from '@/types'

export function OrdersCsvButton({ orders }: { orders: OrderWithDetails[] }) {
  const t = useTranslations('buyer')

  function handleDownload() {
    const rows = [
      [
        t('orders.csvHeaders.orderId'),
        t('orders.csvHeaders.supplier'),
        t('orders.csvHeaders.date'),
        t('orders.csvHeaders.total'),
        t('orders.csvHeaders.status'),
        t('orders.csvHeaders.itemCount'),
      ],
      ...orders.map((o) => [
        o.id,
        o.seller.name,
        formatDate(o.created_at),
        formatCurrency(o.total),
        o.status,
        String(o.items.length),
      ]),
    ]
    const csv = rows.map((row) => row.map((c) => `"${c}"`).join(',')).join('\n')
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${t('orders.csvFilename')}-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Button variant="ghost" size="md" onClick={handleDownload}>
      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>download</span>
      {t('orders.csvDownload')}
    </Button>
  )
}
