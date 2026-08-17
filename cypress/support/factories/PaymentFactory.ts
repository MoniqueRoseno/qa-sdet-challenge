export interface PaymentData {
  name: string;
  cardNumber: string;
  cvc: string;
  month: string;
  year: string;
}

export class PaymentFactory {
  static valid(): PaymentData {
    return {
      name: "QA Test",
      cardNumber: "4111111111111111",
      cvc: "123",
      month: "12",
      year: "2030",
    };
  }

  static withInvalidCvc(): PaymentData {
    return {
      ...this.valid(),
      cvc: "ABC",
    };
  }

  static withInvalidExpiryMonth(): PaymentData {
    return {
      ...this.valid(),
      month: "13",
    };
  }
}