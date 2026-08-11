import "dotenv/config"; 
import { defineConfig } from "cypress";
import createBundler from "@bahmutov/cypress-esbuild-preprocessor";
import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";
import { createEsbuildPlugin } from "@badeball/cypress-cucumber-preprocessor/esbuild";
import dotenv from "dotenv";

dotenv.config();

async function setupNodeEvents(
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions
): Promise<Cypress.PluginConfigOptions> {
  await addCucumberPreprocessorPlugin(on, config);

  on(
    "file:preprocessor",
    createBundler({
      plugins: [createEsbuildPlugin(config)],
    })
  );
  require("cypress-mochawesome-reporter/plugin")(on);
  return config;
}

export default defineConfig({
  reporter: "cypress-mochawesome-reporter",

  reporterOptions: {
    charts: true,
    reportPageTitle: "QA SDET Challenge - Test Report",
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
  },

  video: true,
  screenshotOnRunFailure: true,

  e2e: {
    baseUrl: process.env.BASE_URL || "https://automationexercise.com",
    specPattern: "cypress/e2e/features/**/*.feature",


  env: {
      testUserEmail: process.env.TEST_USER_EMAIL,
      testUserPassword: process.env.TEST_USER_PASSWORD,

      triKey: process.env.TRELLO_API_KEY,
      trelloToken: process.env.TRELLO_TOKEN,
      trelloBoardId: process.env.TRELLO_BOARD_ID,
    },

    setupNodeEvents,
  },
});