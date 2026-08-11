import { forwardRef } from 'react'
import type { SelectHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { FormError } from './form-error'

interface SelectOption {
  value: string
  label: string
}

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  icon: string
  options: SelectOption[]
  placeholder?: string
  error?: string
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ label, icon, options, placeholder, error, id, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2">
        <label htmlFor={id} className="text-xs font-semibold tracking-wider text-on-surface-variant">
          {label}
        </label>
        <div className="relative">
          <span
            className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 select-none pointer-events-none text-on-surface-variant opacity-50"
            style={{ fontSize: '20px' }}
          >
            {icon}
          </span>
          <select
            ref={ref}
            id={id}
            className={cn(
              'w-full bg-surface py-3 pl-10 pr-10 rounded-lg text-sm text-on-surface outline-none transition-all appearance-none cursor-pointer',
              error
                ? 'ring-2 ring-error/60 border border-error/40'
                : 'focus:bg-surface-container',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <span
            className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none"
            style={{ fontSize: '20px' }}
          >
            expand_more
          </span>
        </div>
        {error && <FormError message={error} />}
      </div>
    )
  }
)

FormSelect.displayName = 'FormSelect'
