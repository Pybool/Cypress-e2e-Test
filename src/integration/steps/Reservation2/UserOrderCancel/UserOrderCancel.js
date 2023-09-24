import { And, Then, When } from 'cypress-cucumber-preprocessor/steps'
import * as rs2 from '../../../functions/rs2'

import * as core from '../helpers/core'
import { BASE_URL } from '../../../index'

const x6 = 60000

function cancelOrderFn(lastOrderId) {
  return cy.visit(`/orders/${lastOrderId}/amend`)
     
}

async function selectOrderFromTable() {
  return cy.readFile('store.txt').then((lastOrderId) => {
    if (!lastOrderId && lastOrderId != undefined) {
      return cy.url().then(async (currentUrl) => {
        const orderUrl = Cypress.config('baseUrl', BASE_URL['rs2']['uat']) + '/'
        if (currentUrl !== orderUrl) {
          return cy.visit('/').then(() => {
            return cy
              .get('table.chakra-table', { timeout: 30000 })
              .as('o_table')
              .then(async ($table) => {
                const hasRows = $table.find('tr').length > 1
                if (!hasRows) {
                  const lastOrderIdFound = rs2.containsStringInCells(
                    $table,
                    lastOrderId,
                  )
                  if (lastOrderIdFound) {
                    Cypress.config()['exists'] = 'exists'
                    cancelOrderFn(lastOrderId).then(() => {
                      cy.log(
                        'ACTION 1: ' +
                          window.localStorage.getItem('actionType'),
                      )
                    })
                  } else {
                    window.localStorage.setItem('actionType', 'new')
                  }
                }
              })
          })
        }
      })
    }
    else{
      cy.get('table.chakra-table', 
      { timeout: 30000 })
      .as('o_table')
      cancelOrderFn(lastOrderId).then(() => {
        cy.log(
          'ACTION 1: ' +
            window.localStorage.getItem('actionType'),
        )
      })
    }
  })
}

When('I create a an order', async () => {
  cy.visit('/booking')
  const data = { adults: 4, children: 4, step: '4 adults 4 children' }
  await rs2.startCreateOrder(data.adults, data.children)
  core.selectSeats('Who')
  rs2.internalCheckOut('Checkout')
})

Then('I go to the orders table and click on edit for the order', async () => {
    cy.get('table')
    .should('exist')
    .and('be.visible')
    selectOrderFromTable()
})

When(
  'I am on the Amending Booking page I click cancel order button',
  async () => {
    
    cy.get('h2.chakra-heading')
      .invoke('text')
      .then((txt) => {
        expect(txt).to.include('Amending Booking')
      })
    cy.get('button.chakra-button', { timeout: 60000 }).then(($buttons) => {
      const cancelButton = $buttons.filter(':contains("Cancel order")')
      if (cancelButton.length > 0) {
        cy.wrap(cancelButton).click({ force: true })
      }
    })
  },
)

Then('I should see {string} with color {string}', async (txt, color) => {
  cy.get('h5.chakra-heading').contains(txt).as('txt').should('be.visible')
  cy.get('@txt').should('have.css', 'color', color)
})

And('I should see a Refund Button', async () => {
  cy.get('button.chakra-button', { timeout: 30000 })
    .contains('Refund')
    .as('refundBtn')
    .should('exist')
    .and('be.visible')
})

And('I click on the Refund Button', async () => {
  cy.get('@refundBtn').click({ force: true })
})

Then('I should be taken to the Refund page', async () => {
  cy.get('h3.chakra-heading')
    .contains('Refund options')
    .should('exist')
    .and('be.visible')

  cy.get('button.chakra-button')
    .get('div.chakra-stack')
    .contains('Complete refund')
    .should('exist')
    .and('be.visible')
})

When('I click the {string} Button', async (btnText) => {
  cy.get('button.chakra-button')
    .get('div.chakra-stack')
    .contains(btnText)
    .click()
})

Then(
  'I should see {string} header with color {string} and {string} header',
  async (val1, val2, val3) => {
    cy.get('h3.chakra-heading > span')
      .contains(val1)
      .as('cancelledH3')
      .should('be.visible')
    cy.get('@cancelledH3').should('have.css', 'color', val2)
    cy.get('h5.chakra-heading').contains(val3).should('be.visible')
    
    cy.visit('/')
  },
)
