import {
  Given,
  When,
  Then,
} from "@badeball/cypress-cucumber-preprocessor";

import { productsPage } from "../../support/page_objects/ProductsPage";

const existingProduct = "Blue Top";
const nonexistentProduct = "produto-inexistente-000";

Given("que o usuário está na listagem de produtos", () => {
  productsPage.visit();
});

When("ele pesquisa por um produto existente", () => {
  productsPage.search(existingProduct);
});

Then("o sistema deve apresentar a seção de produtos pesquisados", () => {
  productsPage.validateSearchedProductsTitle();
});

Then("deve apresentar produtos correspondentes ao termo pesquisado", () => {
  productsPage.validateProductIsDisplayed(existingProduct);
  productsPage.validateProductsMatchSearch(existingProduct);
});

When("ele pesquisa por um produto inexistente", () => {
  productsPage.search(nonexistentProduct);
});

Then("não deve apresentar produtos correspondentes à pesquisa", () => {
  productsPage.validateNoProductsReturned();
});

When("ele realiza uma busca sem informar um termo", () => {
  productsPage.searchWithoutTerm();
});

Then("o sistema deve manter a listagem de produtos disponível", () => {
  cy.get(".productinfo")
    .should("exist")
    .and("have.length.greaterThan", 0);
});

When("ele realiza uma busca contendo apenas espaços", () => {
  cy.get("#search_product").type("   ");
  cy.get("#submit_search").click();
});

Then("o sistema deve apresentar comportamento equivalente à busca sem termo",() => {
    cy.get(".productinfo")
      .should("exist")
      .and("have.length.greaterThan", 0);
  }
);