'use client'

import { Button } from '@/components/ui/button'
import { IconPrinter } from '@tabler/icons-react'

export function PrintButton() {
  return (
    <Button variant="outline" className="text-primary" onClick={() => window.print()}>
      <IconPrinter size={20} />
      Print
    </Button>
  )
}
