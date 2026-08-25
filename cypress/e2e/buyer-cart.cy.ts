// Sepet sayfasında INITIAL_ITEMS: 2 mock ürün
// - Zeytinyağı: qty=100, unitPrice=165, originalPrice=185, tierPct=72
// - Buğday Unu: qty=20,  unitPrice=42,  originalPrice=42,  tierPct=8
//
// Hesaplar:
//   subtotal      = 100*185 + 20*42  = 18.500 + 840 = 19.340 TRY
//   volumeDiscount = (185-165)*100   = 2.000 TRY
//   shipping       = ücretsiz (19.340 > 10.000)
//   tax            = (19.340 - 2.000) * 0.20 = 3.468 TRY
//   total          = 17.340 + 3.468  = 20.808 TRY

describe('Buyer — Sepet ve Fiyat Hesaplamaları', () => {
  beforeEach(() => {
    cy.resetDb()
    cy.loginAs('buyerAdmin')
  })

  // ── Sepet içeriği ─────────────────────────────────────────────────────────

  it('sepette 2 ürün görünüyor', () => {
    cy.visit('/tr/buyer/cart')
    cy.contains('Organik Zeytinyağı').should('be.visible')
    cy.contains('Tam Buğday Unu').should('be.visible')
  })

  // ── Tier fiyat mantığı ────────────────────────────────────────────────────

  it('Zeytinyağı Tier 2 fiyatı — ₺165 görünüyor', () => {
    cy.visit('/tr/buyer/cart')
    // Tier etiketi görünüyor (Tier 2 veya %11 indirim içeren metin)
    cy.contains(/Tier 2|%11/i).should('be.visible')
    // Birim fiyat: ₺165
    cy.contains('₺165').should('be.visible')
  })

  it('Buğday Unu için promo banner görünüyor (tierPct=8 < 50)', () => {
    cy.visit('/tr/buyer/cart')
    // Promo/bulk nudge banner — component CartPromoBanner
    // "Hemen Ekle" veya bulk discount yazısı içeriyor
    cy.contains(/Hemen Ekle|Bulk|indirim/i).should('be.visible')
  })

  // ── Order Summary hesaplamaları ───────────────────────────────────────────

  it('kargo: subtotal > 10k → Ücretsiz', () => {
    cy.visit('/tr/buyer/cart')
    cy.contains(/Ücretsiz|Free/i).should('be.visible')
  })

  it('hacim indirimi ₺2.000 gösteriliyor', () => {
    cy.visit('/tr/buyer/cart')
    cy.contains('₺2.000').should('be.visible')
  })

  it('toplam tutar ₺20.808 gösteriliyor', () => {
    cy.visit('/tr/buyer/cart')
    cy.contains('₺20.808').should('be.visible')
  })

  // ── Sepetten kaldırma ─────────────────────────────────────────────────────

  it('ürünü sil → sepetten kayboluyor', () => {
    cy.visit('/tr/buyer/cart')
    // İlk ürün satırında sil butonuna tıkla
    cy.contains('Tam Buğday Unu')
      .closest('[data-testid="cart-item"]')
      .find('button[aria-label]')
      .last()
      .click()
    cy.contains('Tam Buğday Unu').should('not.exist')
  })

  // ── Checkout ──────────────────────────────────────────────────────────────

  it('"Siparişi Tamamla" → sipariş oluşur, /buyer/orders sayfasına yönlendirilir', () => {
    cy.visit('/tr/buyer/cart')
    cy.get('[data-testid="checkout"]').click()
    // Supabase'e insert yapılıyor — biraz bekle
    cy.url({ timeout: 15000 }).should('include', '/buyer/orders')
  })
})
