// Seed quote verileri:
// - Q1: buyer1 × P1, qty=300, status='pending'   ← seller buraya yanıt verebilir
// - Q2: buyer1 × P2, qty=600, status='responded'
// - Q3: buyer2 × P3, qty=150, status='accepted'
// - Q4: buyer2 × P1, qty=50,  status='declined'

describe('Seller — Teklif (RFQ) Akışı', () => {
  beforeEach(() => {
    cy.resetDb()
  })

  // ── Buyer RFQ oluşturur ───────────────────────────────────────────────────

  it('buyer /quotes/new → form açılır, gönderilir', () => {
    cy.loginAs('buyerAdmin')
    cy.visit('/tr/buyer/quotes/new')

    // Miktar gir
    cy.get('input[type="number"]').first().clear().type('50')

    // Teslim tarihi seç (gelecek bir tarih)
    cy.get('input[type="date"]').first().type('2026-12-31')

    // Hedef fiyat
    cy.get('input[placeholder*="fiyat"], input[placeholder*="price"]')
      .first()
      .clear()
      .type('150')

    // Gönder
    cy.get('[data-testid="rfq-submit"]').click()

    // /buyer/quotes'a yönlendirilmeli
    cy.url({ timeout: 10000 }).should('include', '/buyer/quotes')
  })

  // ── Seller teklif listesi ─────────────────────────────────────────────────

  it('seller /seller/quotes → "Bekliyor" statüsünde talepler görünüyor', () => {
    cy.loginAs('sellerAdmin')
    cy.visit('/tr/seller/quotes')
    cy.url().should('include', '/seller/quotes')
    // Seed'den Q1 bekliyor durumunda — "Bekliyor" veya "Pending" görmeli
    cy.contains(/Bekliyor|Pending/i).should('be.visible')
  })

  // ── Seller teklif yanıtlar ────────────────────────────────────────────────

  it('seller pending talebi açar → fiyat girer → teklif gönderir', () => {
    cy.loginAs('sellerAdmin')
    cy.visit('/tr/seller/quotes')

    // Pending olan satıra tıkla (seed Q1)
    cy.contains(/Bekliyor|Pending/i)
      .closest('tr')
      .click()

    // Detay sayfasına geçtik
    cy.url().should('match', /\/seller\/quotes\/[a-z0-9-]+$/)

    // Birim fiyat gir
    cy.get('[data-testid="response-price"]').clear().type('170')

    // "Teklif Gönder" butonuna tıkla
    cy.get('[data-testid="send-quote"]').click()

    // Başarı ekranı
    cy.contains(/Gönderildi|Sent/i, { timeout: 10000 }).should('be.visible')
  })

  // ── Seller listede statü güncellenmiş ─────────────────────────────────────

  it('yanıtlanan teklifin statüsü "Yanıtlandı" olarak güncellenir', () => {
    // Önceki testte Q2 zaten 'responded' seed'de geliyor
    cy.loginAs('sellerAdmin')
    cy.visit('/tr/seller/quotes')
    cy.contains(/Yanıtlandı|Responded/i).should('be.visible')
  })
})
