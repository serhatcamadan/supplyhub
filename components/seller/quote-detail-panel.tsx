'use client'

import { useTranslations } from 'next-intl'
import { formatCurrency } from '@/lib/utils'
import { Avatar } from '@/components/ui/avatar'
import { IconMapPin, IconMessage, IconPackage, IconQuote } from '@tabler/icons-react'

interface QuoteDetailPanelProps {
  buyerName: string
  buyerInitials: string
  buyerMessage: string | null
  productName: string
  productId: string
  productCategory: string
  quantity: number
  listPrice: number | null
  minOrderQty: number
}

export function QuoteDetailPanel({
  buyerName,
  buyerInitials,
  buyerMessage,
  productName,
  productId,
  productCategory,
  quantity,
  listPrice,
  minOrderQty,
}: QuoteDetailPanelProps) {
  const t = useTranslations('seller')

  return (
    <div className="flex-1 flex flex-col bg-surface rounded-2xl shadow-sm overflow-hidden border border-outline-variant/30">

      {/* Buyer header */}
      <div className="p-6 bg-surface-container-low border-b border-outline-variant/30 flex items-center gap-4">
        <Avatar
          name={buyerName}
          size="xl"
          colorScheme="secondary"
          className="border-2 border-surface shadow-sm"
        />
        <div>
          <h2 className="text-2xl font-semibold text-on-surface">{buyerName}</h2>
          <div className="flex items-center gap-2 mt-1 text-on-surface-variant">
            <IconMapPin size={16} />
            <span className="text-sm">{t('quotes.detail.location')}</span>
            <span className="w-1 h-1 rounded-full bg-outline-variant" />
            <span className="text-sm">{t('quotes.detail.buyerRole')}</span>
          </div>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-8">

        {/* Requested Products */}
        <section>
          <h3 className="text-base font-semibold text-on-surface mb-4 flex items-center gap-2">
            <IconPackage size={20} className="text-primary" />
            {t('quotes.detail.requestedProducts')}
          </h3>

          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant/30">
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                    {t('quotes.detail.colItem')}
                  </th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-on-surface-variant text-right">
                    {t('quotes.detail.colQty')}
                  </th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-on-surface-variant text-right">
                    {t('quotes.detail.colListPrice')}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center shrink-0">
                        <IconPackage size={22} className="text-outline-variant" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-on-surface">{productName}</p>
                        <p className="text-xs text-on-surface-variant font-mono">
                          SKU: {productId.toUpperCase()} · {productCategory}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-right font-mono text-sm text-on-surface">
                    {quantity.toLocaleString('tr-TR')} {t('quotes.detail.unit')}
                  </td>
                  <td className="p-4 text-right font-mono text-sm text-on-surface">
                    {listPrice ? `${formatCurrency(listPrice)}/${t('quotes.detail.unit')}` : '—'}
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="p-4 bg-surface-container-lowest border-t border-outline-variant/20 flex justify-between items-center">
              <span className="text-xs text-on-surface-variant">
                {t('quotes.detail.totalAtListPrice')}{' '}
                <strong className="text-on-surface">
                  {listPrice ? formatCurrency(listPrice * quantity) : '—'}
                </strong>
              </span>
              <span className="text-xs text-on-surface-variant">
                {t('quotes.detail.minOrder')}{' '}
                <strong className="text-on-surface">{minOrderQty} {t('quotes.detail.unit')}</strong>
              </span>
            </div>
          </div>
        </section>

        {/* Buyer Message */}
        <section>
          <h3 className="text-base font-semibold text-on-surface mb-3 flex items-center gap-2">
            <IconMessage size={20} className="text-primary" />
            {t('quotes.detail.buyerMessage')}
          </h3>
          {buyerMessage ? (
            <div className="p-5 bg-surface-container-lowest rounded-xl border border-outline-variant/30 relative overflow-hidden">
              <IconQuote size={48} className="absolute top-3 left-3 text-outline-variant/20 select-none pointer-events-none" />
              <p className="text-sm text-on-surface leading-relaxed relative z-10">
                {buyerMessage}
              </p>
            </div>
          ) : (
            <div className="p-5 bg-surface-container-lowest rounded-xl border border-dashed border-outline-variant/50 text-center">
              <p className="text-sm text-on-surface-variant italic">{t('quotes.detail.noMessage')}</p>
            </div>
          )}
        </section>

      </div>
    </div>
  )
}
