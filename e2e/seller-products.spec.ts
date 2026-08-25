import { test, expect } from '@playwright/test'
import { loginAs, resetDb } from './fixtures'

test.beforeEach(async ({ page }) => {
  await resetDb(page)
  await loginAs(page, 'sellerAdmin')
})

test('ürün listesi → seed ürünleri görünüyor', async ({ page }) => {
  await page.goto('/tr/seller/products')
  await expect(page.getByText('Organik Zeytinyağı')).toBeVisible()
  await expect(page.getByText('Tam Buğday Unu')).toBeVisible()
})

test('"Yeni Ürün" → /seller/products/new sayfası', async ({ page }) => {
  await page.goto('/tr/seller/products')
  await page.getByRole('link', { name: /Yeni Ürün|New Product/i }).click()
  await expect(page).toHaveURL(/\/seller\/products\/new/)
})

test('boş form kaydetmeye çalış → hata mesajı görünür', async ({ page }) => {
  await page.goto('/tr/seller/products/new')
  await page.getByTestId('save-product').click()
  await expect(page.getByTestId('product-error')).toBeVisible()
  await expect(page).toHaveURL(/\/seller\/products\/new/)
})

test('geçerli ürün bilgileriyle kaydet → listeye yönlendirilir', async ({ page }) => {
  await page.goto('/tr/seller/products/new')
  await page.locator('#product-name').fill('Test Ürünü Playwright')
  await page.locator('#category').selectOption('Yağlar')
  await page.locator('#min-qty').fill('5')
  await page.getByTestId('save-product').click()
  await expect(page).toHaveURL(/\/seller\/products$/)
})

test('kademe ekle → tier sayısı bir artar', async ({ page }) => {
  await page.goto('/tr/seller/products/new')
  await expect(page.getByTestId('tier-row')).toHaveCount(3)
  await page.getByRole('button', { name: /Kademe Ekle|Add Tier/i }).click()
  await expect(page.getByTestId('tier-row')).toHaveCount(4)
})
