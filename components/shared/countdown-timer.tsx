'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'

interface CountdownTimerProps {
  endsAt: string
  ended?: boolean
  className?: string
  onExpire?: () => void
}

function formatRemaining(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000))
  const days = Math.floor(totalSeconds / 86_400)
  const hours = Math.floor((totalSeconds % 86_400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (days > 0) return `${days}g ${hours}s`
  const hh = String(hours).padStart(2, '0')
  const mm = String(minutes).padStart(2, '0')
  const ss = String(seconds).padStart(2, '0')
  return `${hh}:${mm}:${ss}`
}

export function CountdownTimer({ endsAt, ended, className, onExpire }: CountdownTimerProps) {
  const t = useTranslations('buyer')
  const [remaining, setRemaining] = useState(() => new Date(endsAt).getTime() - Date.now())
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const firedExpireRef = useRef(false)

  const tick = useCallback(() => {
    const diff = new Date(endsAt).getTime() - Date.now()
    setRemaining(diff)
    if (diff <= 0) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (!firedExpireRef.current) {
        firedExpireRef.current = true
        onExpire?.()
      }
    }
  }, [endsAt, onExpire])

  useEffect(() => {
    firedExpireRef.current = false
    // The initial `remaining` value already comes from useState's lazy initializer above —
    // this effect only needs to start the recurring tick, not run one synchronously itself.
    intervalRef.current = setInterval(tick, 1000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endsAt])

  if (ended || remaining <= 0) {
    return <span className={cn('font-mono font-semibold text-on-surface-variant', className)}>{t('auctions.countdown.ended')}</span>
  }

  const isEndingSoon = remaining <= 60_000

  return (
    <span className={cn('font-mono font-semibold', isEndingSoon ? 'text-error' : 'text-on-surface', className)}>
      {formatRemaining(remaining)}
    </span>
  )
}
