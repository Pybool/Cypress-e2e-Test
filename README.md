# Cypress Test Suite

This project contains cypress end-to-end tests using for the Reservation and Booking environments.

## Prerequisites

Before running the tests, make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/) (Node Package Manager)

## Installation

```bash
git clone <repository-url>
cd <project-directory>
npm install
```

## Environment Variables (.env)

Ensure you have the following environment variables set in your `.env` file:

```env
TESTRAIL_USERNAME=''
TESTRAIL_PASSWORD=''
TESTRAIL_URL=''
TESTRAIL_PROJECTID=''
TESTRAIL_PLAN=''
TESTRAIL_SUITEID=''
APIKEY=''
```

## Configurations

Make sure to set the following configuration parameters in your `cypress.env.json` file:

```json
{
  "EXPIAN-USERNAME": "",
  "EXPIAN-PASSWORD": "",
  "BOOKING": "https://booking.default-qa8.ticknovate-test.com/",
  "RESERVATION": "https://reservations.default-qa8.ticknovate-test.com/",
  "SERVER_BASE_URL": "",
  "TEST_DOWNLOADS_FOLDER": "",
  "ORDER_DAYS_FROM_TODAY": 1,
  "TEST_PRODUCT": "Taye Test Event"
}
```

# Running Tests on Specific Environments

This project provides convenient scripts for running regression tests on reservations and bookings, as well as generating reports.

## Run Regression Tests for Reservations

To run regression tests specifically for reservations, use the following command:

```bash
npm run start:regression-reservations
```

This command uses Cypress to run automated tests with the @automated tag in headless mode, focusing on the reservations environment.

## Run Regression Tests for Bookings

To run regression tests specifically for bookings, use the following command:

```
npm run start:regression-bookings
```

Similar to the reservations command, this command runs automated tests with the @automated tag in headless mode, focusing on the bookings environment.

## Generate Test Report

To generate a test report, use the following command:

```
npm run generate:report
```

This command executes a Node.js script (cucumber-html-report.js) to generate an HTML report based on the results of your Cypress tests.

# TestRail Integration

This project includes scripts to interact with TestRail.

## Delete All Sections/Folders in TestRail

```bash
node testrail.js --delete
```

## Initialize Top-Level Environment Sections/Folders on TestRail

This command initializes toplevel sections/environments for a new test suite

```bash
node testrail.js --init
```

## Add Sub Sections to Top-Level Folders

This command adds test folders within environments

```bash
node testrail.js --createsubdirs
```

## Export Tests to Selected Environment

To export tests to a selected environment (e.g., Reservations):

```bash
node testrail.js --export --Reservations
```

## Export and Clear Reports Folder

To export tests to a selected environment and clear the cypress/cucumber-json reports folder after export:

```bash
node testrail.js --export --Reservations --cleandir
```

## Fix windows line endings incompatibilty

```bash
find . -type f \( -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" \) -not -path "./node_modules/*" -exec sed -i 's/\r$//' {} \;
```

## Authors:

```
1: Taye Oyelekan
2: Expian
```
