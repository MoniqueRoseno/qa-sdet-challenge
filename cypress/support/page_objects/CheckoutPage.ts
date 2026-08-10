export class CheckoutPage {
  private deliveryAddress = "#address_delivery";
  private billingAddress = "#address_invoice";
  private orderReview = "#cart_info";
  private placeOrderButton = 'a[href="/payment"]';

  validateCheckoutPage(): void {
    cy.location("pathname").should("include", "/checkout");

    cy.get(this.deliveryAddress).should("be.visible");
    cy.get(this.billingAddress).should("be.visible");
    cy.get(this.orderReview).should("be.visible");
  }

  validateDeliveryAddress(): void {
    cy.get(this.deliveryAddress)
      .should("be.visible")
      .and("not.be.empty");
  }

  validateBillingAddress(): void {
    cy.get(this.billingAddress)
      .should("be.visible")
      .and("not.be.empty");
  }

  validateProduct(
    productId: number,
    productName: string
  ): void {
    cy.get(this.orderReview)
      .find(`#product-${productId}`)
      .should("be.visible")
      .and("contain.text", productName);
  }

  validateSubtotalCalculation(productId: number): void {
    cy.get(this.orderReview)
      .find(`#product-${productId}`)
      .within(() => {
        cy.get(".cart_price p")
          .invoke("text")
          .then((priceText) => {
            const price = this.convertPriceToNumber(priceText);

            cy.get(".cart_quantity button")
              .invoke("text")
              .then((quantityText) => {
                const quantity = Number(quantityText.trim());

                cy.get(".cart_total_price")
                  .invoke("text")
                  .then((totalText) => {
                    const total =
                      this.convertPriceToNumber(totalText);

                    expect(
                      total,
                      "Total na revisão deve corresponder ao preço × quantidade"
                    ).to.equal(price * quantity);
                  });
              });
          });
      });
  }

  placeOrder(): void {
    cy.get(this.placeOrderButton)
      .should("be.visible")
      .click();
  }

  validatePaymentPage(): void {
    cy.location("pathname", { timeout: 10000 })
      .should("eq", "/payment");
  }

  private convertPriceToNumber(price: string): number {
    return Number(
      price
        .replace("Rs.", "")
        .trim()
    );
  }
}

export const checkoutPage = new CheckoutPage();