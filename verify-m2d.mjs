import { chromium } from '@playwright/test'
const browser = await chromium.launch()
const page = await browser.newPage()
await page.goto('http://localhost:3000/tr/login')
await page.getByLabel(/e-posta/i).fill('ayse@gunespazar.com')
await page.getByLabel(/şifre/i).fill('Demo1234!')
await page.getByRole('button', { name: /giriş/i }).click()
await page.waitForURL(/buyer\/discover/, { timeout: 15000 })

const cookies = await page.context().cookies()
const token = cookies.find(c => c.name === 'access_token')?.value
const res = await fetch('http://localhost:3001/products', { headers: { Authorization: `Bearer ${token}` } })
const products = await res.json()
const product = products.find(p => p.name === 'Çok görselli ürün') // stock 500, min_order_qty small
console.log('Product:', product.name, 'stock:', product.stock_quantity, 'min:', product.min_order_qty)

await page.goto(`http://localhost:3000/tr/buyer/discover/${product.id}`)
await page.waitForTimeout(1000)
await page.screenshot({ path: '/tmp/m2d-highstock.png' })

// try typing beyond stock (600 > 500)
const qtyInput = page.locator('input[type=number]').last()
await qtyInput.fill('600')
await qtyInput.blur()
await page.waitForTimeout(300)
console.log('Qty after typing 600 (stock=500):', await qtyInput.inputValue())

// Now add 100 to cart to test the ORIGINAL reported bug (ali freshfarm 10 stock -> ayse could add 100)
