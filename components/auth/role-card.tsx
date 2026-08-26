import { cn } from '@/lib/utils'
import type { ElementType } from 'react'

interface RoleCardProps {
  selected: boolean
  onSelect: () => void
  icon: ElementType
  iconBg: string
  title: string
  description: string
}

export function RoleCard({ selected, onSelect, icon: Icon, iconBg, title, description }: RoleCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'flex flex-col items-center gap-6 p-8 rounded-xl border-2 transition-all duration-300 text-center w-full h-full',
        selected
          ? 'bg-primary-fixed border-primary shadow-md'
          : 'bg-surface-container-lowest border-transparent hover:bg-surface-container-low hover:shadow-sm'
      )}
    >
      <div
        className={cn(
          'w-20 h-20 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300',
          iconBg,
          selected && 'scale-110'
        )}
      >
        <Icon size={40} />
      </div>
      <div>
        <h3 className="text-base font-semibold text-on-surface mb-2">{title}</h3>
        <p className="text-sm text-on-surface-variant">{description}</p>
      </div>
    </button>
  )
}
