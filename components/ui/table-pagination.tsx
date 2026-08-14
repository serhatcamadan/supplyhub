interface TablePaginationProps {
  label: string
}

export function TablePagination({ label }: TablePaginationProps) {
  return (
    <div className="px-6 py-4 border-t border-outline-variant/30 flex items-center justify-between bg-surface-container-lowest">
      <span className="text-xs text-on-surface-variant">{label}</span>
      <div className="flex items-center gap-1">
        <button
          disabled
          className="p-1 text-on-surface-variant opacity-50 cursor-not-allowed rounded-md"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>chevron_left</span>
        </button>
        <button className="w-8 h-8 flex items-center justify-center text-xs font-semibold bg-primary-container text-on-primary-container rounded-md">
          1
        </button>
        <button className="p-1 text-on-surface-variant rounded-md hover:bg-surface-container-high transition-colors">
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>chevron_right</span>
        </button>
      </div>
    </div>
  )
}
