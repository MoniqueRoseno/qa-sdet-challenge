import {
  Given,
  When,
  Then,
} from "@badeball/cypress-cucumber-preprocessor";

import { productsPage } from "../../support/page_objects/ProductsPage";
import { cartPage } from "../../support/page_objects/CartPage";
import { checkoutPage } from "../../support/page_objects/CheckoutPage";
import { paymentPage } from "../../support/page_objects/PaymentPage";
import { getCredentials } from "../../support/utils/credentials";

const product = {
  id: 2,
  name: "Men Tshirt",
};

const paymentData = {
  name: "QA Test",
  cardNumber: "4111111111111111",
  cvc: "123",
  month: "12",
  year: "2030",
};

Given("que o usuário está na página de pagamento com um pedido preparado",() => {
    getCredentials().then(({ email, password }) => {
    cy.login(email, password);

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

    cartPage.proceedToCheckout();

    checkoutPage.validateCheckoutPage();
    checkoutPage.placeOrder();

    paymentPage.validatePaymentPage();
  }
)
})

When("ele informa os dados de pagamento", () => {
  paymentPage.fillPaymentData(
    paymentData.name,
    paymentData.cardNumber,
    paymentData.cvc,
    paymentData.month,
    paymentData.year
  );
});

When("confirma o pedido", () => {
  paymentPage.confirmOrder();
});

When(
  "ele tenta confirmar o pedido sem preencher os dados de pagamento",
  () => {
    paymentPage.confirmOrder();
  }
);

Then("o sistema deve concluir o pedido", () => {
  paymentPage.validateOrderCompleted();
});

Then("deve apresentar a confirmação da compra", () => {
  paymentPage.validateOrderConfirmation();
});

Then("o sistema deve impedir a conclusão do pedido", () => {
  paymentPage.validateOrderWasNotCompleted();
});

Then(
  "os campos obrigatórios devem permanecer inválidos",
  () => {
    paymentPage.validateRequiredFields();
  }
);

