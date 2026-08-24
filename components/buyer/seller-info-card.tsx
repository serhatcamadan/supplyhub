'use client'

import { useTranslations } from 'next-intl'
import { Avatar } from '@/components/ui/avatar'

interface SellerInfoCardProps {
  sellerName: string
}

export function SellerInfoCard({ sellerName }: SellerInfoCardProps) {
  const t = useTranslations('buyer')

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm p-6 flex flex-col gap-4">
      <h3 className="text-sm font-semibold text-on-surface border-b border-outline-variant/30 pb-2">
        {t('sellerInfo.heading')}
      </h3>

      <div className="flex items-center gap-4 mt-2">
        <Avatar name={sellerName} size="lg" colorScheme="primary" />
        <div>
          <p className="text-sm font-semibold text-on-surface leading-tight">{sellerName}</p>
          <p className="text-xs text-on-surface-variant">{t('sellerInfo.verifiedSupplier')}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-on-surface-variant">{t('sellerInfo.responseTime')}</p>
          <p className="text-sm text-on-surface font-medium">{t('sellerInfo.responseTimeValue')}</p>
        </div>
        <div>
          <p className="text-xs text-on-surface-variant">{t('sellerInfo.onTimeDelivery')}</p>
          <p className="text-sm text-on-surface font-medium">98.5%</p>
        </div>
      </div>

      <button className="text-primary text-sm font-semibold flex items-center gap-1 hover:underline w-fit">
        {t('sellerInfo.viewProfile')}
        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
      </button>
    </div>
  )
}
