'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { acceptQuoteRequest, declineQuoteRequest } from '@/lib/api/quotes'
import { IconCheck, IconX } from '@tabler/icons-react'

export function QuoteResponseActions({ quoteId }: { quoteId: string }) {
  const t = useTranslations('buyer')
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<'accept' | 'decline' | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleAccept() {
    setIsLoading('accept')
    setError(null)
    try {
      await acceptQuoteRequest(quoteId)
      router.refresh()
    } catch {
      setError(t('quotes.detail.actionError'))
    } finally {
      setIsLoading(null)
    }
  }

  async function handleDecline() {
    setIsLoading('decline')
    setError(null)
    try {
      await declineQuoteRequest(quoteId)
      router.refresh()
    } catch {
      setError(t('quotes.detail.actionError'))
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {error && <p className="text-sm text-error">{error}</p>}
      <div className="flex gap-3">
        <Button variant="secondary" onClick={handleAccept} disabled={isLoading !== null}>
          <IconCheck size={18} />
          {isLoading === 'accept' ? t('quotes.detail.accepting') : t('quotes.detail.accept')}
        </Button>
        <Button
          variant="outline"
          className="text-error hover:bg-error-container/50"
          onClick={handleDecline}
          disabled={isLoading !== null}
        >
          <IconX size={18} />
          {isLoading === 'decline' ? t('quotes.detail.declining') : t('quotes.detail.decline')}
        </Button>
      </div>
    </div>
  )
}
