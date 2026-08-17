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


Cypress.Commands.add("login",
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
      .type(password, { log: false })
      .invoke("val")
      .should("not.be.empty");

    cy.get('[data-qa="login-button"]')
      .should("be.visible")
      .click();

    cy.location("pathname", { timeout: 10000 }).then((pathname) => {
      if (pathname === "/login") {
        cy.contains("Your email or password is incorrect!")
          .should("be.visible");

        throw new Error(
          "Login não foi aceito no ambiente de execução. Verifique TEST_USER_EMAIL e TEST_USER_PASSWORD."
        );
      }

      expect(pathname).to.eq("/");
    });

    cy.get('a[href="/logout"]', { timeout: 10000 })
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