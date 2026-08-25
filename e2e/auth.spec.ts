import { test, expect } from '@playwright/test'
import { loginAs, resetDb } from './fixtures'

test.beforeEach(async ({ page }) => {
  await resetDb(page)
})

test('seller admin login → /tr/seller/dashboard', async ({ page }) => {
  await loginAs(page, 'sellerAdmin')
  await expect(page).toHaveURL(/\/seller\//)
})

test('buyer admin login → /tr/buyer/discover', async ({ page }) => {
  await loginAs(page, 'buyerAdmin')
  await expect(page).toHaveURL(/\/buyer\//)
})

test('yanlış şifre → hata mesajı, yönlendirme yok', async ({ page }) => {
  await page.goto('/tr/login')
  await page.getByTestId('email').fill('ali@freshfarm.com')
  await page.getByTestId('password').fill('WrongPass!')
  await page.getByTestId('submit').click()
  await expect(page.getByTestId('error-msg')).toBeVisible({ timeout: 10000 })
  await expect(page).toHaveURL(/\/login/)
})

test('login olmadan /seller/dashboard → /tr/login redirect', async ({ page }) => {
  await page.goto('/tr/seller/dashboard')
  await expect(page).toHaveURL(/\/login/, { timeout: 10000 })
})

test('login olmadan /buyer/discover → /tr/login redirect', async ({ page }) => {
  await page.goto('/tr/buyer/discover')
  await expect(page).toHaveURL(/\/login/, { timeout: 10000 })
})

test('buyer hesabıyla /seller/dashboard → /buyer/discover redirect', async ({ page }) => {
  await loginAs(page, 'buyerAdmin')
  await page.goto('/tr/seller/dashboard')
  await expect(page).toHaveURL(/\/buyer\//, { timeout: 10000 })
})

test('seller hesabıyla /buyer/approvals → /seller/dashboard redirect', async ({ page }) => {
  await loginAs(page, 'sellerAdmin')
  await page.goto('/tr/buyer/approvals')
  await expect(page).toHaveURL(/\/seller\//, { timeout: 10000 })
})

test('buyer staff /buyer/approvals → /buyer/orders redirect', async ({ page }) => {
  await loginAs(page, 'buyerStaff')
  await page.goto('/tr/buyer/approvals')
  await expect(page).toHaveURL(/\/buyer\/orders/, { timeout: 10000 })
})

test('buyer admin /buyer/approvals → approvals sayfası açılır', async ({ page }) => {
  await loginAs(page, 'buyerAdmin')
  await page.goto('/tr/buyer/approvals')
  await expect(page).toHaveURL(/\/buyer\/approvals/)
})

test('logout → login sayfasına yönlendirilir', async ({ page }) => {
  await loginAs(page, 'sellerAdmin')
  await page.getByTestId('profile-btn').click()
  await page.getByTestId('sign-out-btn').click()
  await expect(page).toHaveURL(/\/login/, { timeout: 10000 })
})
