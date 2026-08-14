import { SectionHeading } from '@/components/ui/section-heading'

const CATEGORIES = [
  'Yağlar',
  'Tahıllar',
  'Doğal Ürünler',
  'Baklagiller & Makarna',
  'Ekipman',
  'Diğer',
]

const INPUT = 'w-full px-4 py-3 bg-surface border border-outline-variant/40 rounded-lg text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all'

interface ProductBasicInfoProps {
  description: string
  onDescriptionChange: (v: string) => void
}

export function ProductBasicInfo({ description, onDescriptionChange }: ProductBasicInfoProps) {
  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm p-8 border border-outline-variant/20">
      <SectionHeading icon="info" label="Basic Information" />

      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="product-name" className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
            PRODUCT NAME <span className="text-error">*</span>
          </label>
          <input
            id="product-name"
            type="text"
            required
            placeholder="e.g. Organik Zeytinyağı (5L)"
            className={INPUT}
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="category" className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
              CATEGORY
            </label>
            <div className="relative">
              <select id="category" defaultValue="" className={`${INPUT} appearance-none`}>
                <option value="" disabled>Select Category</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
                expand_more
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="min-qty" className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
              MIN. ORDER QUANTITY
            </label>
            <input id="min-qty" type="number" min={1} placeholder="e.g. 10" className={`${INPUT} font-mono`} />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="description" className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
            DETAILED DESCRIPTION
          </label>
          <textarea
            id="description"
            rows={5}
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value.slice(0, 2000))}
            placeholder="Provide technical specifications, material details, and applications..."
            className={`${INPUT} resize-y`}
          />
          <div className="flex justify-between">
            <span className="text-[11px] text-on-surface-variant">Use markdown for formatting.</span>
            <span className="text-[11px] text-on-surface-variant">{description.length}/2000</span>
          </div>
        </div>
      </div>
    </div>
  )
}
