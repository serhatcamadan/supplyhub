import { cn } from '@/lib/utils'
import type { ElementType } from 'react'

interface SectionHeadingProps {
  icon: ElementType
  label: string
  className?: string
}

export function SectionHeading({ icon: Icon, label, className }: SectionHeadingProps) {
  return (
    <h2 className={cn('text-sm font-semibold text-on-surface mb-6 flex items-center gap-2', className)}>
      <Icon className="text-primary" size={20} />
      {label}
    </h2>
  )
}
