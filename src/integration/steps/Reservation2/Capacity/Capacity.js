const { When, And } = require('cypress-cucumber-preprocessor/steps')
import * as rs2 from '../../../functions/rs2'
const x6 = 60000

function containsNumber(str) {
  return /\d/.test(str)
}

function isNumberFirst(str) {
  return /^\d/.test(str)
}

function selectAllForEachTab(capacity,partial = false, data = {}) {
  console.log(capacity)
  cy.get('div.chakra-tabs__tablist').eq(0).children().as('selected')
  cy.get('@selected').contains(capacity.trim().split(' - ')[0],{timeout:x6})
  .as('capacityCompartment')
  cy.get('@capacityCompartment').click().then((sel)=>{
    const idx = parseInt(Cypress.$(sel).prop('id').split('--tab-')[1])
    console.log("@node index ===> ", idx)
    cy.get('div.chakra-tabs__tab-panels')
    .eq(0)
    .children()
    .eq(idx)
    .find('div.chakra-tabs')
    .children()
    .as('nodes')
    .eq(0)
    .children()
    .then((tabs) => {
      console.log(`Tabs for ${idx} `, Array.from(Cypress.$(tabs)))
      if (!partial) {
        
        for (let i = 0; i < Array.from(Cypress.$(tabs)).length; i++) {
          cy.wait(4000)
          Array.from(Cypress.$(tabs))[i].click()
          cy.get('@nodes')
            .eq(1)
            .children()
            .eq(i)
            .children()
            .eq(0)
            .children()
            .each((el, index) => {
              let bgColor = Cypress.$(el).css("background-color");
              console.log(bgColor)
              if (bgColor == 'rgb(210, 210, 210)'){
                cy.wrap(el).click({ force: true })
              }
            })
        }
      } 
      else {
        data = data.replaceAll('(', '').replaceAll(')', '')
        console.log("Partial ran",Array.from(data.split('and')))
        for (let i = 0; i < Array.from(data.split('and')).length; i++) {
          cy.wait(3000)
          if (containsNumber(Array.from(data.split('and'))[i].trim())) {
            console.log("Dont run ")
            if (isNumberFirst(Array.from(data.split('and'))[i].trim())) {
              cy.get('@nodes')
                .eq(1)
                .children()
                .eq(i)
                .children()
                .eq(0)
                .children()
                .eq(0)
                .then((seats) => {
                  console.log("Seats to click ==> ", seats)
                  Array.from(Cypress.$(seats)).forEach((seat) => {
                    seat.click()
                  })
                })
            }
          } else {
            cy.get('@nodes')
              .eq(0).scrollIntoView()
              .find('button',{timeout:x6})
              .contains(Array.from(data.split('and'))[i].trim(),{timeout:x6})
              .click()
            console.log("click section")

            cy.get('@nodes')
              .eq(1)
              .children()
              .eq(i)
              .children()
              .eq(0)
              .children()
              .each((el, index) => {
                let bgColor = Cypress.$(el).css("background-color");
                console.log(bgColor)
                if (bgColor == 'rgb(210, 210, 210)'){
                  cy.wrap(el).click({ force: true })
                }
              })
          }
        }
      }
    })
  })
    

    
}

When('I select and input in the following fields:', (dataTable) => {
  const data = dataTable.hashes()[0]
  rs2.cancelLastOrder()
  rs2.startCreateOrderInLine(data)
})

And('I select the {string} option', (time) => {
  selectTime(time)
})

When('I click {string} button', (cartTxt) => {
  cy.get('div.chakra-button__spinner')
      .should('not.exist',{timeout:x6})
      .then(()=>{
        cy.get('button.chakra-button')
        .should('be.enabled')
        .contains(cartTxt,{timeout:x6})
        .should('not.have.attr','disabled',{timeout:x6})
        .click({force:true})
  })
})

When('I click the {string} button', (cartTxt) => {
  cy.get('button').contains(cartTxt).click({ force: true })
})

Then('I click the the refund or checkout button', () => {
  cy.get('h5.chakra-heading').contains('Total:').parent().parent().find('button').eq(0).click({ force: true })
})

And('I select the following options from the Cart:', (dataTable) => {
  const data = dataTable.hashes()[0]
  console.log(data['Accessibility carriage'].split(','))
  for (let capacity of data['Accessibility carriage'].split(',')) {
    cy.get('div.chakra-tabs__tablist').eq(0).children().as('selected')
    cy.get('@selected').contains(capacity.trim().split(' - ')[0],{timeout:x6}).as('compartment')
    
    cy.get('@compartment').scrollIntoView()
    cy.get('@compartment').should('exist').and('be.visible')

    cy.get('@compartment').click({ force: true })
    cy.get('@compartment').should('have.attr', 'aria-selected', 'true')
  }

  data['Accessibility carriage'].split(',').forEach((capacity, index) => {
    if (
      capacity.trim().includes('Carriage') ||
      capacity.trim().includes('All')
    ) {
      if (capacity.trim().includes('Carriage')) {
        const carriages = capacity.split(' - ')[1];
  
        selectAllForEachTab(capacity, true, carriages);
      } else if (capacity.trim().includes('All')) {
        selectAllForEachTab(capacity);
      }
    }
  });
  
})

And('I complete the checkout process', () => {
  rs2.internalCheckOut()
})

And(
  'the following options should not be available for purchase:',
  (dataTable) => {
    cy.visit('/booking').then(() => {
      const dataComp = dataTable.hashes()[0]
      const data = {
        MARKET: 'Ravenglass',
        FROM: 'Ravenglass station',
        TO: 'Dalegarth station',
        WHO: '40x Adult',
        WHEN: '90 Days from today',
      }
      rs2.startCreateOrderInLine(data)
      selectTime('15:10')
      cy.contains('Add To Cart',{timeout:x6}).click()
      for (const capacity of dataComp['Accessibility carriage'].split(',')) {
        cy.get('button.chakra-tabs__tab').contains(capacity.trim().split(' - ')[0],{timeout:x6})
        cy.get('@selected').should('not.exist').and('be.visible')
      }
    })
  },
)

And('the following options should be available for purchase:', (dataTable) => {
  cy.visit('/booking').then(() => {
    const dataComp = dataTable.hashes()[0]
    const data = {
      MARKET: 'Ravenglass',
      FROM: 'Ravenglass station',
      TO: 'Dalegarth station',
      WHO: '40x Adult',
      WHEN: '90 Days from today',
    }
    rs2.startCreateOrderInLine(data)
    selectTime('15:10')

    cy.contains('Add To Cart').click()

    for (const capacity of dataComp['Accessibility carriage'].split(',')) {
      cy.get('button.chakra-tabs__tab').contains(capacity.trim().split(' - ')[0],{timeout:x6}).as('selected')
      cy.get('@selected').scrollIntoView()
      cy.get('@selected').should('exist').and('be.visible')

      cy.get('@selected').click({ force: true })
      cy.get('@selected').should('have.attr', 'aria-disabled', 'false')
    }
  })
})

function selectTime(time) {
  cy.contains(time,{timeout:x6}).click({ force: true })
}

And('I have an order for 40 Adults with the following seat selection:', () => {
  cy.readFile('store.txt').then((lastOrderId) => {
    cy.visit(`/orders/${lastOrderId}/amend`)
  })
})

When('I reduce the group size to {string} Adults', (num) => {
  cy.get('div.chakra-card', { timeout: 30000 })
    .find('button > p')
    .as('selectedDropdown')
    .contains('Who',{timeout:x6})
    .as('whobtn')
    .click({ force: true })

  cy.get('div[id^="disclosure-"]').as('selected')
  cy.get('@selected')
    .find('p.chakra-text')
    .contains('Adult')
    .parent()
    .parent()
    .siblings()
    .eq(0)
    .find('input')
    .as('selectedChild')
  cy.get('@selectedChild').clear()
  cy.get('@selectedChild').type(num)

  rs2.selectDate()
  selectTime('15:10')
})

And('I select the {string} compartment option', (compartment) => {

  cy.get('button.chakra-tabs__tab').contains(compartment,{timeout:x6}).as('selected')
  cy.get('@selected').scrollIntoView()
  cy.get('@selected').should('exist').and('be.visible')
  cy.get('@selected').click({ force: true })
  cy.contains('Sit anywhere').click({ force: true })
})

And('I process a refund or checkout', () => {
  const btnText = 'Refund'
  if (btnText == 'Checkout') {
    cy.get('p.chakra-text')
      .contains('Complete refund',{timeout:x6})
      .parent()
      .parent()
      .click()
    rs2.fillPaymentInformationForm()
  } else {
    cy.get('p')
      .contains('Complete refund',{timeout:x6})
      .parent()
      .parent()
      .click({ force: true })
  }
})

And('The {string} compartment should not be available', (compartment) => {
  cy.get('button.chakra-tabs__tab').contains(compartment,{timeout:x6}).as('selected')
  cy.get('@selected').scrollIntoView()
  cy.get('@selected').should('exist').and('be.visible')
  cy.get('@selected').click({ force: true })
  cy.get('@selected').should('not.have.attr', 'aria-disabled', 'true')
})

