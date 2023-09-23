import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps'
import { setBaseUrl } from '../../../../../common/shared'
import { getRandomHash } from '../../../../../functions/common'
import { capacityOptions } from '../../../../../common/capacity'

Given('I set up the base URL', async () => {
  await setBaseUrl(Cypress.env('ADMIN_URL'))
})

Given('I logged as an admin user on Admin web application', () => {
  cy.loginAdminApp(Cypress.env('ADMIN_USER'), Cypress.env('ADMIN_PASS'))
})

When('I go to the main page', () => {
  cy.visit('/blocks/tickets')
})

When('I go to the side menu option {string} page', (sidemenu_option) => {
  if (sidemenu_option == 'Venues') {
    cy.findByTestId('test-li-nav-venues').should('contain', 'Venues').click()
  }
})

When('I add a new venue', () => {
  cy.findByTestId('test-button-cta-add-new-venue').click()
})

When('I click a {string} on {string} page', (submenu) => {
  cy.get('ul[class^="sidenavigation_options"]')
    .find('li')
    .contains(submenu)
    .click({ force: true })
})

Then('I create and save a new venue', () => {
  cy.findByTestId('test-input-venue-external-id')
    .should('have.value', '')
    .fastType(`test-e2e-${getRandomHash()}`)

  cy.findByTestId('test-input-venue-title')
    .should('have.value', '')
    .fastType(`test-e2e-${getRandomHash()}`)

  cy.findByTestId('test-button-cta-controls-save').click()
})

Then('I edit the last created venue', () => {
  cy.findByTestId('test-table-venues-list').find('button').last().click()
})

Then('I select the tab capacity plan', () => {
  cy.findByTestId('test-button-tab-capacity-plans').click()
})

Then('I create a new capacity plan', () => {
  cy.findByTestId('test-button-cta-add-capacity-plan').click()
})

Then('I set title to my new capacity plan', () => {
  cy.findByTestId('test-input-capacity-plan-title')
    .should('have.value', '')
    .fastType(`test-e2e-${getRandomHash()}`)
})

Then('I select {string} capacity plan', (type) => {
  if (type == 'unnumbered') {
    cy.findByTestId('test-button-radio-capacity-plan-unnumbered').click()
  }

  if (type == 'numbered') {
    cy.findByTestId('test-button-radio-capacity-plan-numbered').click()
  }
})

Then('I add and set capacity options of a {string} plan', (type) => {
  if (type == 'numbered') {
    for (const [key, capacityOption] of Object.entries(capacityOptions)) {
      cy.findByTestId(`test-select-capacity_areas[${key}].capacity_option_id`)
        .should('exist')
        .select(capacityOption)

      cy.findByTestId(`test-input-capacity_areas[${key}].name`).fastType(
        `CP Name ${key}`,
      )
      cy.findByTestId(`test-input-capacity_areas[${key}].group`).fastType(
        `CP Group ${key}`,
      )

      if (key < capacityOptions.length - 1) {
        cy.findByTestId('test-table-add-simplified-capacity-plan-list').click()
      }
    }
  }

  if (type == 'unnumbered') {
    // cy.findByTestId(`test-select-capacity_areas[${key}].capacity_option_id`)
    //   .should('exist')
    //   .select('gin-train')
    // cy.findByTestId(`test-input-capacity_areas[${key}].quantity`).fastType(
    //   '100',
    // )
  }
})
