import Link from 'next/link'

export function ProductRowActions({ productId }: { productId: string }) {
  return (
    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <Link
        href={`/seller/products/${productId}/edit`}
        className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-md transition-colors"
        title="Edit"
      >
        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>edit</span>
      </Link>
      <button
        className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-md transition-colors"
        title="View Details"
      >
        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>visibility</span>
      </button>
      <button
        className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error-container/20 rounded-md transition-colors"
        title="More actions"
      >
        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>more_vert</span>
      </button>
    </div>
  )
}
