import { forwardRef, useState } from 'react'
import type { InputHTMLAttributes, ElementType } from 'react'
import { IconEye, IconEyeOff } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { FormError } from './form-error'

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  icon?: ElementType
  error?: string
  helperText?: string
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, icon: Icon, error, helperText, id, className, type, ...props }, ref) => {
    const isPassword = type === 'password'
    const [showPassword, setShowPassword] = useState(false)

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
            type={isPassword ? (showPassword ? 'text' : 'password') : type}
            className={cn(
              'w-full bg-surface py-3 rounded-lg text-sm text-on-surface outline-none transition-all',
              Icon ? 'pl-10' : 'pl-4',
              isPassword ? 'pr-10' : 'pr-4',
              error
                ? 'ring-2 ring-error/60 border border-error/40'
                : 'focus:bg-surface-container',
              className
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              tabIndex={-1}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
            </button>
          )}
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
