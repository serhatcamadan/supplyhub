import { apiFetch } from './client'

export interface UserProfile {
  id: string
  email: string
  name: string
  phone: string | null
  role: string
  company_id: string
  companies: {
    name: string
    type: string
    industry: string | null
    free_shipping_threshold: number
    shipping_fee: number
  }
}

export interface UpdateCompanyPayload {
  name?: string
  industry?: string
  free_shipping_threshold?: number
  shipping_fee?: number
}

export interface CompanyResponse {
  id: string
  name: string
  type: string
  industry: string | null
  free_shipping_threshold: number
  shipping_fee: number
}

export function updateMyCompany(payload: UpdateCompanyPayload): Promise<CompanyResponse> {
  return apiFetch('/companies/my', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

export interface UpdateProfilePayload {
  name?: string
  phone?: string
  password?: string
  currentPassword?: string
}

export function getMyProfile(): Promise<UserProfile> {
  return apiFetch<UserProfile>('/users/me')
}

export function updateMyProfile(payload: UpdateProfilePayload): Promise<Omit<UserProfile, 'companies'>> {
  return apiFetch<Omit<UserProfile, 'companies'>>('/users/me', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}
