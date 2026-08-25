import { test, expect } from '@playwright/test'
import { loginAs, resetDb } from './fixtures'

test.beforeEach(async ({ page }) => {
  await resetDb(page)
})

// ── Başarılı giriş ────────────────────────────────────────────────────────

test('seller admin login → /tr/seller/dashboard', async ({ page }) => {
  await loginAs(page, 'sellerAdmin')
  await expect(page).toHaveURL(/\/seller\/dashboard/)
})

test('buyer admin login → /tr/buyer/discover', async ({ page }) => {
  await loginAs(page, 'buyerAdmin')
  await expect(page).toHaveURL(/\/buyer\/discover/)
})

// ── Hatalı giriş ──────────────────────────────────────────────────────────

test('yanlış şifre → hata mesajı, yönlendirme yok', async ({ page }) => {
  await page.goto('/tr/login')
  await page.getByTestId('email').fill('ali@freshfarm.com')
  await page.getByTestId('password').fill('YanlisGiris!123')
  await page.getByTestId('submit').click()
  await expect(page.getByTestId('error-msg')).toBeVisible()
  await expect(page).toHaveURL(/\/login/)
})

// ── Oturumsuz erişim ──────────────────────────────────────────────────────

test('login olmadan /seller/dashboard → /tr/login redirect', async ({ page }) => {
  await page.goto('/tr/seller/dashboard')
  await expect(page).toHaveURL(/\/login/)
})

test('login olmadan /buyer/discover → /tr/login redirect', async ({ page }) => {
  await page.goto('/tr/buyer/discover')
  await expect(page).toHaveURL(/\/login/)
})

// ── Cross-portal erişim ───────────────────────────────────────────────────

test('buyer hesabıyla /seller/dashboard → /buyer/discover redirect', async ({ page }) => {
  await loginAs(page, 'buyerAdmin')
  await page.goto('/tr/seller/dashboard')
  await expect(page).toHaveURL(/\/buyer\/discover/)
})

test('seller hesabıyla /buyer/approvals → /seller/dashboard redirect', async ({ page }) => {
  await loginAs(page, 'sellerAdmin')
  await page.goto('/tr/buyer/approvals')
  await expect(page).toHaveURL(/\/seller\/dashboard/)
})

// ── RBAC: staff approvals erişimi ─────────────────────────────────────────

test('buyer staff /buyer/approvals → /buyer/orders redirect', async ({ page }) => {
  await loginAs(page, 'buyerStaff')
  await page.goto('/tr/buyer/approvals')
  await expect(page).toHaveURL(/\/buyer\/orders/)
})

test('buyer admin /buyer/approvals → approvals sayfası açılır', async ({ page }) => {
  await loginAs(page, 'buyerAdmin2')
  await page.goto('/tr/buyer/approvals')
  await expect(page).toHaveURL(/\/buyer\/approvals/)
})

// ── Oturum kapatma ────────────────────────────────────────────────────────

test('logout → login sayfasına yönlendirilir', async ({ page }) => {
  await loginAs(page, 'sellerAdmin')
  await page.getByTestId('profile-btn').click()
  await page.getByTestId('sign-out-btn').click()
  await expect(page).toHaveURL(/\/login/)
})
