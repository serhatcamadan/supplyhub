import type { ElementType } from 'react'

interface TableEmptyRowProps {
  icon: ElementType
  message: string
  colSpan: number
}

export function TableEmptyRow({ icon: Icon, message, colSpan }: TableEmptyRowProps) {
  return (
    <tr>
      <td colSpan={colSpan} className="py-16 text-center">
        <Icon className="block mx-auto mb-3 text-outline-variant" size={40} />
        <span className="text-sm text-on-surface-variant">{message}</span>
      </td>
    </tr>
  )
}
