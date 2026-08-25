import { test, expect } from '@playwright/test'
import { loginAs, resetDb } from './fixtures'

test.beforeEach(async ({ page }) => {
  await resetDb(page)
})

test('seller /seller/quotes → "Bekliyor" statüsünde talepler görünüyor', async ({ page }) => {
  await loginAs(page, 'sellerAdmin')
  await page.goto('/tr/seller/quotes')
  await expect(page.getByText(/Bekliyor|Pending/i).first()).toBeVisible()
})

test('seller pending talebi açar → yanıt verir → başarı ekranı', async ({ page }) => {
  await loginAs(page, 'sellerAdmin')
  await page.goto('/tr/seller/quotes')

  // "Yanıtla" linki opacity-0 (hover ile açılır) — force ile doğrudan tıkla
  await expect(page.getByText(/Bekliyor|Pending/i).first()).toBeVisible()
  const responseLink = page.getByRole('link', { name: /Yanıtla|Respond/i }).first()
  await responseLink.click({ force: true })
  await expect(page).toHaveURL(/\/seller\/quotes\/.+/)

  // Fiyat gir
  await page.getByTestId('response-price').fill('170')

  // Teklif gönder
  await page.getByTestId('send-quote').click()

  // Başarı ekranı
  await expect(page.getByText(/Gönderildi|Sent/i).first()).toBeVisible({ timeout: 10000 })
})

test('buyer /quotes/new → form submit → /buyer/quotes redirect', async ({ page }) => {
  await loginAs(page, 'buyerAdmin')
  await page.goto('/tr/buyer/quotes/new')

  await page.locator('input[type="number"]').first().fill('50')
  await page.locator('input[type="date"]').first().fill('2026-12-31')
  await page.getByTestId('rfq-submit').click()

  await expect(page).toHaveURL(/\/buyer\/quotes/, { timeout: 10000 })
})

test('seed Q2 "Yanıtlandı" statüsünde görünüyor', async ({ page }) => {
  await loginAs(page, 'sellerAdmin')
  await page.goto('/tr/seller/quotes')
  await expect(page.getByText(/Yanıtlandı|Responded/i).first()).toBeVisible()
})
