export interface AccountData {
  name: string;
  email: string;
  password: string;
  title: string;
  birth_date: string;
  birth_month: string;
  birth_year: string;
  firstname: string;
  lastname: string;
  company: string;
  address1: string;
  address2: string;
  country: string;
  zipcode: string;
  state: string;
  city: string;
  mobile_number: string;
}

export class AccountFactory {
  static create(): AccountData {
    const uniqueId = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    return {
      name: "QA Automation",
      email: `qa.automation.${uniqueId}@example.com`,
      password: "Test@123",
      title: "Mrs",
      birth_date: "10",
      birth_month: "5",
      birth_year: "1995",
      firstname: "QA",
      lastname: "Automation",
      company: "QA Test",
      address1: "Test Street 123",
      address2: "Apartment 10",
      country: "Canada",
      zipcode: "12345",
      state: "Ontario",
      city: "Toronto",
      mobile_number: "11999999999",
    };
  }
}