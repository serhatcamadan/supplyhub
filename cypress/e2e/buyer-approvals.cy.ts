// Seed onay verileri:
// - O3: buyer2 (Lezzet Restoranları / kemal@lezzet.com), total=58.000, needs_approval=true, approved_by=null
//        → Kemal'ın approvals sayfasında görünür
// - O2: buyer1 (Güneş Market), needs_approval=true, approved_by=uBuyer1Admin
//        → Zaten onaylanmış, artık approvals'da görünmez

describe('Buyer — Onay Akışı', () => {
  beforeEach(() => {
    cy.resetDb()
  })

  // ── Stat kartları ─────────────────────────────────────────────────────────

  it('buyer admin /buyer/approvals → onay bekleyen sipariş görünüyor', () => {
    cy.loginAs('buyerAdmin2')   // kemal@lezzet.com — O3 onay bekliyor
    cy.visit('/tr/buyer/approvals')
    cy.url().should('include', '/buyer/approvals')
    // O3: total = ₺58.000
    cy.contains('₺58.000').should('be.visible')
  })

  it('buyer admin /buyer/approvals → "Onayla" butonu görünüyor', () => {
    cy.loginAs('buyerAdmin2')
    cy.visit('/tr/buyer/approvals')
    cy.get('[data-testid="approve-btn"]').should('be.visible')
  })

  // ── RBAC: staff erişimi ───────────────────────────────────────────────────

  it('buyer staff /buyer/approvals → /buyer/orders redirect', () => {
    cy.loginAs('buyerStaff')
    cy.visit('/tr/buyer/approvals')
    cy.url().should('include', '/buyer/orders')
    cy.url().should('not.include', '/approvals')
  })

  // ── Onaylama akışı ────────────────────────────────────────────────────────

  it('admin "Onayla" → sipariş onaylanır, kart listeden kalkar', () => {
    cy.loginAs('buyerAdmin2')
    cy.visit('/tr/buyer/approvals')

    // O3 kart görünüyor
    cy.get('[data-testid="approve-btn"]').should('have.length.gte', 1)

    // Onayla
    cy.get('[data-testid="approve-btn"]').first().click()

    // Kart listeden kaybolmalı (veya sayfa boş state göstermeli)
    cy.get('[data-testid="approve-btn"]', { timeout: 10000 }).should('not.exist')
  })

  // ── Başka bir buyer admin kendi siparişini görmez ─────────────────────────

  it('ayse (buyer1 admin) /approvals → bekleyen onay yok (empty state)', () => {
    cy.loginAs('buyerAdmin')   // ayse@gunespazar.com — buyer1, hiç pending yok
    cy.visit('/tr/buyer/approvals')
    // Empty state mesajı — "Onay bekleyen sipariş yok." veya "All caught up!"
    cy.contains(/Onay bekleyen|All caught up/i).should('be.visible')
  })
})
