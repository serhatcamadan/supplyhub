import { type Page } from '@playwright/test'

const CREDS = {
  sellerAdmin: { email: process.env.SELLER_EMAIL       ?? 'ali@freshfarm.com',    password: process.env.TEST_PASSWORD ?? 'Demo1234!' },
  buyerAdmin:  { email: process.env.BUYER_ADMIN_EMAIL  ?? 'ayse@gunespazar.com',  password: process.env.TEST_PASSWORD ?? 'Demo1234!' },
  buyerStaff:  { email: process.env.BUYER_STAFF_EMAIL  ?? 'fatma@gunespazar.com', password: process.env.TEST_PASSWORD ?? 'Demo1234!' },
  buyerAdmin2: { email: process.env.BUYER_ADMIN2_EMAIL ?? 'kemal@lezzet.com',     password: process.env.TEST_PASSWORD ?? 'Demo1234!' },
}

export type Role = keyof typeof CREDS

export async function loginAs(page: Page, role: Role) {
  const { email, password } = CREDS[role]
  await page.goto('/tr/login')
  await page.getByTestId('email').fill(email)
  await page.getByTestId('password').fill(password)
  await page.getByTestId('submit').click()
  const dest = role === 'sellerAdmin' ? '/seller' : '/buyer'
  await page.waitForURL(`**${dest}/**`)
  await page.waitForLoadState('load')
}

export async function resetDb(page: Page) {
  await page.request.post('/api/seed')
  await page.request.post('/api/test-reset')
}

export { expect } from '@playwright/test'
