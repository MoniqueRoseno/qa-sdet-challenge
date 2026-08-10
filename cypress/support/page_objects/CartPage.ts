export class CartPage {
  private cartTable = "#cart_info_table";
  private checkoutButton = "a.check_out";

  private getProductRow(productId: number) {
    return cy.get(`#product-${productId}`);
  }

  private convertPriceToNumber(price: string): number {
    return Number(
      price
        .replace("Rs.", "")
        .trim()
    );
  }

  validateCartIsDisplayed(): void {
    cy.get(this.cartTable)
      .should("be.visible");
  }

  validateProductName(
    productId: number,
    productName: string
  ): void {
    this.getProductRow(productId)
      .find(".cart_description")
      .should("contain.text", productName);
  }

  validateProductPrice(
    productId: number,
    expectedPrice: string
  ): void {
    this.getProductRow(productId)
      .find(".cart_price p")
      .should("have.text", expectedPrice);
  }

  validateProductQuantity(
    productId: number,
    expectedQuantity: number
  ): void {
    this.getProductRow(productId)
      .find(".cart_quantity button")
      .should("have.text", expectedQuantity.toString());
  }

  validateProductTotal(
    productId: number,
    expectedTotal: string
  ): void {
    this.getProductRow(productId)
      .find(".cart_total_price")
      .should("have.text", expectedTotal);
  }

  validateSubtotalCalculation(productId: number): void {
    this.getProductRow(productId).within(() => {
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
                    "Subtotal deve ser preço × quantidade"
                  ).to.equal(price * quantity);
                });
            });
        });
    });
  }

  proceedToCheckout(): void {
    cy.get(this.checkoutButton)
      .should("be.visible")
      .click();
  }
}

export const cartPage = new CartPage();