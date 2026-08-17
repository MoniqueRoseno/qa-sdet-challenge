/// <reference types="cypress" />

// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })


Cypress.Commands.add(
  "login",
  (email: string, password: string) => {
    cy.visit("/login");

    cy.get('[data-qa="login-email"]')
      .should("be.visible")
      .clear()
      .type(email)
      .should("have.value", email);

    cy.get('[data-qa="login-password"]')
      .should("be.visible")
      .clear()
      .type(password, { log: false });

    cy.get('[data-qa="login-button"]')
      .should("be.visible")
      .click();

    cy.location("pathname", { timeout: 20000 })
      .should("eq", "/");

    cy.get('a[href="/logout"]', { timeout: 20000 })
      .should("be.visible");
  }
);

declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
      
    }
  }
}

export {};