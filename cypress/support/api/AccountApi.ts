import { AccountData } from "../factories/AccountFactory";
import { DataSanitizer } from "../utils/DataSanitizer";

export class AccountApi {
  private readonly createAccountEndpoint = "/api/createAccount";
  private readonly deleteAccountEndpoint = "/api/deleteAccount";

  createAccount(
    account: AccountData
  ): Cypress.Chainable<Cypress.Response<any>> {
    const sanitizedRequest =
      DataSanitizer.sanitize(account);

    cy.log(
      `Create Account Request: ${JSON.stringify(
        sanitizedRequest
      )}`
    );

    return cy.request({
      method: "POST",
      url: this.createAccountEndpoint,
      form: true,
      body: account,
      failOnStatusCode: false,
      log: false,
    }).then((response) => {
      const sanitizedResponse =
        DataSanitizer.sanitize(response.body);

      Cypress.log({
         name: "Create Account Response",
        message: JSON.stringify(sanitizedResponse),
      });


      return response;
    });
  }

  deleteAccount(
    email: string,
    password: string
  ): Cypress.Chainable<Cypress.Response<any>> {
    const sanitizedRequest =
      DataSanitizer.sanitize({
        email,
        password,
      });

    cy.log(
      `Delete Account Request: ${JSON.stringify(
        sanitizedRequest
      )}`
    );

    return cy.request({
      method: "DELETE",
      url: this.deleteAccountEndpoint,
      form: true,
      body: {
        email,
        password,
      },
      failOnStatusCode: false,
      log: false,
    }).then((response) => {
      const sanitizedResponse =
        DataSanitizer.sanitize(response.body);

      Cypress.log({
       name: "Create Account Response",
       message: JSON.stringify(sanitizedResponse),
      });


      return response;
    });
  }
}

export const accountApi = new AccountApi();