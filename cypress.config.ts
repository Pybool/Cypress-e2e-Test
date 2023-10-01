import { defineConfig } from 'cypress'
import dotenv from 'dotenv'

dotenv.config()
const cucumber = require('cypress-cucumber-preprocessor').default
const getCompareSnapshotsPlugin = require('cypress-image-diff-js/dist/plugin')

module.exports = defineConfig({
  projectId: 'expian-e2e-cy',
  e2e: {
    setupNodeEvents(on, config) {
      on('file:preprocessor', cucumber()), getCompareSnapshotsPlugin(on, config)
    },
    testIsolation: true,
    retries: {
      runMode: 1,
      openMode: 1,
    },
    defaultCommandTimeout: 40000,
    chromeWebSecurity: false,
    videoCompression: false,
    specPattern: '**/*.feature',
    env: {
        
    },

    viewportHeight: 700,
    viewportWidth: 1240,
    fileServerFolder: '.',
    supportFile: './src/support/e2e.js',
    videosFolder: './src/videos',
    screenshotsFolder: './src/screenshots',
    fixturesFolder: './src/fixtures',
    downloadsFolder: process.env.TEST_DOWNLOADS_FOLDER,
    experimentalMemoryManagement:true,
    numTestsKeptInMemory: 3,
    video:false,

  },
})
