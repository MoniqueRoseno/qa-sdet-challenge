import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { loginPage } from "../../support/page_objects/LoginPage";
import { getCredentials }  from "../../support/utils/credentials";

Given("que o usuário está na página de autenticação", () => {
  loginPage.visit();
});

Given("que o usuário está autenticado", () => {
 getCredentials().then(({ email, password }) => {
  cy.login(email, password);
  });
})

When("informa credenciais válidas", () => {
  getCredentials().then(({ email, password }) => {
  cy.login(email, password);  
  });
});

When("informa uma senha inválida", () => {
  getCredentials().then(({ email, password }) => {
   loginPage.login(email, "invalid-password");
  });
});

When("informa credenciais de um usuário não cadastrado", () => {
  const invalidEmail = `invalid-user-${Date.now()}@example.com`;

  loginPage.login(invalidEmail, "invalid-password");
});

When("realiza logout", () => {
  loginPage.logout();
});

Then("deve acessar sua conta com sucesso", () => {
   getCredentials().then(({ email, password }) => {
   loginPage.validateSuccessfulLogin(email);
  });
});

Then("a autenticação deve ser rejeitada", () => {
  loginPage.validateLoginError();
  loginPage.validateUnauthenticated();
});

Then("sua sessão deve ser encerrada", () => {
  loginPage.validateLogout();
});