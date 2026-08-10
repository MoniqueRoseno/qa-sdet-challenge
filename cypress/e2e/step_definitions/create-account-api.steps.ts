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

let account: AccountData;
let response: Cypress.Response<any>;
let shouldDeleteAccount = false;

const parseBody = (body: unknown): any => {
  if (typeof body === "string") {
    return JSON.parse(body);
  }

  return body;
};

Given( "que possuo dados válidos e únicos para uma nova conta",() => {
    account = AccountFactory.create();
  }
);

Given("que possuo dados de conta sem e-mail", () => {
  account = AccountFactory.create();
  account.email = "";
});

When("solicito a criação da conta", () => {
  accountApi
    .createAccount(account)
    .then((apiResponse) => {
      response = apiResponse;
    });
});

Then("a API deve confirmar a criação com sucesso", () => {
  expect(response.status).to.eq(200);
  shouldDeleteAccount = true;
});

Then("deve retornar a mensagem de usuário criado", () => {
   const body =
    typeof response.body === "string"
      ? JSON.parse(response.body)
      : response.body;

  expect(body).to.have.property("responseCode", 201);

  expect(body).to.have.property(
    "message",
    "User created!"
  );
});

Given("que existe uma conta previamente cadastrada",() => {
    account = AccountFactory.create();

    accountApi
      .createAccount(account)
      .then((createResponse) => {
        const body = parseBody(createResponse.body);

        expect(body.responseCode).to.eq(201);
        expect(body.message).to.eq("User created!");

        shouldDeleteAccount = true;
      });
  }
);

When("solicito novamente a criação da conta com o mesmo e-mail",() => {
    accountApi
      .createAccount(account)
      .then((apiResponse) => {
        response = apiResponse;
      });
  }
);

Then("a API deve rejeitar a criação duplicada", () => {
  const body = parseBody(response.body);

  expect(body.responseCode).to.not.eq(201);

  expect(body.message)
    .to.be.a("string")
    .and.not.be.empty;
});

Then("a API deve rejeitar a criação", () => {
  const body =
    typeof response.body === "string"
      ? JSON.parse(response.body)
      : response.body;

  expect(body.responseCode).to.not.eq(201);
});

Then("deve retornar uma resposta de erro", () => {
  const body =
    typeof response.body === "string"
      ? JSON.parse(response.body)
      : response.body;

  expect(body).to.have.property("message");

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