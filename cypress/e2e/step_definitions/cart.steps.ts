import {
  Given,
  When,
  Then,
} from "@badeball/cypress-cucumber-preprocessor";

import { productsPage } from "../../support/page_objects/ProductsPage";
import { cartPage } from "../../support/page_objects/CartPage";

const product = {
  id: 2,
  name: "Men Tshirt",
  price: "Rs. 400",
};

Given("que o usuário está na página de produtos", () => {
  productsPage.visit();
});

When("ele adiciona um produto ao carrinho", () => {
  productsPage.addProductToCartById(
    product.name,
    product.id
  );

  productsPage.validateProductAdded();
});

When("acessa o carrinho", () => {
  productsPage.goToCart();
});

Then("o produto deve ser apresentado no carrinho", () => {
  cartPage.validateCartIsDisplayed();

  cartPage.validateProductName(
    product.id,
    product.name
  );
});

Then("o preço do produto deve estar correto", () => {
  cartPage.validateProductPrice(
    product.id,
    product.price
  );
});

Then("a quantidade deve ser igual a 1", () => {
  cartPage.validateProductQuantity(product.id, 1);
});

Then("o subtotal deve corresponder ao preço multiplicado pela quantidade",() => {
    cartPage.validateSubtotalCalculation(product.id);
  }
);

When("ele adiciona o mesmo produto duas vezes ao carrinho", () => {
  productsPage.addProductToCartById(
    product.name,
    product.id
  );

  productsPage.validateProductAdded();
  productsPage.continueShopping();

  productsPage.addProductToCartById(
    product.name,
    product.id
  );

  productsPage.validateProductAdded();
});

Then("a quantidade deve ser igual a 2", () => {
  cartPage.validateProductQuantity(product.id, 2);
});