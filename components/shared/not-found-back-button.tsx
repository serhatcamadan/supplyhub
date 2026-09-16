'use client'

import { buttonVariants } from '@/components/ui/button'
import { IconArrowLeft } from '@tabler/icons-react'

export function NotFoundBackButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.history.back()}
      className={buttonVariants({ variant: 'outline', size: 'lg' })}
    >
      <IconArrowLeft size={18} />
      {label}
    </button>
  )
}
