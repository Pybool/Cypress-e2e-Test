const report = require('multiple-cucumber-html-reporter')
const path = require('path')

const reportPath = path.join('reports', 'cucumber-html-report.html')

report.generate({
  jsonDir: 'src/cucumber-json', // ** Path of .json file **//
  reportPath: reportPath,
  metadata: {
    browser: {
      name: 'chrome',
      version: '81',
    },
    device: 'Local test machine',
    platform: {
      name: 'mac',
      version: 'Catalina',
    },
  },
})
