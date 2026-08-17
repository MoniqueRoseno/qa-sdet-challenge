import {
  Before,
} from "@badeball/cypress-cucumber-preprocessor";

import { EnvironmentCheck } from "../../support/api/EnvironmentCheck";

Before({ tags: "@web" }, () => {
  const baseUrl = Cypress.config("baseUrl");

  if (!baseUrl) {
    throw new Error(
      "[CONFIGURATION] BASE_URL não está configurada."
    );
  }

  EnvironmentCheck.checkUrl(
    baseUrl,
    "Automation Exercise"
  );
});