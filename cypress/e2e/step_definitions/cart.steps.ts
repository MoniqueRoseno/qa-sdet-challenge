import {
  When,
  Then,
} from "@badeball/cypress-cucumber-preprocessor";

import { productsPage } from "../../support/page_objects/ProductsPage";
import { cartPage } from "../../support/page_objects/CartPage";
import { ProductFactory } from "../../support/factories/ProductFactory";

const product = ProductFactory.defaultProduct();



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
  cartPage.validateProductQuantity(
    product.id,
    1
  );
});

Then("a quantidade deve ser igual a 2", () => {
  cartPage.validateProductQuantity(
    product.id,
    2
  );
});

Then("o subtotal deve corresponder ao preço multiplicado pela quantidade",() => {
    cartPage.validateSubtotalCalculation(product.id);
  }
);