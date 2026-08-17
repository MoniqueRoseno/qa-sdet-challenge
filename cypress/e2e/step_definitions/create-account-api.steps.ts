import {
  Given,
  When,
  Then,
  After,
} from "@badeball/cypress-cucumber-preprocessor";

import {
  AccountData,
  AccountFactory,
} from "../../support/factories/AccountFactory";

import { accountApi } from "../../support/api/AccountApi";
import { SchemaValidator } from "../../support/validators/SchemaValidator";

import accountCreatedSchema from "../../schemas/account-created.schema.json";
import accountErrorSchema from "../../schemas/account-error.schema.json";

let account: AccountData;
let response: Cypress.Response<any>;
let shouldDeleteAccount = false;

const parseBody = (body: unknown): any => {
  if (typeof body === "string") {
    return JSON.parse(body);
  }

  return body;
};

Given("que possuo dados válidos e únicos para uma nova conta",() => {
    account = AccountFactory.create();
  }
);

Given("que possuo dados de conta sem e-mail", () => {
  account = AccountFactory.create();
  account.email = "";
});

Given("que existe uma conta previamente cadastrada",() => {
    account = AccountFactory.create();

    accountApi
      .createAccount(account)
      .then((createResponse) => {
        const body = parseBody(createResponse.body);

        // Transporte
        expect(createResponse.status).to.eq(200);

        // Contrato
        SchemaValidator.validate(
          accountCreatedSchema,
          body
        );

        // Regra de negócio
        expect(body.responseCode).to.eq(201);
        expect(body.message).to.eq("User created!");

        shouldDeleteAccount = true;
      });
  }
);

When("solicito a criação da conta", () => {
  accountApi.createAccount(account)
    .then((apiResponse) => {
      response = apiResponse;
    });
});

When("solicito novamente a criação da conta com o mesmo e-mail",() => {
    accountApi.createAccount(account)
      .then((apiResponse) => {
        response = apiResponse;
      });
  }
);

Then("a API deve confirmar a criação com sucesso", () => {
  expect(response.status).to.eq(200);

  shouldDeleteAccount = true;
});

Then("deve retornar a mensagem de usuário criado", () => {
  const body = parseBody(response.body);

  SchemaValidator.validate(
    accountCreatedSchema,
    body
  );

  expect(body.responseCode).to.eq(201);
  expect(body.message).to.eq("User created!");
});

Then("a API deve rejeitar a criação", () => {
  const body = parseBody(response.body);

  expect(response.status).to.eq(200);

  SchemaValidator.validate(
    accountErrorSchema,
    body
  );

  expect(body.responseCode).to.not.eq(201);
});

Then("deve retornar uma resposta de erro", () => {
  const body = parseBody(response.body);

  expect(body.message)
    .to.be.a("string")
    .and.not.be.empty;
});

Then("a API deve rejeitar a criação duplicada", () => {
  const body = parseBody(response.body);

  expect(response.status).to.eq(200);

  SchemaValidator.validate(
    accountErrorSchema,
    body
  );

  expect(body.responseCode).to.not.eq(201);

  expect(body.message)
    .to.be.a("string")
    .and.not.be.empty;
});

After(() => {
  if (shouldDeleteAccount && account?.email) {
    accountApi.deleteAccount(
      account.email,
      account.password
    );

    shouldDeleteAccount = false;
  }
});