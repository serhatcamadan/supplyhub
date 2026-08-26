import Link from 'next/link'
import { IconDotsVertical, IconEye, IconPencil } from '@tabler/icons-react'

export function ProductRowActions({ productId }: { productId: string }) {
  return (
    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <Link
        href={`/seller/products/${productId}/edit`}
        className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-md transition-colors"
        title="Edit"
      >
        <IconPencil size={20} />
      </Link>
      <button
        className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-md transition-colors"
        title="View Details"
      >
        <IconEye size={20} />
      </button>
      <button
        className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error-container/20 rounded-md transition-colors"
        title="More actions"
      >
        <IconDotsVertical size={20} />
      </button>
    </div>
  )
}
