export class TrelloApi {
  private readonly baseUrl = "https://api.trello.com/1";

  getBoardActions(
    boardId: string,
    apiKey: string,
    token: string
  ): Cypress.Chainable<Cypress.Response<any>> {
    return cy.request({
      method: "GET",
      url: `${this.baseUrl}/boards/${boardId}/actions`,
      qs: {
        key: apiKey,
        token: token,
      },
      failOnStatusCode: false,
    });
  }
}

export const trelloApi = new TrelloApi();