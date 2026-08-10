export class LoginPage {
  private emailInput = '[data-qa="login-email"]';
  private passwordInput = '[data-qa="login-password"]';
  private loginButton = '[data-qa="login-button"]';
  private logoutLink = 'a[href="/logout"]';

  visit(): void {
    cy.visit("/login");
  }

  fillEmail(email: string): void {
    cy.get(this.emailInput).clear().type(email);
  }

  fillPassword(password: string): void {
    cy.get(this.passwordInput).clear().type(password, { log: false });
  }

  submit(): void {
    cy.get(this.loginButton)
        .should("be.visible")
        .and("be.enabled")
        .click();
  }

  login(email: string, password: string): void {
    this.fillEmail(email);
    this.fillPassword(password);
    this.submit();
  }

  validateLoginError(): void {
    cy.contains("Your email or password is incorrect!")
      .should("be.visible");
  }

  logout(): void {
  cy.get(this.logoutLink)
    .should("be.visible")
    .click();
}

  validateSuccessfulLogin(email: string): void {
  cy.location("pathname", { timeout: 10000 })
    .should("eq", "/");

  cy.get('a[href="/logout"]', { timeout: 20000 })
    .should("be.visible");

  cy.contains("a", "Logged in as", { timeout: 10000 })
    .should("be.visible")
    .and("contain", email);
}

  validateUnauthenticated(): void {
  cy.location("pathname").should("eq", "/login");

  cy.get(this.logoutLink)
    .should("not.exist");
}

  validateLogout(): void {
  cy.url().should("include", "/login");
  cy.get(this.logoutLink).should("not.exist");
}
}

export const loginPage = new LoginPage();