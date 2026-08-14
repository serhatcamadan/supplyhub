import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  icon: string
  label: string
  className?: string
}

export function SectionHeading({ icon, label, className }: SectionHeadingProps) {
  return (
    <h2 className={cn('text-sm font-semibold text-on-surface mb-6 flex items-center gap-2', className)}>
      <span className="material-symbols-outlined text-primary text-[20px]">{icon}</span>
      {label}
    </h2>
  )
}
