'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { RevenueChart } from './revenue-chart'
import { IconDownload } from '@tabler/icons-react'

type DataPoint = { month: string; revenue: number }

interface RevenueChartCardProps {
  weeklyData: DataPoint[]
  monthlyData: DataPoint[]
}

export function RevenueChartCard({ weeklyData, monthlyData }: RevenueChartCardProps) {
  const t = useTranslations('seller')
  const [period, setPeriod] = useState<'weekly' | 'monthly'>('monthly')

  const data = period === 'weekly' ? weeklyData : monthlyData

  function handleExport() {
    const header = `${t('dashboard.exportPeriodLabel')},${t('dashboard.exportRevenueLabel')}\n`
    const rows = data.map((d) => `${d.month},${d.revenue}`).join('\n')
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `supplyhub-revenue-${period}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-on-surface">{t('dashboard.monthlyRevenue')}</h3>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleExport}>
            <IconDownload size={16} />
            {t('dashboard.exportReport')}
          </Button>
          <div className="w-px h-4 bg-outline-variant/40" />
          <Button
            variant={period === 'weekly' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setPeriod('weekly')}
          >
            {t('dashboard.weekly')}
          </Button>
          <Button
            variant={period === 'monthly' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setPeriod('monthly')}
          >
            {t('dashboard.monthly')}
          </Button>
        </div>
      </div>
      <RevenueChart data={data} />
    </div>
  )
}
