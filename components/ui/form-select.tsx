import { forwardRef } from 'react'
import type { SelectHTMLAttributes, ElementType } from 'react'
import { cn } from '@/lib/utils'
import { FormError } from './form-error'
import { IconChevronDown } from '@tabler/icons-react'

interface SelectOption {
  value: string
  label: string
}

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  icon?: ElementType
  options: SelectOption[]
  placeholder?: string
  error?: string
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ label, icon: Icon, options, placeholder, error, id, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2">
        <label htmlFor={id} className="text-xs font-semibold tracking-wider text-on-surface-variant">
          {label}
        </label>
        <div className="relative">
          {Icon && (
            <Icon
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 select-none pointer-events-none text-on-surface-variant opacity-50"
            />
          )}
          <select
            ref={ref}
            id={id}
            className={cn(
              'w-full bg-surface py-3 pr-10 rounded-lg text-sm text-on-surface outline-none transition-all appearance-none cursor-pointer',
              Icon ? 'pl-10' : 'pl-4',
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
          <IconChevronDown size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
        </div>
        {error && <FormError message={error} />}
      </div>
    )
  }
)

FormSelect.displayName = 'FormSelect'
