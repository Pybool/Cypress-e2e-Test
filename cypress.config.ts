import { defineConfig } from 'cypress'
import dotenv from 'dotenv'

dotenv.config()
const cucumber = require('cypress-cucumber-preprocessor').default
const getCompareSnapshotsPlugin = require('cypress-image-diff-js/dist/plugin')

module.exports = defineConfig({
  projectId: 'ticknovate-e2e-cy',
  e2e: {
    setupNodeEvents(on, config) {
      on('file:preprocessor', cucumber()), getCompareSnapshotsPlugin(on, config)
    },
    testIsolation: true,
    retries: {
      runMode: 1,
      openMode: 1,
    },
    defaultCommandTimeout: 20000,
    chromeWebSecurity: false,
    videoCompression: false,
    specPattern: '**/*.feature',
    env: {
        CYPRESS_E2E_USERNAME: process.env.CYPRESS_E2E_USERNAME,
        CYPRESS_E2E_PASSWORD: process.env.CYPRESS_E2E_PASSWORD,
        ADMIN_USER: process.env.ADMIN_USER,
        ADMIN_PASS: process.env.ADMIN_PASS,
        API_URL: process.env.API_URL,
        ADMIN_URL: process.env.ADMIN_URL,
        RES2_URL: process.env.RES2_URL,
        RES2_EMAIL: process.env.RES2_EMAIL,
        RES2_PASS: process.env.RES2_PASS,
    },

    viewportHeight: 700,
    viewportWidth: 1240,
    fileServerFolder: '.',
    supportFile: './src/support/e2e.js',
    videosFolder: './src/videos',
    screenshotsFolder: './src/screenshots',
    fixturesFolder: './src/fixtures',
    downloadsFolder: './src/downloads',
    experimentalMemoryManagement:true,
    numTestsKeptInMemory: 3,
    video:false,
  },
})
