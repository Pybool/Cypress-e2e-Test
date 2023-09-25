import { Given, And, Then, When } from 'cypress-cucumber-preprocessor/steps'
import { BASE_URL } from '../index'
const x6 = 60000
const username = 'taye.oyelekan@ticknovate.com'
const password = {
  rs2: '?oJd96oL',
  uat: 'Radio9*981tai',
  test: 'Radio9*981tai',
}

const setBaseUrl = (name, env = '') => {
  Cypress.config('baseUrl', BASE_URL[name][Cypress.env('module')])
}

Given('I am logged in to reservations2 {string}', (env) => {
  setBaseUrl(Cypress.env('testenv'), Cypress.env('module'))
  cy.visit('/login')
  cy.get('.chakra-input').eq(0).fastType(username)
  cy.get('.chakra-input').eq(1).fastType(password[env])
  cy.window().then((win) => {
    win.sessionStorage.removeItem('bookingFlowState')
  })
  window.sessionStorage.removeItem('bookingFlowState')
  cy.get('button[type="submit"]').click()
  window.sessionStorage.removeItem('bookingFlowState')
  cy.get('h2.chakra-heading')
  .contains('Welcome to Reservations',{timeout:x6})
  .should('exist')
  .and('be.visible')
})

And('I am on the landingpage', () => {
  cy.url().should('eq', Cypress.config().baseUrl + '')
})

When('I click on {string} button', (buttonText) => {
    cy.visit('/booking')
})

Then('The current page header should be {string}', (headerText) => {
  cy.get('h2.chakra-heading', { timeout: 35000 })
    .invoke('text')
    .then((txt) => {
      expect(txt).to.eq(headerText)
    })
})

Then(
  'I take a snapshot of the {string} page and compare with baseline image',
  (page) => {
    cy.compareSnapshot(page)
  },
)

When(
  'I select and input in the {string}, {string}, {string}, {string}, {string} field',
  (market, from, to) => {
    cy.get('button.chakra-menu__menu-button').eq(0).click()
    cy.get('div.chakra-menu__menu-list')
      .find('button>span')
      .contains(market)
      .parent()
      .click({ force: true })

    cy.get('button.chakra-menu__menu-button').eq(1).click()
    cy.get('div.chakra-menu__menu-list')
      .eq(1)
      .find('button>span')
      .contains(from)
      .parent()
      .click({ force: true })

    cy.get('button.chakra-menu__menu-button').eq(2).click()
    cy.get('div.chakra-menu__menu-list')
      .eq(1)
      .find('button>span')
      .contains(to)
      .parent()
      .click({ force: true })

    cy.get('button')
      .find('p')
      .contains(`Who`)
      .parent()
      .as('btn')
      .click({ force: true })
    cy.get('@btn').siblings().eq(0).find('button.chakra-menu__menuitem').click()
  },
)
