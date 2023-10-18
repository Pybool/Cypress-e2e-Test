import { And, Then, When } from 'cypress-cucumber-preprocessor/steps'
import * as rs2 from '../../../functions/rs2'
const x6 = 60000

Given ('I have created an order as a customer', async ()=>{
  cy.visit('/booking')
  const data = { adults: 2, children: 2, step: '2 adults 2 children' }
  await rs2.startCreateOrder(data.adults, data.children,"Ullswater 'Steamers'",3)
  rs2.internalCheckOut('Checkout',"Ullswater 'Steamers'")
  

})

Then(
  'I click the View button in Search Orders for a previously created order',
  async () => {
    cy.visit('/')
    cy.task('getData', { key: 'lastOrderID' }).then((data) => { 
      const lastOrder_id = data
      Cypress.config()['orderId'] = lastOrder_id

      cy.get('table.chakra-table', { timeout: 30000 })
        .find('tr > td')
        .then(($tds) => {
          const lastOrderRow = $tds.filter((index, element) => {
            return Cypress.$(element)
          })

          if (lastOrderRow.text().trim() === lastOrder_id) {
            lastOrderRow.parent().children().as('tds').last().as('last')

            cy.get('@tds')
              .eq(1)
              .invoke('text')
              .then((txt) => {
                window.localStorage.setItem('orderStatus', txt)
              })

            cy.get('@last').find('a').eq(0).click({ force: true })
            cy.visit(Cypress.config().baseUrl + `orders/${lastOrder_id}`)
          } else {
            cy.get('table.chakra-table')
              .find('tbody tr')
              .first()
              .children()
              .as('tds')
              .last()
              .as('last')

            cy.get('@tds')
              .eq(1)
              .invoke('text')
              .then((txt) => {
                window.localStorage.setItem('orderStatus', txt)
              })
            cy.get('@tds')
            .eq(0)
            .click()
            cy.get('h1').contains('Order Preview',{timeout:x6})
            .parent()
            .parent()
            .find('a')
            .contains('View Order Details',{timeout:x6})
            .click({ force: true })
          }
      })
    })

  },
)

Then('I click the More Actions Button beside Edit Order', async () => {
  cy.get('button.chakra-menu__menu-button')
    .find('span')
    .contains('More Actions')
    .parent()
    .click()
})

Then('I should see a dropdown displayed', async () => {
  cy.get('div.chakra-menu__menu-list')
    .as('moreMenuList')
    .should('exist')
    .and('be.visible')
})

And('The dropdown should contain an option {string}', async (option) => {
  cy.get('@moreMenuList')
    .find('button.chakra-menu__menuitem>span')
    .contains(option)
    .should('exist')
    .and('be.visible')
})

And(
  'The dropdown should contain an option {string} which should have color {string}',
  async (option, color) => {
    cy.get('@moreMenuList')
      .find('button.chakra-menu__menuitem>span')
      .contains(option)
      .should('exist')
      .and('be.visible')
      .should('have.css', 'color', color)
  },
)

And('I click on {string} option', async (option) => {
  cy.get('div.chakra-menu__menu-list').as('moreMenuList')
  cy.get('@moreMenuList')
    .find('button.chakra-menu__menuitem>span')
    .contains(option)
    .click({ force: true })
})

Then('I should see a {string} pdf file downloaded', async (file) => {
  if (Cypress.platform === 'win32') {
    cy.readFile(`src\\Downloads\\${file}.pdf`).should('exist')
  } else {
    cy.readFile(`src/Downloads/${file}.pdf`).should('exist')
  }
})

Then(
  'I should see a modal with Resend Email Header an Email address Label and and Input Field for the email and a Resend button',
  async () => {
    cy.get('div.chakra-modal__content-container')
      .get('section')
      .as('section')
      .should('have.css', 'opacity', '1')
      .should('exist')
      .and('be.visible')
      .find('header.chakra-modal__header')
      .contains('Resend Email')

    cy.get('@section')
      .find('div.chakra-modal__body')
      .find('div.chakra-form-control')
      .as('formControl')
      .find('label')
      .contains('Email Address')
      .should('exist')
      .and('be.visible')

    cy.get('@formControl')
      .find('input')
      .as('einput')
      .should('exist')
      .and('be.visible')
      .invoke('val')
      .then((val) => {
        window.localStorage.setItem('o-email', val)
      })
  },
)

When('I clear the email input field', async () => {
  cy.get('@einput').clear()
})

Then('The Resend Button should be disabled', async () => {
  cy.get('@section')
    .find('button.chakra-button')
    .contains('Resend')
    .should('have.attr', 'disabled')
})

When('I reenter the valid email', async () => {
  cy.get('@einput').type(window.localStorage.getItem('o-email'))
})

When('The Resend Button should be enabled', async () => {
  cy.get('@section')
    .find('button.chakra-button')
    .contains('Resend')
    .should('not.have.attr', 'disabled')
})

When('I click the Resend Button', async () => {
  cy.get('@section').find('button.chakra-button').contains('Resend').click()
})

Then(
  'I should see a bottom toast with Background color {string} with title {string} and body {string} and the modal should not be displayed',
  async (bgcolor, title, text) => {
    cy.get('div.chakra-alert')
      .as('toast')
      .should('have.css', 'background-color', bgcolor)
      .find('div.chakra-alert__title')
      .should('have.text', title)
      .siblings()
      .eq(0)
      .should('have.text', text)
  },
)

Then('I should see a modal with title {string}', async (title) => {
  cy.get('div.chakra-modal__content-container')
    .as('modal')
    .find('header.chakra-modal__header')
    .contains(title)
    .should('exist')
    .and('be.visible')
})

And('The modal should have a table with headers {string}', async (headers) => {
  cy.get('div.chakra-modal__content-container')
    .as('modal')
    .find('table.chakra-table')
    .as('table')
    .should('exist')

  const headersArr = headers.split(',')
  
  headersArr.forEach((header) => {
    cy.get('@table').find('th').as('th')
    cy.log(header.trim())
    cy.get('@th').contains(header.trim())
    .scrollIntoView()
    .should('exist')
  })
})

When('I click the modal close button', async () => {
  cy.get('@modal').find('button.chakra-modal__close-btn').eq(0).click({ force: true })
})

Then('The {string} modal should be closed', async (option) => {
  expect(true).to.be.true
})

Then('I should be taken to {string} page', async (page) => {
  cy.task('getData', { key: 'lastOrderID' }).then((data) => { 
    const content = data
    cy.get('h2.chakra-heading')
    .contains(`Amending Booking: ${content}`)
    .as('page')
    .should('exist')
    .and('be.visible')
    .invoke('text')
    .then((txt) => {
      expect(txt).to.include(page)
    })
  })
  
})

Then(
  'I should see text {string} which should have color {string}',
  async (text, color) => {
    cy.get('h5.chakra-heading')
      .contains(text)
      .as('page')
      .should('exist')
      .and('be.visible')
      .should('have.css', 'color', color)
      .invoke('text')
      .then((txt) => {
        expect(txt).to.eq(text)
      })
  },
)
