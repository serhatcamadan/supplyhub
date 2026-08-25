/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      loginAs(role: 'sellerAdmin' | 'buyerAdmin' | 'buyerStaff' | 'buyerAdmin2'): Chainable<void>
      resetDb(): Chainable<void>
    }
  }
}

const CREDENTIALS = {
  sellerAdmin: { email: Cypress.env('SELLER_EMAIL')       as string },
  buyerAdmin:  { email: Cypress.env('BUYER_ADMIN_EMAIL')  as string },
  buyerStaff:  { email: Cypress.env('BUYER_STAFF_EMAIL')  as string },
  buyerAdmin2: { email: Cypress.env('BUYER_ADMIN2_EMAIL') as string },
} as const

Cypress.Commands.add('loginAs', (role) => {
  cy.session(
    role,
    () => {
      const password = Cypress.env('PASSWORD') as string
      cy.visit('/tr/login')
      cy.get('[data-testid="email"]').type(CREDENTIALS[role].email)
      cy.get('[data-testid="password"]').type(password, { log: false })
      cy.get('[data-testid="submit"]').click()
      const expectedPath = role === 'sellerAdmin' ? '/seller' : '/buyer'
      cy.url().should('include', expectedPath)
    },
    {
      cacheAcrossSpecs: true,
    }
  )
})

Cypress.Commands.add('resetDb', () => {
  cy.request('POST', '/api/seed')
})

export {}
