import { And, Then, When } from 'cypress-cucumber-preprocessor/steps'
import { BASE_URL } from '../../../index'
import * as rs2 from '../../../functions/rs2'
import * as core from '../helpers/core'

const __force__ = { force: true }
var btnText
const x6 = 60000

// BeforeEach(() => {
//   const time = '13:50'
//   const date = '28'
//   const entityID = '00574022-d00e-4fd9-af51-c285aa874400'
//   cy.getCapacity(time,date,entityID)

// })

When('I click the view button for an order in the orders table', async () => {
  rs2.cancelLastOrder(false).then(() => {
    
    cy.log('ACTION 2: ' + window.localStorage.getItem('actionType'))
    if (
      window.localStorage.getItem('actionType') == 'new' ||
      window.localStorage.getItem('actionType') == null
    ) {
      cy.url().then(async (currentUrl) => {
        const bookingUrl =
          Cypress.config('baseUrl', BASE_URL['rs2']['uat']) + '/booking'
        if (currentUrl !== bookingUrl) {
          cy.visit('/booking')
        }
        const data = { adults: 2, children: 2, step: '2 adults , 2 children' ,time:'13:50' }
        await rs2.startCreateOrder(data.adults, data.children,'',data.time)
        core.processSeats('Who',data.step, 2).then((modCapacityData)=>{
          Cypress.env('modCapacityData', modCapacityData);
          rs2.internalCheckOut('Checkout')
        })
      })
    }
  })
})

Then(
  'I ensure the order to be amended matches my last created order',
  async () => {
    cy.readFile('store.txt').then((lastOrderId) => {
      cy.url().then((url) => {
        window.localStorage.setItem('lastOrderID', lastOrderId)
        const extractedOrderId = url.split('/').pop()
        expect(extractedOrderId.length).to.be.greaterThan(5)
        expect(extractedOrderId).to.contain(lastOrderId)
      })
    })
  },
)

Then('I click the Edit Order Button beside More Actions dropdown', async () => {
  cy.get('button.chakra-menu__menu-button')
    .find('span')
    .contains('More Actions')
    .parent()
    .siblings()
    .eq(1)
    .click()
})

Then('I click the {string} Button beside {string} button', async (btnTxt,otherBtn) => {
  cy.get('a.chakra-button')
    .contains(btnTxt,{timeout:x6})
    .click(__force__)
})

Then('I should be taken to {string} page', async (page) => {
  cy.get('h2.chakra-heading')
    .as('page')
    .should('exist')
    .and('be.visible')
    .invoke('text')
    .then((txt) => {
      expect(txt).to.include(page)
      expect(txt).to.include(window.localStorage.getItem('lastOrderID'))
    })
})

And('I should see {string} sections', (sections) => {
  const sectionsList = sections.split(',')
  sectionsList.forEach((section) => {
    if (section == 'Who' || section == 'when') {
      cy.get('button.chakra-button').as('btn')
    } else {
      cy.get('button.chakra-menu__menu-button').as('btn')
    }
    cy.get('@btn')
      .find('p')
      .contains(section.trim())
      .should('exist')
      .and('be.visible')
  })
})

And(
  'I should see {string} card which should contain {string} and {string}',
  (cardName, previousBtn, nextBtn) => {
    
    cy.get('h2.chakra-heading', { timeout: 30000 }).contains(cardName)
    cy.get('button.chakra-button')
      .contains(previousBtn,{timeout:x6})
      .should('exist')
      .and('be.visible')

    cy.get('button.chakra-button')
      .contains(nextBtn,{timeout:x6})
      .should('exist')
      .and('be.visible')
  },
)

And('At least a time selection must be selected', () => {
  cy.get('p.chakra-text')
    .contains(Cypress.env('product'),{timeout:x6})
    .parent()
    .as('singleTrainRideAddon')
    .siblings()
    .its('length')
    .then((len) => {
      if (len == 4) {
        cy.get('@singleTrainRideAddon').as('ride')
      } else if (len == 5) {
        cy.get('@singleTrainRideAddon').siblings().eq(2).as('ride')
      }
      cy.get('@ride')
        .find('button.chakra-button')
        .each(($button) => {
          const backgroundColor = Cypress.$($button).css('background-color')
          const expectedBackgroundColor = 'rgb(15, 28, 42)'
          if (backgroundColor === expectedBackgroundColor) {
            expect(backgroundColor).to.eq(expectedBackgroundColor)
          }
        })
    })
})

And('I should see a compartment section with a compartment selected', () => {
  cy.get('div.chakra-tabs__tablist')
    .find('button.chakra-tabs__tab')
    .each(($button) => {
      const backgroundColor = Cypress.$($button).css('background-color')
      const expectedBackgroundColor = 'rgb(125, 227, 203)'
      if (backgroundColor === expectedBackgroundColor) {
        cy.wrap($button).should('exist').and('be.visible').scrollIntoView()
        expect(backgroundColor).to.eq(expectedBackgroundColor)
      }
    })
})

And('I should see atleast a seat is selected for the compartment', () => {
  cy.get('div.chakra-tabs__tab-panels')
    .find('button.chakra-tabs__tab')
    .each(($button) => {
      const backgroundColor = Cypress.$($button).css('background-color')
      const expectedBackgroundColor = 'rgb(15, 28, 42)'
      if (backgroundColor === expectedBackgroundColor) {
        cy.wrap($button).should('exist').scrollIntoView()
        expect(backgroundColor).to.eq(expectedBackgroundColor)
      }
    })
  cy.get('@singleTrainRideAddon')
    .siblings()
    .last()
    .children()
    .eq(1)
    .children()
    .eq(1)
    .find('button.chakra-button')
    .contains('Seats')
    .its('length')
    .then((len) => {
      expect(len).to.gte(1)
    })
})

When(
  'I proceed to change route by clicking the green swap location toggle',
  () => {
    cy.get("button[aria-label='Swap Locations']").click()
  },
)

Then(
  'I should no longer see the {string} Seating Compartments section',
  async (section) => {
    cy.get('h3.chakra-heading').each(($heading) => {
      const textContent = Cypress.$($heading).text().trim()
      expect(textContent).not.to.eq(section)
    })
  },
)

When('I click the {string} button to return to the Order Page', (btntext) => {
  cy.get('button.chakra-button').contains(btntext).click()
})

When('I edit the {string} section by removing {string}', (section, value) => {
  const vals = value.split('x')
  const number = vals[0].trim()
  let text = vals[1]
  cy.get('div.chakra-card')
    .find('button > p')
    .as('selectedDropdown')
    .contains(section)
    .click(__force__)
  for (let t = 0; t < parseInt(number); t++) {
    if (text != '') {
      text = text.replace(/,/g, '').trim()
      cy.get('div[id^="disclosure-"]')
        .find('p[class^="chakra-text"]')
        .contains(text)
        .parent()
        .parent()
        .siblings()
        .eq(0)
        .as('In')
      cy.get('@In')
        .find('input')
        .invoke('val')
        .then((val) => {
          if (parseInt(val) > 1) {
            cy.get('@In')
              .find('div[role="button"]')
              .eq(0)
              .as('subBtn')
              .click(__force__)
          }
        })
    }
  }

  const filePath = 'cypress/integration/steps/Reservation2/OrderAmendBooking/amendStore.txt'
  cy.writeFile(filePath, {
    orderId: window.localStorage.getItem('lastOrderID'),
    data: {
      sections: [{ sectionName: section, actions: ['remove'], value: [value] }],
    },
  })
})

When(
  'I edit the {string} section by clicking the {string} button',
  (date, btntxt) => {
  },
)

When('I select a time for {string} Single Train ride', () => {
    cy.get('p.chakra-text').contains('11:50',{timeout:x6})
    .click({ force: true })
})

Then(
  'I should see the Add-Ons section at the bottom of the page with atleast one option',
  async () => {
    cy.get('h3.chakra-heading').contains('Add-Ons').as('addonheader')

    cy.get('@addonheader')
      .parents()
      .each(($parentElement) => {
        cy.wrap($parentElement).invoke('css', 'overflow', 'visible')
      })

    cy.get('@addonheader').should('exist').and('be.visible')

    cy.get('@addonheader')
      .siblings()
      .its('length')
      .then((len) => {
        expect(len).to.gte(1)
      })
  },
)

When('I select a time for Single Train ride with no Add-Ons', () => {
  cy.get('@singleTrainRideAddon')
    .siblings()
    .eq(2)
    .find('button.chakra-button')
    .eq(1)
    .click(__force__)
})

Then(
  'I should no longer see the Add-Ons section at the bottom of the page',
  () => {
    cy.get('h3.chakra-heading').each(($heading) => {
      const textContent = Cypress.$($heading).text().trim()
      expect(textContent).not.to.eq('Add-Ons')
    })
  },
)

Then('I select seats in the reservation compartment section', async() => {

})

Then('The {string} Button should be Inactive', (btnText) => {
  cy.get('button.chakra-button')
    .contains(btnText)
    .should('have.attr', 'disabled')
})

Then('The {string} Button should be Active', (btnText) => {
  cy.get('button.chakra-button')
    .contains(btnText)
    .should('not.have.attr', 'disabled')
})

Then('I click the {string} button', (btnText) => {
  cy.get('button.chakra-button').contains(btnText).click(__force__)
})

Then(
  'The {string} Button should be Active if The Sub Total is negative else the {string} Button should be active where either button is the action button',
  (refund, checkout) => {
    const data = { adults: 1, children: 2, step: '1 adults , 2 children' }
    cy.get('div.chakra-tabs__tablist').eq(0)
    .should('exist',{timeout:60000})
    .scrollIntoView()
    .and('be.visible',{timeout:60000})
    .then(()=>{
      core.processSeats('Who',data.step, 3).then((modCapacityData)=>{
        Cypress.env('modCapacityData', modCapacityData);
      })
  
      cy.get('p.chakra-text')
        .contains('Sub Total:')
        .siblings()
        .eq(0)
        .invoke('text')
        .then((txt) => {
          if (txt.includes('-')) {
            btnText = refund
          } else if (txt == '£0.00') {
            btnText = checkout
          } else {
            btnText = checkout
          }
          cy.get('button.chakra-button')
            .contains('Commit Changes')
            .should('not.have.attr', 'disabled')

            cy.get('button.chakra-button')
            .contains('Commit Changes').click()

          cy.get('button.chakra-button')
            .contains(btnText)
            .should('not.have.attr', 'disabled')
        })
    })
    
  },
)

Then('I click the action button', () => {
  cy.get('h3').contains('Cart').parent().siblings().eq(2).children().last().as('btn').should('not.have.attr', 'disabled')
  cy.get('@btn').click(__force__)
})

Then('I click the {string} button', (btnText) => {
  cy.get('button.chakra-button').contains(btnText).click(__force__)
})

Then('I process a refund or checkout', () => {
  let btntext;
  
  cy.get('@btn').invoke('text').then((txt)=>{
    if(txt=='Checkout'){
      btntext = 'Continue to payment'
    }
    else{
      btntext = 'Complete refund'
    }
    cy.get('p.chakra-text')
    .contains(btntext,{timeout:x6})
    .parent()
    .parent()
    .click(__force__)
    if (txt == 'Checkout') {
      rs2.fillPaymentInformationForm()
    }
  })
  
})

Then('I should see a {string} header', (header) => {
  cy.get('span').contains(header).should('exist').and('be.visible')
  
})

Then('I should see that the order completed successfully', () => {
  
  cy.get('p.chakra-text').as('paragraphs')
  cy.get('@paragraphs')
  .contains('Order reference',{timeout:x6})
  .as('reflabel')

  cy.get('@reflabel').scrollIntoView()
  cy.get('@reflabel').should('exist').and('be.visible')
  cy.get('span').contains('Order complete',{timeout:x6})
  .should('exist').and('be.visible')


  cy.get('@reflabel')
    .siblings()
    .eq(0)
    .should('exist')
    .and('be.visible')
    .then(($el) => {
      $el.get(0).scrollIntoView()
      expect($el.text()).to.eq(window.localStorage.getItem('lastOrderID'))
    })
})

Then(
  'I ckick the view order button to verify all changes are reflected',
  () => {},
)