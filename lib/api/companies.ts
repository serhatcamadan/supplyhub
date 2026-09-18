import { apiFetch } from './client'
import type { CompanyResponse } from './users'

export function getCompany(id: string): Promise<CompanyResponse & { delivery_rate: number | null }> {
  return apiFetch(`/companies/${id}`)
}
