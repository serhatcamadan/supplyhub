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

// Backend error text is not localized — never render err.message directly to the user.
// Call sites should switch on this status and pick a translated (t()) string instead.
export function apiErrorStatus(err: unknown): number | undefined {
  return err instanceof ApiError ? err.status : undefined
}

// Also used by the socket client (lib/sockets/auction-socket.ts) to authenticate the handshake.
export function getAccessToken(): string | null {
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
    const text = await res.text().catch(() => '')
    let message = res.statusText || `Request failed with status ${res.status}`
    try {
      const parsed = JSON.parse(text) as { message?: string | string[] }
      if (typeof parsed.message === 'string') message = parsed.message
      else if (Array.isArray(parsed.message) && typeof parsed.message[0] === 'string') message = parsed.message[0]
    } catch {
      // Non-JSON error body — keep the statusText fallback above.
    }
    throw new ApiError(res.status, message)
  }

  if (res.status === 204) return undefined as T

  return res.json() as Promise<T>
}
