import type { User } from '@/types'

export const users: User[] = [
  {
    id: 'user-seller-admin-1',
    company_id: 'company-seller-1',
    email: 'ali@freshfarm.com',
    role: 'admin',
    name: 'Ali Yılmaz',
  },
  {
    id: 'user-seller-staff-1',
    company_id: 'company-seller-1',
    email: 'mehmet@freshfarm.com',
    role: 'staff',
    name: 'Mehmet Kaya',
  },
  {
    id: 'user-buyer-admin-1',
    company_id: 'company-buyer-1',
    email: 'ayse@gunespazar.com',
    role: 'admin',
    name: 'Ayşe Demir',
  },
  {
    id: 'user-buyer-staff-1',
    company_id: 'company-buyer-1',
    email: 'fatma@gunespazar.com',
    role: 'staff',
    name: 'Fatma Çelik',
  },
  {
    id: 'user-buyer-admin-2',
    company_id: 'company-buyer-2',
    email: 'kemal@lezzet.com',
    role: 'admin',
    name: 'Kemal Arslan',
  },
]

export const MOCK_SELLER_USER = users[0]
export const MOCK_BUYER_ADMIN = users[2]
export const MOCK_BUYER_STAFF = users[3]
