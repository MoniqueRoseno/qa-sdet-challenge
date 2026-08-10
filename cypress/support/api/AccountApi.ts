import { AccountData } from "../factories/AccountFactory";

export class AccountApi {
  private readonly createAccountEndpoint = "/api/createAccount";
  private readonly deleteAccountEndpoint = "/api/deleteAccount";

  createAccount(account: AccountData): Cypress.Chainable<Cypress.Response<any>> {
    return cy.request({
      method: "POST",
      url: this.createAccountEndpoint,
      form: true,
      body: account,
      failOnStatusCode: false,
    });
  }

  deleteAccount(
    email: string,
    password: string
  ): Cypress.Chainable<Cypress.Response<any>> {
    return cy.request({
      method: "DELETE",
      url: this.deleteAccountEndpoint,
      form: true,
      body: {
        email,
        password,
      },
      failOnStatusCode: false,
    });
  }
}

export const accountApi = new AccountApi();