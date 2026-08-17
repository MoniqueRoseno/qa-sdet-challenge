import {
  Given,
} from "@badeball/cypress-cucumber-preprocessor";

import { productsPage } from "../../support/page_objects/ProductsPage";

Given("que o usuário está na página de produtos", () => {
  productsPage.visit();
});