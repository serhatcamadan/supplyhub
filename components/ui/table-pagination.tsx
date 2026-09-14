import { cn } from '@/lib/utils'
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'

interface TablePaginationProps {
  label: string
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function TablePagination({ label, page, totalPages, onPageChange }: TablePaginationProps) {
  const safeTotalPages = Math.max(1, totalPages)
  return (
    <div className="px-6 py-4 border-t border-outline-variant/30 flex items-center justify-between bg-surface-container-lowest">
      <span className="text-xs text-on-surface-variant">{label}</span>
      {safeTotalPages > 1 && (
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page <= 1}
            className="w-8 h-8 flex items-center justify-center rounded-md text-on-surface-variant hover:bg-surface-container-high transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
          >
            <IconChevronLeft size={20} />
          </button>
          {Array.from({ length: safeTotalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => onPageChange(n)}
              className={cn(
                'w-8 h-8 flex items-center justify-center rounded-md text-xs font-semibold transition-colors',
                n === page ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant hover:bg-surface-container-high'
              )}
            >
              {n}
            </button>
          ))}
          <button
            type="button"
            onClick={() => onPageChange(Math.min(safeTotalPages, page + 1))}
            disabled={page >= safeTotalPages}
            className="w-8 h-8 flex items-center justify-center rounded-md text-on-surface-variant hover:bg-surface-container-high transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
          >
            <IconChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  )
}
