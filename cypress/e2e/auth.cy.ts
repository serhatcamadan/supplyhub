describe('Auth — Giriş ve Route Koruması', () => {
  beforeEach(() => {
    cy.resetDb()
  })

  // ── Başarılı giriş ────────────────────────────────────────────────────────

  it('seller admin login → /tr/seller/dashboard', () => {
    cy.loginAs('sellerAdmin')
    cy.visit('/tr/seller/dashboard')
    cy.url().should('include', '/seller/dashboard')
  })

  it('buyer admin login → /tr/buyer/discover', () => {
    cy.loginAs('buyerAdmin')
    cy.visit('/tr/buyer/discover')
    cy.url().should('include', '/buyer/discover')
  })

  // ── Hatalı giriş ──────────────────────────────────────────────────────────

  it('yanlış şifre → hata mesajı, yönlendirme yok', () => {
    cy.visit('/tr/login')
    cy.get('[data-testid="email"]').type(Cypress.env('SELLER_EMAIL'))
    cy.get('[data-testid="password"]').type('YanlisGiris!123', { log: false })
    cy.get('[data-testid="submit"]').click()
    cy.get('[data-testid="error-msg"]').should('be.visible')
    cy.url().should('include', '/login')
  })

  // ── Oturumsuz erişim ──────────────────────────────────────────────────────

  it('login olmadan /seller/dashboard → /tr/login redirect', () => {
    cy.clearCookies()
    cy.visit('/tr/seller/dashboard')
    cy.url().should('include', '/login')
  })

  it('login olmadan /buyer/discover → /tr/login redirect', () => {
    cy.clearCookies()
    cy.visit('/tr/buyer/discover')
    cy.url().should('include', '/login')
  })

  // ── Cross-portal erişim ───────────────────────────────────────────────────

  it('buyer hesabıyla /seller/dashboard → /buyer/discover redirect', () => {
    cy.loginAs('buyerAdmin')
    cy.visit('/tr/seller/dashboard')
    cy.url().should('include', '/buyer/discover')
  })

  it('seller hesabıyla /buyer/approvals → /seller/dashboard redirect', () => {
    cy.loginAs('sellerAdmin')
    cy.visit('/tr/buyer/approvals')
    cy.url().should('include', '/seller/dashboard')
  })

  // ── RBAC: staff approvals erişimi ─────────────────────────────────────────

  it('buyer staff /buyer/approvals → /buyer/orders redirect (sadece admin)', () => {
    cy.loginAs('buyerStaff')
    cy.visit('/tr/buyer/approvals')
    cy.url().should('include', '/buyer/orders')
  })

  it('buyer admin /buyer/approvals → approvals sayfası açılır', () => {
    cy.loginAs('buyerAdmin')
    cy.visit('/tr/buyer/approvals')
    cy.url().should('include', '/buyer/approvals')
  })

  // ── Oturum kapatma ────────────────────────────────────────────────────────

  it('logout → login sayfasına yönlendirilir', () => {
    cy.loginAs('sellerAdmin')
    cy.visit('/tr/seller/dashboard')
    cy.get('[data-testid="profile-btn"]').click()
    cy.get('[data-testid="sign-out-btn"]').click()
    cy.url().should('include', '/login')
  })
})
