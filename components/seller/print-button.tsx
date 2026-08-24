'use client'

import { Button } from '@/components/ui/button'

export function PrintButton() {
  return (
    <Button variant="outline" className="text-primary" onClick={() => window.print()}>
      <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>print</span>
      Print
    </Button>
  )
}
