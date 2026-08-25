describe('Seller — Ürün Yönetimi', () => {
  beforeEach(() => {
    cy.resetDb()
    cy.loginAs('sellerAdmin')
  })

  // ── Ürün listesi ──────────────────────────────────────────────────────────

  it('/seller/products → seed ürünleri görünüyor', () => {
    cy.visit('/tr/seller/products')
    cy.url().should('include', '/seller/products')
    // Seed'den 4 ürün var (3 active, 1 draft) — en azından birini görmeli
    cy.contains('Organik Zeytinyağı').should('be.visible')
    cy.contains('Tam Buğday Unu').should('be.visible')
  })

  // ── Yeni ürün formu ───────────────────────────────────────────────────────

  it('"Yeni Ürün" butonu → /seller/products/new sayfası', () => {
    cy.visit('/tr/seller/products')
    cy.contains('a', /Yeni Ürün|New Product/i).click()
    cy.url().should('include', '/seller/products/new')
  })

  it('boş form kaydetmeye çalış → hata mesajı görünür', () => {
    cy.visit('/tr/seller/products/new')
    // Name ve category boş, sadece save'e tıkla
    cy.get('[data-testid="save-product"]').click()
    // Validation hatası gösterilmeli
    cy.get('.text-error').should('be.visible')
    // Sayfa /new'de kalmalı
    cy.url().should('include', '/seller/products/new')
  })

  it('geçerli ürün bilgileriyle kaydet → listeye yönlendirilir', () => {
    cy.visit('/tr/seller/products/new')

    // Ad
    cy.get('#product-name').type('Test Ürünü Cypress')

    // Kategori
    cy.get('#category').select('Yağlar')

    // Min sipariş adedi
    cy.get('#min-qty').clear().type('5')

    // Kaydet
    cy.get('[data-testid="save-product"]').click()

    // Başarılı kayıt → products listesine döner
    cy.url().should('include', '/seller/products')
    cy.url().should('not.include', '/new')
  })

  // ── Tier ekleme ───────────────────────────────────────────────────────────

  it('kademe ekle → yeni tier satırı görünür', () => {
    cy.visit('/tr/seller/products/new')
    // İlk tier zaten var. "Kademe Ekle" butonuna tıkla.
    cy.contains(/Kademe Ekle|Add Tier/i).click()
    // Tier tablosunda 2 satır olmalı (başlık hariç)
    cy.get('table tbody tr').should('have.length', 2)
  })
})
