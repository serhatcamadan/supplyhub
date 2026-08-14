import { cn } from '@/lib/utils'

interface CategoryChipsProps {
  categories: string[]
  selected: string
  onSelect: (category: string) => void
}

export function CategoryChips({ categories, selected, onSelect }: CategoryChipsProps) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={cn(
            'whitespace-nowrap px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all hover:-translate-y-0.5',
            selected === cat
              ? 'bg-primary text-on-primary shadow-sm'
              : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
          )}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}
