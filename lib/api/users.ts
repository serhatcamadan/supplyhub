import { apiFetch } from './client'

export interface UserProfile {
  id: string
  email: string
  name: string
  phone: string | null
  role: string
  company_id: string
  companies: { name: string; type: string }
}

export interface UpdateProfilePayload {
  name?: string
  phone?: string
  password?: string
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
