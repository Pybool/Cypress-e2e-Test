import { Given, And, Then, When } from 'cypress-cucumber-preprocessor/steps'
import { BASE_URL } from '../index'
import { setBaseUrl } from './generic'
require('dotenv').config()
const username = Cypress.env('ADMIN_USER')
const password = Cypress.env('ADMIN_PASS')

const pwds = { lakedistrict: Cypress.env('LAKE_DISTRICT_PASS') }
setBaseUrl(Cypress.env('module'), BASE_URL)

Given('I am a user on Admin Page', () => {
  setBaseUrl(Cypress.env('module'), BASE_URL)
  cy.visit('/blocks/tickets')
  cy.get('#username').fastType(username)
  cy.get('#password').fastType(Cypress.env('LAKE_DISTRICT_PASS'))
  cy.get('button').contains('Login').click()
})

Given('I am on {string} home page', (page) => {
  const homePages = { lakedistrict: '/blocks/tickets' }
  cy.visit(homePages[page])
})

Given('I am a user on {string} for {string}', (page, env) => {
  cy.visit('/blocks/tickets')
  cy.get('#username').fastType(username)
  cy.get('#password').fastType(pwds[env])
  cy.get('button').contains('Login').click()
  cy.get('h1[class^="heading_section_"]').as('header')
  if (page == 'Building Blocks') {
    cy.get('@header').should('contain', page)
  } else {
    cy.get('li[class^="navigator_wrapper_"]')
      .find('a>span')
      .contains(page)
      .as('selectedlink')
    cy.get('@selectedlink').click({ force: true })
    if (page == 'System Settings') {
      cy.get('@header').should('contain', 'System administration')
    } else {
      cy.get('@header').should('contain', page)
    }
  }
  cy.get('@header').should('be.visible')
})

When('I visit the backend portal', () => {
  cy.visit('/blocks/tickets')
})

And('I enter my credentials', () => {
  cy.get('#username').fastType(username)
  cy.get('#password').fastType(password)
})

And('I click the login button', () => {
  cy.get('button').contains('Login').click()
})

Then('I should be taken to the {string} page', (header) => {
  cy.get('h1[class^="heading_section_"]').as('header')

  if (header == 'System Settings') {
    cy.get('@header').should('contain', 'System administration')
  }
  if (header == 'Promos') {
    cy.get('@header').should('contain', 'Promotions')
  }

  if (header != 'System Settings' && header != 'Promos') {
    cy.get('@header').should('contain', header)
  }

  if (header == 'Logout') {
    return cy.url().then((currentURL) => {
      const expectedURL = '/login'
      expect(currentURL).to.equal(expectedURL)
    })
  }
  cy.get('@header').should('be.visible')
})

And('I am logged in', () => {
  cy.visit('/login')
  cy.get('#username').fastType(username)
  cy.get('#password').fastType(password)
  cy.get('button').contains('Login').click()
})

When('I click on the {string} link', (link) => {
  if (link != 'Logout') {
    cy.get('li[class^="navigator_wrapper_"]')
      .find('a>span')
      .contains(link)
      .as('selectedlink')
    cy.get('@selectedlink').click({ force: true })
  } else {
    cy.get('li[class^="navigator_wrapper_"]').last().click()

    cy.get('li[class^="navigator_wrapper_"]')
      .find('div>span')
      .contains(link)
      .as('selectedlink')
    cy.get('@selectedlink').click({ force: true })
  }
})

Then('I click the {string} button', (button) => {
  cy.get('button').as('selectedbutton')
  cy.get('@selectedbutton').contains(button)
  cy.get('@selectedbutton').click({ force: true })
})

And(
  'The {string} tab should be active with background {string}',
  (tab, bgcolor) => {
    cy.get('li[class^="sidenavigation_option_"]')
      .contains(tab)
      .as('selectedtab')
    cy.get('@selectedtab').should('have.css', 'background-color', bgcolor)
    cy.get('h2[class^="heading_heading_"]')
      .contains(tab)
      .should('exist')
      .and('be.visible')
  },
)

Then('I should be taken to the {string} header page', (page) => {
  cy.get('h1[class^="heading_heading_"]')
    .contains(page)
    .should('exist')
    .and('be.visible')
})

Then('I go to the entitlements page for {string}', (txt) => {
  cy.get('li[class^="navigator_wrapper_"]')
    .find('a>span')
    .contains('Entitlements')
    .as('selectedlink')
  cy.get('@selectedlink').click({ force: true })
  cy.get('button').as('selectedbutton')
  cy.get('@selectedbutton').contains(txt)
  cy.get('@selectedbutton').click({ force: true })
})
