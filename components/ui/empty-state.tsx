import type { ElementType } from 'react'

interface EmptyStateProps {
  icon: ElementType
  message: string
}

export function EmptyState({ icon: Icon, message }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
      <Icon className="text-outline-variant" size={40} />
      <span className="text-sm text-on-surface-variant">{message}</span>
    </div>
  )
}
