import { When, Then, And } from 'cypress-cucumber-preprocessor/steps'
import { btndivspan, continueBooking } from '../../../functions/lapland_helper'

let timesCount = 0
const x6 = 60000

When('I am on the extra page', async () => {
  // A wait.then has been removed here (cy.wait().then(() => {})
  await continueBooking('Continue Booking')
})

When(
  'I click + button {string} times in {string}',
  async (times, buttonText) => {
    // A wait.then has been removed here (cy.wait().then(() => {})
    cy.iframe('#ticknovate-frame')
      .find('p')
      .contains(buttonText)
      .parent()
      .parent()
      .parent()
      .find('p')
      .contains('£0.00')
      .as('price')
    await getPackagingPrice(true)
    for (let time = 1; time <= parseInt(times); time++) {
      cy.iframe('#ticknovate-frame')
        .find('p')
        .contains(buttonText)
        .parent()
        .parent()
        .parent()
        .find('button')
        .eq(1)
        .click({ force: true })
    }
    timesCount = parseInt(times)
  },
)

When('I input {string} data for tour for extras', async (data) => {
  // await btndivspan('Your tour')
  // const date = data.split(' ')
  // const month = date[1]

  await btndivspan('Your tour')
  const date = data.split(' ')
  const day = date[0]

  cy.iframe('#ticknovate-frame', { timeout: 40000 })
    .find('div[class^="modal_caddy_"]', { timeout: 40000 })
    .find('span[class^="datecell_day_"]')
    .contains(`${day}`, { timeout: 40000 })
    .should(($el) => {
      const classes = $el.parent().attr('class')
      expect(classes).to.include('datecell_available',{timeout:x6})
    })
    .parent()
    .click({ force: true })

  cy.iframe('#ticknovate-frame')
    .find('div[class^="modal_caddy_"]', { timeout: 40000 })
    .find('span[class^="inlinetextbox_layout_"]')
    .contains('Next')
    .parent()
    .parent()
    .click({ force: true })
})

Then('the price in {string} booking is updated by {string}', async (buttonText,price) => {
  cy.iframe('#ticknovate-frame')
      .find('p')
      .contains(buttonText)
      .parent()
      .parent()
      .siblings()
      .eq(0)
      .find('p')
      .contains(price,{timeout:x6})
    .invoke('text')
    .then((txt) => {
      const defaultsPrice = price == '£5.00' || price == '£35.00' ? '£5.00' : '£30.00'
      expect(txt).to.include(extractPrice(defaultsPrice))
    })
})

And('the price for {string} is added to the Booking Summary', async (type) => {
  // A wait.then has been removed here (cy.wait().then(() => {})
  cy.iframe('#ticknovate-frame')
    .find('h4')
    .contains('Booking Summary')
    .siblings()
    .eq(0)
    .children()
    .eq(1)
    .find('span')
    .contains(type)
    .as('lineitem')
    .invoke('text')
    .then((txt) => {
      if (type == 'Additional Invitation Box') {
        expect(true).to.eq(txt.includes(`${timesCount}`))
      }
      if (type == 'Elf Jingles') {
        expect(true).to.eq(txt.includes(`${30}`))
      }
    })
  cy.get('@lineitem')
    .siblings()
    .eq(0)
    .invoke('text')
    .then((txt) => {
      const defaults = type == 'Additional Invitation Box' ? '£5.00' : '£30.00'
      expect(txt).to.eq(extractPrice(defaults))
    })
  if (type == 'Elf Jingles') {
    await continueBooking('Continue booking')
  }
})

Then('the packaging and postage fee is updated', async () => {
  await getPackagingPrice(false)
})

And('I click {string} in Cancellation Protection screen', async () => {
  await continueBooking('Continue booking')
  // A wait.then has been removed here (cy.wait().then(() => {})
  cy.iframe('#ticknovate-frame')
    .find('h1')
    .contains('TicketPlan Cancellation Protection')
    .should('exist')
    .and('be.visible')
  cy.iframe('#ticknovate-frame')
    .find('p')
    .contains('Booking total')
    .parent()
    .siblings()
    .eq(1)
    .click({ force: true })
})

Then('a cancellation protection is added to the booking', async () => {
  // A wait.then has been removed here (cy.wait().then(() => {})
  cy.iframe('#ticknovate-frame')
    .find('h4')
    .contains('Booking Summary')
    .siblings()
    .eq(0)
    .children()
    .eq(1)
    .find('span')
    .contains('Cancellation protection')
    .as('cancel_lineitem')
    .should('exist')
    .and('be.visible')
})

And(
  'the price in booking is updated with {string} for cancellation',
  async (price) => {
    cy.get('@cancel_lineitem')
      .siblings()
      .eq(0)
      .invoke('text')
      .then((txt) => {
        const defaultsPrice = price
        expect(txt).to.eq(defaultsPrice)
      })
  },
)

And('I click continue booking', async () => {
  // A wait.then has been removed here (cy.wait().then(() => {})
  await continueBooking('Continue booking')
})

And('{string} button is clickable', async (btn) => {
  cy.iframe('#ticknovate-frame')
    .find('span[class^="inlinetextbox_layout_"]')
    .contains(btn)
    .parent()
    .parent()
})

function stripPriceInt(price) {
  return parseInt(price.split('.')[0].split('£')[1])
}
// MagicalExtras.feature

function extractPrice(price) {
  const priceInt = parseInt(price.split('.')[0].split('£')[1])
  return `£${priceInt * timesCount}.00`
}

async function getPackagingPrice(save) {
  cy.iframe('#ticknovate-frame')
    .find('h4')
    .contains('Booking Summary')
    .siblings()
    .eq(0)
    .children()
    .eq(1)
    .find('span')
    .contains('Postage & Packaging')
    .as('lineitem')
  cy.get('@lineitem')
    .siblings()
    .eq(1)
    .invoke('text')
    .then((txt) => {
      if (save == true) {
        return Cypress.env('packagingPrice', txt)
      } else {
        cy.wrap(stripPriceInt(txt)).should(
          'be.gte',
          stripPriceInt(Cypress.env('packagingPrice')),
        )
      }
    })
}
