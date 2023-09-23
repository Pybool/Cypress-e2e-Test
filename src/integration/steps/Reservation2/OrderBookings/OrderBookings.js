import { And, Then, When } from 'cypress-cucumber-preprocessor/steps'
import {
  DATA_OBJECT,
  getTomorrowDate,
  getTodaysDate,
} from '../helpers/datafile'

function toSentenceCase(str) {
  return str
    .toLowerCase()
    .replace(/(^\s*\w|\s*\w)/g, (match) => match.toUpperCase())
}

When(
  'I click the View button in Search Orders for a previously created order',
  async () => {
    cy.readFile('store.txt').then((content) => {
      const lastOrder_id = content
      Cypress.config()['orderId'] = lastOrder_id
      cy.get('table.chakra-table', { timeout: 20000 })
        .find('tr > td')
        .contains(lastOrder_id)
        .parent()
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
      cy.visit(Cypress.config().baseUrl + `orders/${lastOrder_id}`)
    })
  },
)

Then(
  'The {string} displays and matches {string}',
  async (bookingInfo, info) => {
    switch (bookingInfo) {
      case 'Location':
        cy.get(
          'h2',
        ).eq(1).as('selection')
        cy.get('@selection').scrollIntoView()
        cy.get('@selection')
          .should('exist')
          .and('be.visible')
          .invoke('text')
          .then((txt) => {
            expect(txt).to.include(DATA_OBJECT.to)
            expect(txt).to.include(DATA_OBJECT.from)
          })
        break

      case 'Date':
        cy.log(String(getTomorrowDate()))
        cy.get(
          'h2',
        ).eq(1).parent()
        .siblings()
        .eq(1).children()
        .eq(0).children()
        .eq(1).as('selection')

        cy.get('@selection').scrollIntoView()
        cy.get('@selection')
          .should('exist')
          .and('be.visible')
          .invoke('text')
          .then((txt) => {
            cy.log(txt, String(getTomorrowDate()))
            const splitDates = String(getTomorrowDate()).split(" ")
            splitDates.forEach((item)=>{
              expect(txt.includes(item.replaceAll(',',''))).to.eq(true)
            })
            
          })
        break

      case 'Time':
        cy.log('pass')
        break

      case 'Ticket Price:':
        cy.get('h4.chakra-heading')
          .eq(0)
          .siblings()
          .eq(0)
          .children()
          .eq(0)
          .should('have.text', info.split(' ')[0].trim())
        break
      case 'Amount':
        cy.get('h4.chakra-heading')
          .eq(0)
          .siblings()
          .eq(0)
          .children()
          .eq(1)
          .should('have.text', info.split(' ')[1].trim())
        break
    }
  },
)

And('I click {string} dropdown', async (detail) => {
  const idx = 0
  idx == 1 ? detail == 'Contact Details:' : 0
  cy.get('h3.chakra-heading')
    .contains(detail)
    .siblings()
    .eq(0)
    .children()
    .eq(idx)
    .click({ force: true })
})

Then(
  'The {string} section displays data consistent with the order created',
  async (detail) => {
    let fields = []
    let collapseIndex = 0
    let extfield

    if (detail == 'Order Details') {
      collapseIndex = 1
      fields = [
        'Order Reference',
        'Market',
        'Channel',
        'Status',
        'Payment Method',
        'Order Created At',
      ]
    }

    if (detail == 'Contact Details') {
      fields = ['First Name', 'Last Name', 'Phone', 'Email']
    }

    if (detail == 'Billing Details') {
      collapseIndex = 2
      fields = ['Address Line 1', 'City', 'Post Code', 'Country']
    }

    fields.forEach(async (field) => {
      let value = ''
      switch (field) {
        case 'Order Reference':
          value = Cypress.config()['orderId']
          break
        case 'Market':
          value = DATA_OBJECT.market
          break
        case 'Channel':
          value = DATA_OBJECT.Channel
          break
        case 'Status':
          value = toSentenceCase(window.localStorage.getItem('orderStatus')) //DATA_OBJECT.Status
          break
        case 'Payment Method':
          value = DATA_OBJECT.Payment_Method
          break
        case 'Order Created At':
          value = 'Date'
          cy.get('div.chakra-collapse')
            .eq(collapseIndex)
            .find('div')
            .contains(field)
            .siblings()
            .eq(0)
            .invoke('text')
            .then((txt) => {
              expect(txt.includes(getTodaysDate())).to.eq(true)
            })
          break
        case 'First Name':
          value = DATA_OBJECT.firstname
          break
        case 'Last Name':
          value = DATA_OBJECT.lastname
          break
        case 'Phone':
          value = DATA_OBJECT.telephone
          break
        case 'Email':
          extfield = 'Email'
          value = DATA_OBJECT.email
          break
        case 'Address Line 1':
          value = DATA_OBJECT.line_1
          break
        case 'City':
          value = DATA_OBJECT.town
          break
        case 'Post Code':
          value = DATA_OBJECT.post_code
          break
        case 'Country':
          value = DATA_OBJECT.Country_Code
          break
      }
      if (value != 'Date' && extfield != 'Email') {
        cy.get('div.chakra-collapse')
          .eq(collapseIndex + 1)
          .find('div')
          .contains(field)
          .then((txts) => {})
          .contains(field)
          .siblings()
          .eq(0)
          .should('have.text', value)
      }

      if (extfield == 'Email') {
        cy.get('div.chakra-collapse')
          .eq(collapseIndex + 1)
          .find('div')
          .contains(field)
          .parent()

          .children()
          .eq(0)
          .siblings()
          .eq(0)
          .should('have.text', value)
      }
    })
  },
)

When('I click the {string} History on bookings page', () => {
  // A wait.then has been removed here (cy.wait().then(() => {})
  cy.get('div.chakra-stack>div.chakra-stack>div.chakra-card')
    .siblings()
    .eq(0)
    .children()
    .eq(0)
    .as('btn')

  cy.get('@btn').then(() => {
    cy.get('div.chakra-stack>div.chakra-stack>div.chakra-card')
      .siblings()
      .eq(0)
      .as('targetElement')
  })

  cy.get('@targetElement').children().eq(0).as('targetElementChild')

  cy.get('@targetElementChild').trigger('mousedown')
  cy.get('@targetElementChild').trigger('mouseup')
  cy.get('@targetElementChild').click()
})

Then(
  'I ensure that the {string} Modal is visible and the {string} header is visible',
  (txt) => {
    cy.get('div.chakra-modal__content-container').as('modal') //.find('button[aria-label="Close"]').click({force:true})
    cy.get('@modal')
      .get('section.chakra-modal__content')
      .find('header.chakra-modal__header')
      .should('exist')
      .and('be.visible')
      .invoke('text')
      .then((headertxt) => {
        cy.readFile('store.txt').then((content) => { 
          expect(headertxt).to.eq(`Redeem ${content}`)
        })
      })
  },
)

Then(
  'I ensure that the Redeem Selected Ticket Button is disabled by default',
  () => {
    cy.get('@modal')
      .find('button.chakra-button')
      .as('redeemSelectedBtn')
      .should('have.attr', 'disabled')
  },
)

When('I check all ticket options checkboxes', () => {
  cy.get('@modal')
    .get('section.chakra-modal__content')
    .find('input.chakra-checkbox__input')
    .each((checkbox) => {
      cy.wrap(checkbox).check({ force: true })
    })
})

Then('I ensure that the Redeem Selected Ticket Button is enabled', () => {
  cy.get('@redeemSelectedBtn').should('not.have.attr', 'disabled')
})

When('I click Transaction History icon on bookings page', () => {
  // A wait.then has been removed here (cy.wait().then(() => {})
  cy.get('h2.chakra-heading')
    .contains('Bookings')
    .siblings()
    .eq(0)
    .click({ force: true })
})

Then('I click the Redeem Selected Ticket Button', () => {
  cy.get('@redeemSelectedBtn').click({ force: true })
})

Then('The modal is closed and i should see Redeemed under the QR Code', () => {
  // A wait.then has been removed here (cy.wait().then(() => {})
  cy.get('@modal').should('not.be.exist')
  cy.get('p.chakra-text')
    .contains('Redeemed')
    .as('redeemedText')
    .should('exist')
    .and('be.visible')
  cy.get('@redeemedText')
    .parent()
    .should('have.css', 'background-color', 'rgb(189, 63, 63)')
})
