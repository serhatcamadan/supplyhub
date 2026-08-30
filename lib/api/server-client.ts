import { cookies } from 'next/headers'

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

export async function serverApiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value

  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  if (options?.headers) Object.assign(headers, options.headers)

  const res = await fetch(`${API_URL}${path}`, { headers, ...options })

  if (!res.ok) {
    const body = await res.text().catch(() => res.statusText)
    throw new ApiError(res.status, body)
  }

  return res.json() as Promise<T>
}
