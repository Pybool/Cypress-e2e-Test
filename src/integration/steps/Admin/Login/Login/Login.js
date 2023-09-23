import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps'
import { setBaseUrl } from '../../../../common/shared'

Given('I set up the base URL', async () => {
  await setBaseUrl(Cypress.env('ADMIN_URL'))
})

Given('I am an admin user on Admin web application', () => {
  cy.visit('/login')

  cy.get('#username').type(Cypress.env('ADMIN_USER'))
  cy.get('#password').type(Cypress.env('ADMIN_PASS'))
  cy.get('button').contains('Login').click()
})

When('I go to the main page', () => {
  cy.visit('/blocks/tickets')
})

Then('title should be {string}', (header) => {
  cy.get('h1[class^="heading_section_"]').as('header')
  cy.get('@header').should('be.visible')
  cy.get('@header').should('contain', header)
})
