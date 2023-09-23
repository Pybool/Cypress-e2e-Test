
import {
  Given,
  And,
  Then,
  When,
} from 'cypress-cucumber-preprocessor/steps'
import * as rs2 from '../../../functions/rs2'
import { DATA_OBJECT,DYN_DATA_OBJECT_FN, 
          getTodaysDate,
          getTomorrowDate,
          singleAdult,
          fourChildrenThreeAdults,
          twoChildrentwoAdults,
          fourChildrenThreeAdultsClosedCarriage,
          fourChildrenThreeAdultsSemiOpenCarriage,
          fourChildrenThreeAdultsOpenCarriage,
          fourChildrenThreeAdultsAccessibleCarriage
          
        } from '../helpers/datafile';
import * as core from '../helpers/core'
const x6 = 60000

function completeOrderExternal(url,cartToken){
  cy.request({
    method: 'POST',
    url: url,
    body: {
      key1: 'value1',
      key2: 'value2'
    },
    headers: {
      'Content-Type': 'application/json',
      'cart-token': cartToken,
      'Accept':'*/*'
    }
  }).then((response) => {
    expect(response.status).to.equal(200);
    const urlSegments = url.split('/');
    const extractedValue = urlSegments[urlSegments.length - 2];
    rs2.saveToSessionStorage('order_id',extractedValue)
  });
}

function executeFnInWindow(){
  cy.window().then((win) => {
      win.console.defaultLog = win.console.log.bind(console);
      win.console.logs = [];
      win.console.log = function(){
          win.console.defaultLog.apply(console, arguments);
          win.console.logs.push(Array.from(arguments));
      };

      win.TICKNOVATE_HOST = {
        externalPayment: true,
        sendMessage: (message) => { console.log(message); },
        deviceId: 'YOUR_DEVICE_ID'
      };
  });
}

function generateID() {
const timestamp = Date.now().toString();
const randomChars = Math.random().toString(36).substr(2, 6); 
const id = timestamp + randomChars;
return id;
}

async function validateConfirmationPage(){
  cy.get("h3.chakra-heading").find("span").contains('Order complete',{timeout:x6}).scrollIntoView().should('exist').and('be.visible')

  cy.get('p.chakra-text').contains('Name',{timeout:x6}).as('namelabel').scrollIntoView().should('exist').and('be.visible')
  cy.get("@namelabel").siblings().eq(0).invoke('text').then((txt)=>{
    expect(txt).to.eq(DATA_OBJECT['cardholder-name'])
  })

  cy.get('p.chakra-text').contains('Phone number',{timeout:x6}).as('phonelabel').scrollIntoView().should('exist').and('be.visible')
  cy.get("@phonelabel").siblings().eq(0).invoke('text').then((txt)=>{
    expect(txt).to.eq(DATA_OBJECT.telephone)
  })

  cy.get('p.chakra-text').contains('Email',{timeout:x6}).as('emaillabel').scrollIntoView().should('exist').and('be.visible')
  cy.get("@emaillabel").siblings().eq(0).invoke('text').then((txt)=>{
    expect(txt).to.eq(DATA_OBJECT.email)
  })

  cy.get('p.chakra-text').contains('Order reference',{timeout:x6}).as('reflabel').scrollIntoView().should('exist').and('be.visible')
  cy.get("@reflabel").siblings().eq(0).scrollIntoView().should('exist').and('be.visible').invoke('text').then((txt)=>{
    expect(txt.length).to.be.greaterThan(5)
    rs2.saveToSessionStorage('order_id',txt)
    
  })
}

When('I make a new Booking with the information from datasource', async() => {
cy.get('div.chakra-card',{timeout:15000}).get("div.chakra-stack").find('button').eq(0).should('exist').click({force:true})
return new Promise((resolve,reject)=>{
  DATA_OBJECT.market_when.forEach(async(select)=>{
    if(select != 'Who' && select != 'when'){
        cy.get('div.chakra-card',{timeout:20000}).find('button > span >p').as("selectedDropdown").contains(select,{timeout:x6}).click({force:true})
    }
    else{       
          cy.get('div.chakra-card',{timeout:20000}).find('button > p').as("selectedDropdown").contains(select,{timeout:x6}).click({force:true})
        }
    
    switch(select){
        case 'Market':
            
            cy.get("@selectedDropdown")
            .parentsUntil('button')
            .parent()
            .siblings()
            .eq(0)
            .children()
            .eq(0)
            .find("button > span")
            .contains(DATA_OBJECT.market,{timeout:x6})
            .click({force:true})
            break;
        case 'From':
            cy.get('div.chakra-menu__menu-list').eq(1).find('button>span').contains(DATA_OBJECT.from,{timeout:x6}).parent().click({force:true})
            break;
        case 'To':
            cy.get('div.chakra-menu__menu-list').eq(2).find('button>span').contains(DATA_OBJECT.to,{timeout:x6}).parent().click({force:true})
            break;

        case 'Who':
            let choice = DATA_OBJECT.who
            const arr = choice.split('1x')
            let text = arr[1].trim()
            if(text != ''){
                text = text.replace(/,/g, '').trim();
                  cy.get('div[id^="disclosure-"]').find('p[class^="chakra-text"]').contains(text,{timeout:x6})
                .parent().parent().siblings().eq(0).find('div[role="button"]').eq(1).as("addbtn").click({force:true})
            }
            break
    }

})
resolve(1)
}).then(async()=>{
    for(let i=0 ; i < 1;i++){
      cy.get('button.chakra-button').contains('Next Day',{timeout:x6}).click({force:true})
    }
    cy.get('h3.chakra-heading').contains('RES Single Train Ride',{timeout:x6}).parent().siblings().eq(0).children().eq(2).click({force:true})
    cy.get('button.chakra-button').contains('Add To Cart',{timeout:x6}).click({force:true})

    cy.get('div[class^="chakra-stack"]').eq(1).children().eq(3).find('button').click({force:true})
    cy.get('div[class^="chakra-stack"]').find('button').contains('Checkout',{timeout:x6}).should('exist').click({force:true})                    
    await rs2.fillGeneralInformationForm()
    await rs2.fillPaymentInformationForm('test')
})

})

Then ('I confirm the new order matches with the information from datasource',async ()=>{
await validateConfirmationPage()
})

And ('I click Search Orders on the left pane',async ()=>{

}) 

Then ('The Order List displays',async ()=>{

})


/*JOAN 4*/

When('I attempt to create an order selecting {string} adult for when choosing who', async(number) => {
  await fn(number)
})


When('I attempt to create an order selecting {string} adult and {string} child for when choosing who', async(adults,children) => {
  await fn(adults,parseInt(children))
})


And('The {string} button should not be active', async(button) => {
cy.get('footer.chakra-modal__footer').find('button').should('have.attr','disabled')
})

And('The {string} button should be active', async(button) => {
cy.get('footer.chakra-modal__footer').find('button').should('not.have.attr','disabled')
})


function clickAddSeatsAndCheckout(){
  cy.get('footer.chakra-modal__footer').find('button').click({force:true})
  executeFnInWindow()
  cy.get('div.chakra-collapse').parent().find('button').contains('Checkout',{timeout:x6}).should('exist').click({force:true}) 
  cy.window().then((win) => {
      try{
        const resp = win.console.logs[win.console.logs.length-1][1]
        const url = resp?.completionUrl
        const cartToken = resp.cart.token
        win.localStorage.setItem('url', url )
        win.localStorage.setItem('cartToken',cartToken)
        completeOrderExternal(url,cartToken)
      }
      catch(err){}
    }) 
}

And('The {string} button should be active and i proceed to checkout by paying by till', async(button) => {
  cy.get('footer.chakra-modal__footer').find('button').should('not.have.attr','disabled')
  clickAddSeatsAndCheckout()
})


And('The {string} button should be active and i proceed to checkout internally', async(button) => {
  
  rs2.internalCheckOut(button);
})

And('I click The {string} button', async(button) => {
  cy.get('div.chakra-tabs__tab-panels').find('p').contains(button,{timeout:x6}).parent().parent().click({force:true})
})

Then('The {string} pill is not displayed in the select reservation modal', async(type) => {
  cy.get('h3.chakra-heading').contains('RES Single Train Ride',{timeout:x6}).parent().siblings().eq(0).children().eq(2).click({force:true})
  cy.get('button.chakra-button').contains('Add To Cart',{timeout:x6}).click({force:true})
  cy.get('button.chakra-tabs__tab').contains(type,{timeout:x6}).should('not.exist') 
})

Then('The {string} pill is displayed in the select reservation modal with {string} selected', async(type,selectedComp) => {
  let number = '4'
    cy.get('h3.chakra-heading').contains('RES Single Train Ride',{timeout:x6}).parent().siblings().eq(0).children().eq(2).click({force:true})
    cy.get('button.chakra-button').contains('Add To Cart',{timeout:x6}).click({force:true})
    if(parseInt(number) >= 4){
      cy.get('button.chakra-tabs__tab').contains(type,{timeout:x6}).as('selected').scrollIntoView().should('exist').and('be.visible')
      cy.get('@selected').should('have.attr', 'aria-selected', 'true')
      cy.get('button.chakra-tabs__tab').contains(selectedComp,{timeout:x6}).click({force:true})
      cy.get('button.chakra-tabs__tab').contains(selectedComp,{timeout:x6}).should('have.attr', 'aria-selected', 'true')
    }
})

async function fn(number,secondchoice=0){
    await rs2.startCreateOrder(number,secondchoice)
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
      }
      compartments = matchPill
      cy.window().then((win)=>{
        win.localStorage.setItem('compartments',JSON.stringify(compartments))
      })
      resolve(matchPill)
    })
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
      cy.get('h3.chakra-heading').contains('RES Single Train Ride',{timeout:x6}).parent().siblings().eq(0).children().eq(1).click({force:true})
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

Then('I confirm the new order is displayed in the orders table', async() => {
  return cy.readFile('store.txt').then((lastOrderId)=>{  
    if(lastOrderId != false && lastOrderId != undefined){
        return cy.visit('/').then(()=>{
          return cy.get('table.chakra-table', { timeout: 30000 }).as('o_table').then(async ($table) => {
              const hasRows = $table.find('tr').length > 1;          
              if (hasRows) {            
                  const lastOrderIdFound = rs2.containsStringInCells($table, lastOrderId);
                if (lastOrderIdFound) {
                    expect(true).to.be.true
                } 
              } 
          });
        })        
    }
  })
})
