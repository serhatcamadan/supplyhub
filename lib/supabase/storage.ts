export async function uploadProductImage(productId: string, file: File): Promise<string> {
  const form = new FormData()
  form.append('file', file)
  form.append('productId', productId)

  const res = await fetch('/api/products/upload-image', { method: 'POST', body: form })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error((body as { error?: string }).error ?? 'Upload failed')
  }
  const { url } = (await res.json()) as { url: string }
  return url
}
