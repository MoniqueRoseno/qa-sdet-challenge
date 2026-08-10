export class PaymentPage {
  private nameOnCard = '[data-qa="name-on-card"]';
  private cardNumber = '[data-qa="card-number"]';
  private cvc = '[data-qa="cvc"]';
  private expiryMonth = '[data-qa="expiry-month"]';
  private expiryYear = '[data-qa="expiry-year"]';
  private payButton = '[data-qa="pay-button"]';

  fillNameOnCard(name: string): void {
    cy.get(this.nameOnCard)
      .clear()
      .type(name);
  }

  fillCardNumber(cardNumber: string): void {
    cy.get(this.cardNumber)
      .clear()
      .type(cardNumber);
  }

  fillCvc(cvc: string): void {
    cy.get(this.cvc)
      .clear()
      .type(cvc);
  }

  fillExpiryDate(month: string, year: string): void {
    cy.get(this.expiryMonth)
      .clear()
      .type(month);

    cy.get(this.expiryYear)
      .clear()
      .type(year);
  }

  fillPaymentData(
    name: string,
    cardNumber: string,
    cvc: string,
    month: string,
    year: string
  ): void {
    this.fillNameOnCard(name);
    this.fillCardNumber(cardNumber);
    this.fillCvc(cvc);
    this.fillExpiryDate(month, year);
  }

  confirmOrder(): void {
    cy.get(this.payButton)
      .should("be.visible")
      .click();
  }

  validatePaymentPage(): void {
    cy.location("pathname")
      .should("eq", "/payment");

    cy.get(this.payButton)
      .should("be.visible");
  }

  validateRequiredFields(): void {
    const fields = [
      this.nameOnCard,
      this.cardNumber,
      this.cvc,
      this.expiryMonth,
      this.expiryYear,
    ];

    fields.forEach((field) => {
      cy.get(field)
        .should("have.attr", "required");
    });
  }

  validateFieldAsMissing(selector: string): void {
    cy.get(selector).then(($input) => {
      const input = $input[0] as HTMLInputElement;

      expect(input.validity.valueMissing).to.be.true;
    });
  }

  validateOrderWasNotCompleted(): void {
    cy.location("pathname")
      .should("eq", "/payment");
  }

  validateOrderCompleted(): void {
  cy.location("pathname")
    .should("include", "/payment_done");
}

 validateOrderConfirmation(): void {
  cy.contains("Order Placed!")
    .should("be.visible");
}

  validateCvcValue(expectedValue: string): void {
  cy.get(this.cvc)
    .should("have.value", expectedValue);
}
}

export const paymentPage = new PaymentPage();