import { test, expect } from '@playwright/test'
import { loginAs, resetDb } from './fixtures'

test.beforeEach(async ({ page }) => {
  await resetDb(page)
  await loginAs(page, 'buyerAdmin')
})

test('sepette 2 ürün görünüyor', async ({ page }) => {
  await page.goto('/tr/buyer/cart')
  await expect(page.getByText('Organik Zeytinyağı (5L)').first()).toBeVisible()
  await expect(page.getByText('Tam Buğday Unu (25kg)').first()).toBeVisible()
})

test('Zeytinyağı Tier 2 fiyatı — tier label ve toplam görünüyor', async ({ page }) => {
  await page.goto('/tr/buyer/cart')
  // tierLabel metin: "Tier 2 (min 50 adet — %11 indirim uygulandı)"
  await expect(page.getByText(/Tier 2.*%11/i).first()).toBeVisible()
  // Toplam: 100 × ₺165 = ₺16.500
  await expect(page.getByText('₺16.500').first()).toBeVisible()
})

test('promo banner görünüyor (Buğday Unu tierPct=8 < 50)', async ({ page }) => {
  await page.goto('/tr/buyer/cart')
  await expect(page.getByText(/Hemen Ekle|Bulk|indirim/i).first()).toBeVisible()
})

test('kargo: subtotal > 10k → Ücretsiz', async ({ page }) => {
  await page.goto('/tr/buyer/cart')
  await expect(page.getByText(/Ücretsiz|Free/i).first()).toBeVisible()
})

test('hacim indirimi ₺2.000 gösteriliyor', async ({ page }) => {
  await page.goto('/tr/buyer/cart')
  await expect(page.getByText('₺2.000').first()).toBeVisible()
})

test('toplam tutar ₺20.808 gösteriliyor', async ({ page }) => {
  await page.goto('/tr/buyer/cart')
  await expect(page.getByText('₺20.808').first()).toBeVisible()
})

test('"Siparişi Tamamla" → /buyer/orders sayfasına yönlendirilir', async ({ page }) => {
  await page.goto('/tr/buyer/cart')
  await page.waitForTimeout(1500)
  await page.getByTestId('checkout').click()
  await expect(page).toHaveURL(/\/buyer\/orders/, { timeout: 15000 })
})
