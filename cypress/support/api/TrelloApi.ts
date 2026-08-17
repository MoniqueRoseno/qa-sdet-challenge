import { DataSanitizer } from "../utils/DataSanitizer";
import { FailureClassifier } from "../utils/FailureClassifier";

export class TrelloApi {
  private readonly baseUrl = "https://api.trello.com/1";

  getBoardActions(
    boardId: string,
    apiKey: string,
    token: string
  ): Cypress.Chainable<Cypress.Response<any>> {
    const sanitizedRequest = DataSanitizer.sanitize({
      boardId,
      apiKey,
      token,
    });

    Cypress.log({
      name: "Trello Request",
      message: JSON.stringify(sanitizedRequest),
    });

    return cy.request({
      method: "GET",
      url: `${this.baseUrl}/boards/${boardId}/actions`,
      qs: {
        key: apiKey,
        token,
      },
      failOnStatusCode: false,
      log: false,
    }).then((response) => {
      const sanitizedResponse =
        DataSanitizer.sanitize(response.body);

      Cypress.log({
        name: "Trello Response",
        message: JSON.stringify(sanitizedResponse),
      });

      return response;
    });
  }



  validateAvailability(
  response: Cypress.Response<any>
): void {
  if (response.status >= 200 && response.status < 300) {
    Cypress.log({
      name: "Environment Check",
      message: `Trello disponível - HTTP ${response.status}`,
    });

    return;
  }

  const classification =
    FailureClassifier.classify(response.status);

  throw new Error(
    `[${classification.type}] Trello respondeu HTTP ${response.status}. ${classification.message}`
  );
}
}



export const trelloApi = new TrelloApi();