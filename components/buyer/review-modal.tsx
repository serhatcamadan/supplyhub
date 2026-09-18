'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { submitReview } from '@/lib/api/reviews'
import { Button } from '@/components/ui/button'
import type { OrderWithDetails } from '@/types'
import { IconStar, IconStarFilled, IconX } from '@tabler/icons-react'

interface ReviewModalProps {
  order: OrderWithDetails
  onClose: () => void
  onSubmitted: () => void
}

export function ReviewModal({ order, onClose, onSubmitted }: ReviewModalProps) {
  const t = useTranslations('buyer')
  const unreviewedItems = order.items.filter(
    (item) => !order.reviewed_product_ids.includes(item.product_id)
  )
  const [ratings, setRatings] = useState<Record<string, number>>({})
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function setRating(productId: string, value: number) {
    setRatings((prev) => ({ ...prev, [productId]: value }))
  }

  async function handleSubmit() {
    const entries = Object.entries(ratings)
    if (entries.length === 0) return
    setSubmitting(true)
    setError(null)
    const results = await Promise.allSettled(
      entries.map(([productId, rating]) =>
        submitReview({ order_id: order.id, product_id: productId, rating })
      )
    )
    setSubmitting(false)
    if (results.some((r) => r.status === 'rejected')) {
      setError(t('orders.review.error'))
      return
    }
    onSubmitted()
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-surface-container-lowest rounded-2xl shadow-xl w-full max-w-md p-6 flex flex-col gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-on-surface">{t('orders.review.heading')}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <IconX size={20} />
          </button>
        </div>

        {unreviewedItems.length === 0 ? (
          <p className="text-sm text-on-surface-variant">{t('orders.review.allReviewed')}</p>
        ) : (
          <div className="flex flex-col gap-4">
            {unreviewedItems.map((item) => (
              <div key={item.product_id} className="flex items-center justify-between gap-4">
                <span className="text-sm font-medium text-on-surface flex-1 min-w-0 truncate">
                  {item.product.name}
                </span>
                <div className="flex items-center gap-1 shrink-0">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setRating(item.product_id, n)}
                      aria-label={t('orders.review.starLabel', { count: n })}
                      className="text-tertiary-container hover:scale-110 transition-transform"
                    >
                      {(ratings[item.product_id] ?? 0) >= n ? (
                        <IconStarFilled size={22} />
                      ) : (
                        <IconStar size={22} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <p className="text-sm text-error" role="alert">
            {error}
          </p>
        )}

        {unreviewedItems.length > 0 && (
          <div className="flex justify-end gap-2 pt-2 border-t border-outline-variant/20">
            <Button variant="ghost" onClick={onClose}>
              {t('orders.review.cancel')}
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={submitting || Object.keys(ratings).length === 0}
            >
              {submitting ? t('orders.review.submitting') : t('orders.review.submit')}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
