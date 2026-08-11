export function FormError({ message }: { message: string }) {
  return (
    <p role="alert" className="text-xs font-medium text-error leading-snug">
      {message}
    </p>
  )
}
