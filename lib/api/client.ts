const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

function getAccessToken(): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(/(?:^|;\s*)access_token=([^;]*)/)
  return match?.[1] ?? null
}

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getAccessToken()
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  if (options?.headers) {
    Object.assign(headers, options.headers)
  }

  const res = await fetch(`${API_URL}${path}`, {
    headers,
    ...options,
  })

  if (!res.ok) {
    const body = await res.text().catch(() => res.statusText)
    throw new ApiError(res.status, body)
  }

  if (res.status === 204) return undefined as T

  return res.json() as Promise<T>
}
