import { test, expect } from '@playwright/test'
import { loginAs, resetDb } from './fixtures'

test.beforeEach(async ({ page }) => {
  await resetDb(page)
})

test('buyer admin O3 onay bekliyor — ₺58.000 görünüyor', async ({ page }) => {
  await loginAs(page, 'buyerAdmin2')
  await page.goto('/tr/buyer/approvals')
  await expect(page.getByText('₺58.000').first()).toBeVisible({ timeout: 15000 })
})

test('"Onayla" butonu görünüyor', async ({ page }) => {
  await loginAs(page, 'buyerAdmin2')
  await page.goto('/tr/buyer/approvals')
  await expect(page.getByTestId('approve-btn').first()).toBeVisible({ timeout: 15000 })
})

test('buyer staff /buyer/approvals → /buyer/orders redirect', async ({ page }) => {
  await loginAs(page, 'buyerStaff')
  await page.goto('/tr/buyer/approvals')
  await expect(page).toHaveURL(/\/buyer\/orders/, { timeout: 10000 })
})

test('"Onayla" tıkla → kart listeden kalkar', async ({ page }) => {
  await loginAs(page, 'buyerAdmin2')
  await page.goto('/tr/buyer/approvals')
  await expect(page.getByTestId('approve-btn').first()).toBeVisible({ timeout: 15000 })
  const before = await page.getByTestId('approve-btn').count()
  await page.getByTestId('approve-btn').first().click()
  // Onaylanan kartın listeden kalktığını doğrula
  await expect(page.getByTestId('approve-btn')).toHaveCount(before - 1, { timeout: 10000 })
})

test('ayse (buyer1) /approvals → empty state (bekleyen onay yok)', async ({ page }) => {
  await loginAs(page, 'buyerAdmin')
  await page.goto('/tr/buyer/approvals')
  await expect(page.getByText('Hepsi tamamlandı!').first()).toBeVisible({ timeout: 15000 })
})
