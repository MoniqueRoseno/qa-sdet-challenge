type TestCredentials = {
  email: string;
  password: string;
};

export const getCredentials =
  (): Cypress.Chainable<TestCredentials> => {
    return cy
      .env(
        ["testUserEmail", "testUserPassword"],
        { log: false }
      )
      .then(({ testUserEmail, testUserPassword }) => {
        if (!testUserEmail || !testUserPassword) {
          throw new Error(
            "Credenciais de teste não configuradas."
          );
        }

        return {
          email: testUserEmail,
          password: testUserPassword,
        };
      });
  };