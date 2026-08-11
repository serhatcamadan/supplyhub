'use client'

interface ProductControlsProps {
  search: string
  onSearch: (value: string) => void
  totalCount: number
  filteredCount: number
}

export function ProductControls({
  search,
  onSearch,
  totalCount,
  filteredCount,
}: ProductControlsProps) {
  return (
    <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
      <div className="flex flex-1 gap-3 w-full md:w-auto">
        <div className="relative flex-1 max-w-md group">
          <span
            className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors"
            style={{ fontSize: '20px' }}
          >
            search
          </span>
          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-surface-container border border-outline-variant rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            placeholder="Search by name, SKU, or category..."
            type="text"
          />
        </div>

        <button className="bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 border border-outline-variant shrink-0">
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>filter_list</span>
          Filters
        </button>

        <button className="bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-outline-variant shrink-0">
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>category</span>
          Category: All
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_drop_down</span>
        </button>
      </div>

      <div className="flex items-center gap-2 w-full md:w-auto justify-end">
        <span className="text-xs text-on-surface-variant mr-2">
          Showing {filteredCount} of {totalCount} products
        </span>
        <button className="p-2 hover:bg-surface-container rounded-lg transition-colors text-on-surface-variant">
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>view_list</span>
        </button>
        <button className="p-2 hover:bg-surface-container rounded-lg transition-colors text-on-surface-variant">
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>grid_view</span>
        </button>
      </div>
    </div>
  )
}
