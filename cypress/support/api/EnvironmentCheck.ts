import { FailureClassifier } from "../utils/FailureClassifier";

export class EnvironmentCheck {
  static checkUrl(
    url: string,
    serviceName: string
  ): Cypress.Chainable<Cypress.Response<any>> {
    return cy
      .request({
        method: "GET",
        url,
        failOnStatusCode: false,
        log: false,
      })
      .then((response) => {
        if (
          response.status >= 200 &&
          response.status < 400
        ) {
          Cypress.log({
            name: "Environment Check",
            message: `${serviceName} disponível - HTTP ${response.status}`,
          });

          return response;
        }

        const classification =
          FailureClassifier.classify(response.status);

        throw new Error(
          `[${classification.type}] ${serviceName} respondeu HTTP ${response.status}. ${classification.message}`
        );
      });
  }
}