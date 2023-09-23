import { Given, And, Then, When } from 'cypress-cucumber-preprocessor/steps'
import { setBaseUrl } from '../../../../../../../common/shared'

/**
 * Given the current lack of structure to access properly (With Cypress) to the allocation selection page, I will access directly with an URL
 *
 * We need to:
 * 1. Create a mocked or already boostraop in the db a tenant+service+instance and all requirements to have Res2 working
 * 2. Create a mocked capacity plan that will be use by Cypress, where we can know exactly the capacity options and we can set them at Cypress as values
 * 3. Set all the missing steps to access successfully to allocation selection page
 *
 * Until that big ToDo is finish, you can locate the capacity plan for step 2, used for this tests, at:
 * src/support/fixtures/capacity_plan.csv
 */
const bookingUrl =
  '/booking?market=ravenglass&type=route&from=ravenglass_loc&to=dalegarth_loc&return-trip=false'

Given('I set up the base URL', async () => {
  await setBaseUrl(Cypress.env('RES2_URL'))
})

Given('I login as an admin user on Reservations 2 web application', () => {
  cy.loginReservations2(Cypress.env('RES2_EMAIL'), Cypress.env('RES2_PASS'))
})

Given('A previous set db dump and capacity allocation fixture', () => {
  // ToDo
})

When('I go to New Order > Capacity Allocation page', () => {
  cy.visit(bookingUrl)
})

When('I click on ticket selection button', () => {
  cy.findByTestId(`booking-button-collapsed-ticket-selector`)
    .should('exist')
    .click()
})

And('I select {string} tickets of {string}', (amount, name) => {
  cy.findByTestId(`booking-input-spinner-${name}`).as('bookingSpinner')
  cy.get('@bookingSpinner').should('exist')
  cy.get('@bookingSpinner').click()
  cy.get('@bookingSpinner').clear()
  cy.get('@bookingSpinner').fastType(amount)
})

Then('Should {string} be the only displayed options', (options) => {
  const optionList = options.split(',').map((option) => option.trim())

  optionList.forEach((option) => {
    cy.findByTestId(`test-booking-capacity-option-slot-${option}`)
      .should('exist')
      .should('not.be.disabled')
  })
})

And('I select a date time and add to the cart', () => {
  cy.findByTestId(`test-booking-availability-option-0`).should('exist').click()
  cy.findByTestId(`test-booking-add-to-cart`).should('exist').click()
})

// Then('I select a date time and to the carta', (type) => {
//   cy.findByTestId(`test-availability-option-0`).should('exist').click()
//   cy.findByTestId(`test-booking-add-to-cart`).should('exist').click()
// })

// if (type == 'numbered') {
//   for (const [key, capacityOption] of Object.entries(capacityOptions)) {
//     cy.findByTestId(`test-select-capacity_areas[${key}].capacity_option_id`)
//       .should('exist')
//       .select(capacityOption)

//     cy.findByTestId(`test-input-capacity_areas[${key}].name`).fastType(
//       `CP Name ${key}`,
//     )
//     cy.findByTestId(`test-input-capacity_areas[${key}].group`).fastType(
//       `CP Group ${key}`,
//     )

//     if (key < capacityOptions.length - 1) {
//       cy.findByTestId('test-table-add-simplified-capacity-plan-list').click()
//     }
//   }
// }

// if (type == 'unnumbered') {
//   cy.findByTestId(`test-select-capacity_areas[${key}].capacity_option_id`)
//     .should('exist')
//     .select('gin-train')

//   cy.findByTestId(`test-input-capacity_areas[${key}].quantity`).fastType(
//     '100',
//   )
// }
// })
