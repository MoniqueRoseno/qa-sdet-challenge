import {
  Given,
  When,
  Then,
} from "@badeball/cypress-cucumber-preprocessor";

import { productsPage } from "../../support/page_objects/ProductsPage";
import { cartPage } from "../../support/page_objects/CartPage";
import { checkoutPage } from "../../support/page_objects/CheckoutPage";
import { getCredentials } from "../../support/utils/credentials";
import { ProductFactory } from "../../support/factories/ProductFactory";

const product = ProductFactory.defaultProduct();

Given("que o usuário está autenticado para realizar uma compra",() => {
    getCredentials().then(({ email, password }) => {
      cy.login(email, password);
    });
  }
);

Given("possui um produto no carrinho", () => {
  productsPage.visit();

  productsPage.addProductToCartById(
    product.name,
    product.id
  );

  productsPage.validateProductAdded();
  productsPage.goToCart();

  cartPage.validateProductName(
    product.id,
    product.name
  );
});

Given("está na página de checkout", () => {
  cartPage.proceedToCheckout();
  checkoutPage.validateCheckoutPage();
});

When("ele prossegue para o checkout", () => {
  cartPage.proceedToCheckout();
});

When("ele confirma a revisão do pedido", () => {
  checkoutPage.placeOrder();
});

Then("o sistema deve apresentar o endereço de entrega", () => {
  checkoutPage.validateDeliveryAddress();
});

Then("deve apresentar o endereço de cobrança", () => {
  checkoutPage.validateBillingAddress();
});

Then(
  "deve apresentar o produto na revisão do pedido",
  () => {
    checkoutPage.validateProduct(
      product.id,
      product.name
    );
  }
);

Then("o total da revisão deve corresponder ao preço multiplicado pela quantidade",() => {
    checkoutPage.validateSubtotalCalculation(product.id);
  }
);

Then("o sistema deve direcioná-lo para a página de pagamento",() => {
    checkoutPage.validatePaymentPage();
  }
);