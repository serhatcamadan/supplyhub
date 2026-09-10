import { test, expect } from '@playwright/test'
import { loginAs, resetDb } from './fixtures'

const CART_SEED = [
  {
    productId: 'prod-1',
    sellerId: 'seed-seller',
    name: 'Organik Zeytinyağı (5L)',
    imageUrl: null,
    supplierName: 'FreshFarm Gıda',
    qty: 100,
    minQty: 10,
    priceTiers: [
      { min_qty: 10, max_qty: 49,  price: 185 },
      { min_qty: 50, max_qty: 199, price: 165 },
      { min_qty: 200, max_qty: null, price: 145 },
    ],
  },
  {
    productId: 'prod-2',
    sellerId: 'seed-seller',
    name: 'Tam Buğday Unu (25kg)',
    imageUrl: null,
    supplierName: 'FreshFarm Gıda',
    qty: 20,
    minQty: 20,
    priceTiers: [
      { min_qty: 20,  max_qty: 99,  price: 42 },
      { min_qty: 100, max_qty: 499, price: 38 },
      { min_qty: 500, max_qty: null, price: 34 },
    ],
  },
]

test.beforeEach(async ({ page }) => {
  await resetDb(page)
  await loginAs(page, 'buyerAdmin')
  await page.evaluate((data) => {
    localStorage.setItem('supplyhub_cart', JSON.stringify(data))
  }, CART_SEED)
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
