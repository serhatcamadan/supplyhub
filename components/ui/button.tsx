import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-semibold transition-colors disabled:opacity-60 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary:     'bg-primary text-on-primary hover:bg-primary-container shadow-sm',
        secondary:   'bg-secondary text-on-secondary hover:bg-secondary/90 shadow-sm',
        ghost:       'bg-surface-container-high text-on-surface hover:bg-surface-container-highest',
        outline:     'bg-surface-container-lowest border border-outline-variant text-on-surface hover:bg-surface-container-low',
        destructive: 'bg-error/10 text-error hover:bg-error hover:text-on-error',
        icon:        'text-on-surface-variant hover:bg-surface-container-high rounded-full',
      },
      size: {
        sm: 'px-3 py-1 text-xs rounded-lg',
        md: 'px-4 py-2 text-sm rounded-xl',
        lg: 'px-6 py-3 text-sm rounded-xl',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}
