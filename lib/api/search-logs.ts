import { apiFetch } from './client'

// Client-side — buyer discover sayfasındaki arama kutusundan debounce ile çağrılır.
export function logSearchKeyword(keyword: string): Promise<void> {
  return apiFetch<void>('/search-logs', {
    method: 'POST',
    body: JSON.stringify({ keyword }),
  })
}
