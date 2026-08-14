interface TableEmptyRowProps {
  icon: string
  message: string
  colSpan: number
}

export function TableEmptyRow({ icon, message, colSpan }: TableEmptyRowProps) {
  return (
    <tr>
      <td colSpan={colSpan} className="py-16 text-center">
        <span
          className="material-symbols-outlined block mx-auto mb-3 text-outline-variant"
          style={{ fontSize: '40px' }}
        >
          {icon}
        </span>
        <span className="text-sm text-on-surface-variant">{message}</span>
      </td>
    </tr>
  )
}
