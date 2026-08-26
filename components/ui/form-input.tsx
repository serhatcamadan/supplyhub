import { forwardRef } from 'react'
import type { InputHTMLAttributes, ElementType } from 'react'
import { cn } from '@/lib/utils'
import { FormError } from './form-error'

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  icon?: ElementType
  error?: string
  helperText?: string
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, icon: Icon, error, helperText, id, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2">
        <label htmlFor={id} className="text-xs font-semibold tracking-wider text-on-surface-variant">
          {label}
        </label>
        <div className="relative">
          {Icon && (
            <Icon
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 select-none text-on-surface-variant opacity-50"
            />
          )}
          <input
            ref={ref}
            id={id}
            className={cn(
              'w-full bg-surface py-3 pr-4 rounded-lg text-sm text-on-surface outline-none transition-all',
              Icon ? 'pl-10' : 'pl-4',
              error
                ? 'ring-2 ring-error/60 border border-error/40'
                : 'focus:bg-surface-container',
              className
            )}
            {...props}
          />
        </div>
        {error && <FormError message={error} />}
        {helperText && !error && (
          <p className="text-[13px] leading-4.5 text-on-surface-variant/70">{helperText}</p>
        )}
      </div>
    )
  }
)

FormInput.displayName = 'FormInput'
