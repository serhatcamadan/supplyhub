'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { cancelAuction } from '@/lib/api/auctions'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { IconX } from '@tabler/icons-react'

interface AuctionCancelButtonProps {
  auctionId: string
}

export function AuctionCancelButton({ auctionId }: AuctionCancelButtonProps) {
  const router = useRouter()
  const t = useTranslations('seller')
  const tCommon = useTranslations('common')
  const [open, setOpen] = useState(false)
  const [cancelling, setCancelling] = useState(false)

  async function performCancel() {
    setCancelling(true)
    try {
      await cancelAuction(auctionId)
      setOpen(false)
      router.refresh()
    } catch {
      setCancelling(false)
    }
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <IconX size={16} />
        {t('auctions.list.cancelAction')}
      </Button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('auctions.list.cancelConfirmTitle')}</AlertDialogTitle>
            <AlertDialogDescription>{t('auctions.list.cancelConfirmDesc')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tCommon('dialog.cancel')}</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={performCancel} disabled={cancelling}>
              {t('auctions.list.cancelAction')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
