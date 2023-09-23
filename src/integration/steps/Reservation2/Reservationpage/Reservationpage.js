import { Then, When, And } from 'cypress-cucumber-preprocessor/steps'
import * as rs2 from '../../../functions/rs2'
const x6 = 60000

When('I am on the reservations page', () => {
  cy.visit('/')
})

Then('I should be on the base url', () => {
  cy.url().then((url) => {
    const expectedUrl = Cypress.config('baseUrl')
    expect(url).to.equal(expectedUrl)
  })
})

Then('I should see a greeting {string}', (greetingText) => {
  cy.get('p.chakra-text')
    .contains(greetingText)
    .as('greeting')
    .should('be.visible')
  cy.get('@greeting')
    .invoke('text')
    .then((txt) => {
      expect(txt).to.eq(greetingText)
    })
})

Then('I should see that the page header is {string}', (headerText) => {
  cy.get('h2.chakra-heading')
    .contains(headerText)
    .as('headerText')
    .should('be.visible')
  cy.get('@headerText')
    .invoke('text')
    .then((txt) => {
      expect(txt).to.eq(headerText)
    })
})

Then(
  'I should see the New Order button having an Icon on the top right of the page',
  () => {
    cy.get('@headerText')
      .siblings()
      .eq(0)
      .contains('New Order')
      .eq(0)
      .should('exist')
      .and('be.visible')
      .should('have.attr', 'href', '/booking')
  },
)

Then(
  'Below the New Order button i should see three buttons {string} and {string} and {string} on the page',
  (button1, button2, button3) => {
    cy.get('a.chakra-button')
      .find('p')
      .contains(button1)
      .as('button1')
      .should('exist')
      .and('be.visible')
    cy.get('a.chakra-button')
      .find('p')
      .contains(button2)
      .as('button2')
      .should('exist')
      .and('be.visible')
    cy.get('a.chakra-button')
      .find('p')
      .contains(button3)
      .as('button3')
      .should('exist')
      .and('be.visible')
  },
)

Then(
  'Below the three buttons I should see a search bar with placeholder text {string} in grey color',
  (placeholderText) => {
    cy.get(`input[placeholder*='${placeholderText}']`)
      .as('searchbar')
      .should('exist')
      .and('be.visible')
  },
)

And(
  'Beside the search bar I should see a Date Filter Having Values {string} and {string} and {string} and {string} in dropdown',
  (value1, value2, value3, value4) => {
    cy.get(`@searchbar`)
      .parent()
      .siblings()
      .eq(0)
      .as('filter')
      .should('exist')
      .and('be.visible')

    cy.get('@filter')
      .children()
      .eq(1)
      .find('select.chakra-select')
      .as('select')
      .should('exist')
      .and('be.visible')

    for (const option of [value1, value2, value3, value4]) {
      cy.get('@select').should('contain', option)
    }
  },
)

Then(
  'Below The search bar I should see a table having {string} headers with texts {string}, {string}, {string}, {string}, {string} as headers',
  (numHeaders, header1, header2, header3, header4, header5) => {
    cy.get('table > thead> tr')
      .find('th',{timeout:x6})
      .then((ths) => {
        expect(Cypress.$(ths).length).to.eq(parseInt(numHeaders))
      })

    for (const header of [
      header1,
      header2,
      header3,
      header4,
      header5,
    ]) {
      if (header != '') {
        cy.get('table > thead> tr')
          .find('th')
          .contains(header)
          .should('exist')
          .and('be.visible')
      } else {
        cy.get('table > thead> tr')
          .find('th')
          .last()
          .invoke('text')
          .then((lastThText) => {
            expect(lastThText).to.eq(emptyHeader)
          })
      }
    }
  },
)

And(
  'If there are no records in the table i should see {string} in table',
  (noResultsText) => {
    cy.get('table tbody')
      .its('length')
      .then((length) => {
        if (length === 0) {
          cy.get('table').as('orderTable')
          cy.get('@orderTable')
            .parent()
            .find('p')
            .as('noResultText')
            .contains(noResultsText)
            .should('exist')
            .and('be.visible')
        }
      })
  },
)

And(
  'If there are records i should not see {string} in table',
  (noResultsText) => {
    cy.get('table tbody')
      .find('tr')
      .its('length')
      .then((length) => {
        if (length === 1) {
          cy.get('table').as('orderTable')
          cy.get('@orderTable')
            .parent()
            .parent()
            .get('p')
            .contains(noResultsText)
            .should('exist')
            .and('be.visible')
        }
        if (length > 1) {
          cy.get('table')
            .parent()
            .parent()
            .siblings()
            .last()
            .then(($el) => {
              const tagName = $el.prop('tagName')
              expect(tagName).to.not.equal('P')
            })
        }
      })
  },
)

When('I click on the a row in the table for an order ID', () => {
  cy.readFile('store.txt').then((lastOrderId)=>{  
    cy.get('table.chakra-table', { timeout: 30000 }).as('o_table').then(async ($table) => {
      const hasRows = $table.find('tr').length > 1;          
      if (hasRows) {            
          const lastOrderIdFound = rs2.containsStringInCells($table, lastOrderId);
          if (lastOrderIdFound) {
              cy.get('td').contains(lastOrderId,{timeout:x6}).click()
          } else {
              cy.log("The order ID was not found...")
          }
      } else {
        cy.log("No orders in table")
      }
    })
  })
})

Then('I should see the Order Preview widget', () => { 
  cy.get('h1.chakra-heading')
  .contains('Order Preview',{timeout:x6})
  .should('exist')
  .and('be.visible')
  .parent()
  .parent()
  .should('have.class','chakra-stack')
  .should('have.class','chakra-card')
  .and('be.visible')
  .as('orderPreviewWidget')
})

And('The Order Preview widget should contain {string} {string} {string} and {string} section', (section1,section2,section3,section4) => { 
  [section1,section2,section3,section4].forEach((section)=>{
    cy.get('h2.chakra-heading')
    .contains(section,{timeout:x6})
    .scrollIntoView()
    .should('exist')
    .and('be.visible')
    .parent()
    .should('exist')
    .and('be.visible')
  })
})

And('The Order Preview widget should have a {string} button with background colors {string}', (btnTxt1,bgColor) => { 
  [btnTxt1].forEach((btnTxt)=>{
    if(btnTxt == 'View Order Details'){
      cy.get('@orderPreviewWidget')
      .find('a.chakra-button').as('btn')
    }
    else{
      cy.get('@orderPreviewWidget')
      .find('button.chakra-button')
      .as('btn')
    }
    cy.get('@btn')
    .contains(btnTxt,{timeout:x6})
    .should('exist')
    .and('be.visible')
    .should('have.css','background-color',bgColor)
  })
})


And('The Order Preview widget {string} should contains a Name Label and the name in the Table matches the name on the Label value',
 (section) => { 
  cy.get('h2.chakra-heading')
  .contains(section,{timeout:x6})
  .scrollIntoView()
  .parent().as("section")
  cy.get('@section').find('p.chakra-text').contains('Name')
  .should('exist')
  .and('be.visible')
  .siblings().eq(0).as('customerNameEl')

  cy.readFile('store.txt').then((lastOrderId)=>{  
    cy.get('td').contains(lastOrderId,{timeout:x6})
    .parent()
    .siblings()
    .eq(2)
    .invoke('text')
    .then((name)=>{
      cy.get('@customerNameEl')
      .invoke('text')
      .then((txt)=>{
        expect(txt).to.eq(name)
      })
    })
  })
})

And('The Order Preview widget {string} should contains a Email Label and the Email should be a valid Email Address',
 (section) => { 
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  cy.get('h2.chakra-heading')
  .contains(section,{timeout:x6})
  .scrollIntoView()
  .parent().as("section")
  cy.get('@section').find('p.chakra-text').contains('Email')
  .should('exist')
  .and('be.visible')
  .siblings().eq(0).as('customerEmailEl')
  .invoke('text')
  .then((email)=>{
    expect(emailPattern.test(email)).to.eq(true)
  })
 })


 When('The {string} section in Booking Redemption shows {string} The {string} button does show and Vice Versa',
 (section,status,btnTxt) => { 
  const eitherOr = (status)=>{
    return status == 'Tickets Redeemed' || status == 'Tickets not redeemed'
  }
  cy.get('h2.chakra-heading')
  .contains(section,{timeout:x6})
  .scrollIntoView()
  .parent().as("section")
  cy.get('@section').find('p.chakra-text').contains('Booking Redemption')
  .should('exist')
  .and('be.visible')
  .siblings().eq(0).as('customerStatusEl')
  .invoke('text')
  .then((statusTxt)=>{
    expect(true).to.eq(eitherOr(statusTxt))
    if(statusTxt == 'Tickets Redeemed'){
      cy.get('@orderPreviewWidget')
      .find('button.chakra-button')
      .as('btn')
      cy.get('@btn')
      .contains(btnTxt,{timeout:x6})
      .should('not.exist')
    }
    else{
      cy.get('@orderPreviewWidget')
      .find('button.chakra-button')
      .as('btn')
      cy.get('@btn')
      .contains(btnTxt,{timeout:x6})
      .should('exist')
      .and('be.visible')
    }
  })
 })
