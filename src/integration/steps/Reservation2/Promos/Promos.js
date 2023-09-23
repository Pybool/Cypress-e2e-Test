import { Then } from 'cypress-cucumber-preprocessor/steps'
import { DYN_DATA_OBJECT_FN } from '../helpers/datafile'
const x6 = 60000

async function fn(number, secondchoice = 0) {
  const DYN_DATA_OBJECT = DYN_DATA_OBJECT_FN('who', number)
  cy.get('div.chakra-card')
    .get('div.chakra-stack')
    .find('button')
    .eq(0)
    .should('exist')
    .click({ force: true })

  function resetAndClick(text, times) {
    cy.get('div[id^="disclosure-"]')
      .find('p[class^="chakra-text"]')
      .contains(text)
      .parent()
      .parent()
      .siblings()
      .eq(0)
      .find('input')
      .as('input')
      .invoke('val')
      .then((txt) => {
        if (txt != '0') {
          for (let i = 0; i < parseInt(txt); i++) {
            cy.get('div[id^="disclosure-"]')
              .find('p[class^="chakra-text"]')
              .contains(text)
              .parent()
              .parent()
              .siblings()
              .eq(0)
              .find('div[role="button"]')
              .eq(0)
              .click({ force: true })
          }
          window.sessionStorage.removeItem('bookingFlowState')
        }
      })
    for (let t = 0; t < parseInt(times); t++) {
      if (text != '') {
        text = text.replace(/,/g, '').trim()
        cy.get('div[id^="disclosure-"]')
          .find('p[class^="chakra-text"]')
          .contains(text)
          .parent()
          .parent()
          .siblings()
          .eq(0)
          .find('div[role="button"]')
          .eq(1)
          .as('addbtn')
          .click({ force: true })
      }
    }
  }

  return new Promise((resolve) => {
    DYN_DATA_OBJECT.market_what.forEach(async (select) => {
      if (select != 'Who' && select != 'when') {
        if (select == 'Market') {
          cy.get('div.chakra-card')
            .find('button > span')
            .contains('Sa')
            .as('selectedDropdown')
            .eq(0)
            .click({ force: true })
        } else {
          cy.get('div.chakra-card')
            .find('button > span >p')
            .as('selectedDropdown')
            .contains(select)
            .click({ force: true })
        }
      } else {
        cy.get('div.chakra-card')
          .find('button > p')
          .as('selectedDropdown')
          .contains(select)
          .click({ force: true })
      }

      switch (select) {
        case 'What':
          cy.get('div.chakra-menu__menu-list')
            .eq(1)
            .find('button>span')
            .contains(DYN_DATA_OBJECT.What)
            .parent()
            .click({ force: true })
          break

        case 'To':
          cy.get('div.chakra-menu__menu-list')
            .eq(2)
            .find('button>span')
            .contains(DYN_DATA_OBJECT.to)
            .parent()
            .click({ force: true })
          break

        case 'Who':
          {
            const choice = DYN_DATA_OBJECT.who.replaceAll('2', String(number))
            let arr
            let text

            if (secondchoice != 0) {
              let activechoice
              const choices = [`${number}x Adult`, `${secondchoice}x Child`]
              for (let choiceidx = 0; choiceidx < choices.length; choiceidx++) {
                if (choiceidx == 0) {
                  activechoice = number
                } else {
                  activechoice = secondchoice
                }
                arr = choices[choiceidx].split(`${activechoice}x`)
                text = arr[1].trim()
                resetAndClick(text, activechoice)
              }
            } else {
              arr = choice.split(`${number}x`)
              text = arr[1].trim()
              resetAndClick(text)
            }
          }
          break
      }
    })
    resolve(1)
  }).then(async () => {
    for (let i = 0; i < 1; i++) {
      cy.get('button.chakra-button').contains('Next Day').click({ force: true })
    }

    cy.get('h3.chakra-heading')
      .contains('Goat yoga with Beer')
      .parent()
      .siblings()
      .eq(0)
      .children()
      .eq(1)
      .click({ force: true })
    // A wait.then has been removed here (cy.wait().then(() => {})
    cy.get('button.chakra-button')
      .contains('Add To Cart',{timeout:x6})
      .click({ force: true })
  })
}

function getPriceFromString(price) {
  return parseFloat(price.split('£')[1])
}

function isDiscountApplied(realPrice, discounts, discountPercent) {
  const sum = discounts.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0,
  )
  const discountCalculated =
    parseFloat(realPrice) * (parseFloat(discountPercent) / 100)
  return discountCalculated == sum
}

Then('I select the {string} to operate on', async () => {})

Then(
  'I attempt to create an order selecting {string} adult and {string} child for when choosing who',
  async (adults, children) => {
    await fn(adults, parseInt(children))
  },
)

Then(
  'I ensure that a {string} discount is applied on {string}',
  async (discount, customerType) => {
    const discountPrices = []
    cy.get('h5.chakra-heading').contains('Ticket Price').parent().as('tickets')
    cy.get('@tickets').scrollIntoView()
    cy.get('@tickets').should('exist').and('be.visible')
    cy.get('@tickets').find('p').contains(customerType)

    cy.get('@tickets')
      .find('p')
      .contains(customerType)
      .siblings()
      .as('siblings')

    cy.get('@siblings')
      .eq(0)
      .invoke('text')
      .then((price) => {
        const realPrice = getPriceFromString(price)
        cy.get('@tickets')
          .siblings()
          .eq(3)
          .children()
          .then((listing) => {
            const listingCount = Cypress.$(listing).length
            for (let i = 0; i < listingCount; i++) {
              cy.get('@tickets')
                .siblings()
                .eq(3)
                .children()
                .eq(i)
                .children()
                .eq(1)
                .invoke('text')
                .then((price) => {
                  discountPrices.push(getPriceFromString(price))
                })
            }
            // A wait.then has been removed here (cy.wait().then(() => {})
            const isApplied = isDiscountApplied(
              realPrice,
              discountPrices,
              discount,
            )

            expect(isApplied).to.eq(true)
          })
      })
  },
)
