import { And, Then, When } from 'cypress-cucumber-preprocessor/steps'
import * as rs2 from '../../../functions/rs2'
import {
  singleAdult,
  fourChildrenThreeAdults,
  twoChildrentwoAdults,
  fourChildrenThreeAdultsClosedCarriage,
  fourChildrenThreeAdultsSemiOpenCarriage,
  fourChildrenThreeAdultsOpenCarriage,
  fourChildrenThreeAdultsAccessibleCarriage
  
} from '../helpers/datafile';

const x6 = 60000

function completeOrderExternal(url, cartToken) {
  cy.request({
    method: 'POST',
    url: url,
    body: {
      key1: 'value1',
      key2: 'value2',
    },
    headers: {
      'Content-Type': 'application/json',
      'cart-token': cartToken,
      Accept: '*/*',
    },
  }).then((response) => {
    expect(response.status).to.equal(200)
    const urlSegments = url.split('/')
    const extractedValue = urlSegments[urlSegments.length - 2]
    rs2.saveToSessionStorage('order_id', extractedValue)
  })
}

function executeFnInWindow() {
  cy.window().then((win) => {
    win.console.defaultLog = win.console.log.bind(console)
    win.console.logs = []
    win.console.log = function () {
      win.console.defaultLog.apply(console, arguments)
      win.console.logs.push(Array.from(arguments))
    }

    win.TICKNOVATE_HOST = {
      externalPayment: true,
      sendMessage: (message) => {
        console.log(message)
      },
      deviceId: 'YOUR_DEVICE_ID',
    }
  })
}

When(
  'I attempt to create an order selecting {string} adult for when choosing who',
  async (number) => {
    await fn(number)
  },
)

When(
  'I attempt to create an order selecting {string} adult and {string} child for when choosing who',
  async (adults, children) => {
    await fn(adults, parseInt(children))
  },
)

And('The {string} button should not be active', async () => {
  cy.get('footer.chakra-modal__footer')
    .find('button')
    .should('have.attr', 'disabled')
})

And('The {string} button should be active', async () => {
  cy.get('footer.chakra-modal__footer')
    .find('button')
    .should('not.have.attr', 'disabled')
})

function clickAddSeatsAndCheckout() {
  cy.get('footer.chakra-modal__footer').find('button').click({ force: true })
  executeFnInWindow()

  
  cy.get('div.chakra-collapse')
    .parent()
    .find('button')
    .contains('Checkout',{timeout:x6})
    .should('exist')
    .click({ force: true })
  
  cy.window().then((win) => {
    const resp = win.console.logs[win.console.logs.length - 1][1]
    const url = resp?.completionUrl
    const cartToken = resp.cart.token
    win.localStorage.setItem('url', url)
    win.localStorage.setItem('cartToken', cartToken)
    completeOrderExternal(url, cartToken)
  })
}

And(
  'The {string} button should be active and i proceed to checkout',
  async () => {
    cy.get('footer.chakra-modal__footer')
      .find('button')
      .should('not.have.attr', 'disabled')
    clickAddSeatsAndCheckout()
  },
)

And(
  'The {string} button should be active and i proceed to checkout internally',
  async (button) => {
    rs2.internalCheckOut(button)
  },
)

Then(
  'The {string} pill is displayed in the select reservation modal with {string} selected',
  async (type, selectedComp) => {
    const number = '4'
    
    cy.get('h3.chakra-heading')
      .contains(Cypress.env('product'),{timeout:x6})
      .parent()
      .siblings()
      .eq(0)
      .children()
      .eq(2)
      .click({ force: true })
    
    cy.get('div.chakra-button__spinner')
      .should('not.exist',{timeout:x6})
      .then(()=>{
        cy.get('button.chakra-button')
        .should('be.enabled')
        .contains('Add To Cart',{timeout:x6})
        .should('not.have.attr','disabled',{timeout:x6})
        .click({force:true})
      })

    if (parseInt(number) >= 4) {
      cy.get('button.chakra-tabs__tab').contains(type,{timeout:x6}).as('selected')

      cy.get('@selected').scrollIntoView()
      cy.get('@selected').should('exist').and('be.visible')
      cy.get('@selected').should('have.attr', 'aria-selected', 'true')
      cy.get('button.chakra-tabs__tab')
        .contains(selectedComp)
        .click({ force: true })
      cy.get('button.chakra-tabs__tab')
        .contains(selectedComp)
        .should('have.attr', 'aria-selected', 'true')
    }
  },
)

And('I click The {string} button', async (button) => {
  cy.get('div.chakra-tabs__tab-panels')
    .find('p')
    .contains(button)
    .parent()
    .parent()
    .click({ force: true })
})

async function fn(number, secondchoice = 0) {
  await rs2.startCreateOrder(number, secondchoice)
}

function selectSeatsByCompartments(initialIndex,compartments){
  cy.log('Retrying compartment selection with index ', initialIndex)
  cy.get('button.chakra-tabs__tab').contains(compartments[initialIndex].name,{timeout:x6}).as('selected').scrollIntoView().should('exist').and('be.visible')
  cy.get('@selected').click({force:true})
  cy.get('@selected').should('have.attr', 'aria-selected', 'true')
  cy.get('div.chakra-modal__body').find('div.chakra-tabs__tablist')
    .eq(compartments[initialIndex].index+1).as('comps')
    .children().then((comp)=>{
      Cypress.$(comp)[0].click()
      cy.wrap(Cypress.$(comp)[0]).should('have.attr', 'aria-selected', 'true')
  })
}

function findButtonsAndClick(initialIndex, compartments) {
  selectSeatsByCompartments(initialIndex,compartments)
  cy.get('@comps').siblings().eq(0).then(($siblings) => {
    const $buttons = Cypress.$($siblings).find('button');

    if ($buttons.length > 0) {
      Cypress.$($buttons[0]).click();
      cy.wrap(Cypress.$($buttons[0])).should('have.css', 'background-color', 'rgb(15, 28, 42)');
    } else {
      cy.log('No buttons found.');

      if (initialIndex < compartments.length - 1) {
        initialIndex = initialIndex + 1;
        findButtonsAndClick(initialIndex, compartments);
      }
    }
  });
}

function getCompartmentAvailable(step){
  const matchPill = []
  return new Promise((resolve, reject)=>{
    cy.get('div.chakra-modal__body').find('div.chakra-tabs__tablist').eq(0).children().then((compartments)=>{
      const pills = Array.from(Cypress.$(compartments))
      for (let i=0; i < pills.length; i++){
        if(step == '2 adults 2 children' && pills[i].innerText.includes('4-')){
          matchPill.push({name:pills[i].innerText,index:i})
        }
        if (step.includes('3 adults 3 children') && pills[i].innerText.includes('6-')){
          matchPill.push({name:pills[i].innerText,index:i})
        }
      }
      compartments = matchPill
      cy.window().then((win)=>{
        win.localStorage.setItem('compartments',JSON.stringify(compartments))
      })
      resolve(matchPill)
    })
  })
}

Then('For {string} I select the needed compartments and choose appropriate seats for each respectively',(step)=>{
  const keyVals = {
              '1 adults 0 children':singleAdult,
              '3 adults 3 children':fourChildrenThreeAdults,
              '2 adults 2 children':twoChildrentwoAdults,
              '3 adults 3 children in closed carriages':fourChildrenThreeAdultsClosedCarriage,
              '3 adults 3 children in semi-open carriages':fourChildrenThreeAdultsSemiOpenCarriage,
              '3 adults 3 children in open carriages':fourChildrenThreeAdultsOpenCarriage,
              '3 adults 3 children in Accessible carriages':fourChildrenThreeAdultsAccessibleCarriage
              }
      for(let i=0 ; i < 1;i++){
          cy.get('button.chakra-button').contains('Next Day',{timeout:x6}).click({force:true})
      }
      cy.get('h3.chakra-heading').contains(Cypress.env('product'),{timeout:x6}).parent().siblings().eq(0).children().eq(1).click({force:true})
      
      cy.get('div.chakra-button__spinner')
      .should('not.exist',{timeout:x6})
      .then(()=>{
        cy.get('button.chakra-button')
        .should('be.enabled')
        .contains('Add To Cart',{timeout:x6})
        .should('not.have.attr','disabled',{timeout:x6})
        .click({force:true})
      })

      getCompartmentAvailable(step)
      cy.window().then((win)=>{
        const compartments = JSON.parse(win.localStorage.getItem('compartments'))
        for(let i = 0; i < keyVals[step].selections.length; i++){
          let initialIndex = 0
          findButtonsAndClick(initialIndex, compartments)
        }  
      })
})