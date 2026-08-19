'use client'

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import { formatCurrency } from '@/lib/utils'

interface RevenueChartProps {
  data: { month: string; revenue: number }[]
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#1e3a5f" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#1e3a5f" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
        <YAxis
          tickFormatter={(v) => `${v / 1000}k`}
          tick={{ fontSize: 12, fill: '#64748b' }}
          axisLine={false}
          tickLine={false}
          width={36}
        />
        <Tooltip
          formatter={(value) => [typeof value === 'number' ? formatCurrency(value) : value, 'Gelir']}
          contentStyle={{ fontSize: 13, borderRadius: 8, border: '1px solid #e2e8f0' }}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#1e3a5f"
          strokeWidth={2}
          fill="url(#revenueGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
