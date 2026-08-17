import {
  Given,
  When,
  Then,
} from "@badeball/cypress-cucumber-preprocessor";

import { trelloApi } from "../../support/api/TrelloApi";
import trelloActionsSchema from "../../schemas/trello-actions.schema.json";
import { SchemaValidator } from "../../support/validators/SchemaValidator";

let response: Cypress.Response<any>;

let boardId: string;
let apiKey: string;
let token: string;

Given("que possuo credenciais válidas para acessar o Trello",() => {
    cy.env(
      ["trelloBoardId", "trelloApiKey", "trelloToken"],
      { log: false }
    ).then((env) => {
      boardId = env.trelloBoardId;
      apiKey = env.trelloApiKey;
      token = env.trelloToken;

      expect(
        boardId,
        "TRELLO_BOARD_ID deve estar configurado"
      )
        .to.be.a("string")
        .and.not.be.empty;

      expect(
        apiKey,
        "TRELLO_API_KEY deve estar configurada"
      )
        .to.be.a("string")
        .and.not.be.empty;

      expect(
        token,
        "TRELLO_TOKEN deve estar configurado"
      )
        .to.be.a("string")
        .and.not.be.empty;
    });
  }
);

When("consulto as ações do board", () => {
  trelloApi
    .getBoardActions(boardId, apiKey, token)
    .then((apiResponse) => {
      trelloApi.validateAvailability(apiResponse);

      response = apiResponse;
    });
});

Then("a API do Trello deve retornar sucesso", () => {
  expect(response.status).to.eq(200);
});

Then("deve retornar uma lista de ações", () => {
  SchemaValidator.validate(
    trelloActionsSchema,
    response.body
  );

  expect(response.body)
    .to.be.an("array")
    .and.not.be.empty;
});

Then("as ações que possuem lista devem apresentar o nome da lista",() => {
    const actionsWithList = response.body.filter(
      (action: any) => action.data?.list
    );

    expect(
      actionsWithList.length,
      "Deve existir ao menos uma action contendo data.list"
    ).to.be.greaterThan(0);

    actionsWithList.forEach((action: any) => {
      expect(action.data.list.name)
        .to.be.a("string")
        .and.not.be.empty;
    });
  }
);