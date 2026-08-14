import { cn, getInitials } from '@/lib/utils'

const SIZE = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-xl',
} as const

const COLOR = {
  secondary: 'bg-secondary-container text-on-secondary-container',
  surface:   'bg-surface-container-highest text-on-surface',
  primary:   'bg-primary-container/20 text-primary',
} as const

interface AvatarProps {
  name: string
  size?: keyof typeof SIZE
  colorScheme?: keyof typeof COLOR
  className?: string
}

export function Avatar({ name, size = 'sm', colorScheme = 'secondary', className }: AvatarProps) {
  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-bold shrink-0',
        SIZE[size],
        COLOR[colorScheme],
        className
      )}
    >
      {getInitials(name)}
    </div>
  )
}
