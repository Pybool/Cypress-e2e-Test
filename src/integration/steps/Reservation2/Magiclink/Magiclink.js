
import {
  Given,
  And,
  Then,
  When,
} from 'cypress-cucumber-preprocessor/steps'
import {BASE_URL} from '../../../index'
import {DATA_OBJECT} from '../helpers/datafile'
import * as rs2 from '../../../functions/rs2'
import * as core from '../helpers/core'
var orderObj = {}
const xshortwait = 2000
const shortwait = 5000
const mediumwait = 7000
const longwait = 10000
const xlongwait = 15000
const x6 = 60000
const __force__ = {force:true}
const DATA = {REF:orderObj['orderId']}
var bookingUrls



function toSentenceCase(str) {
  return str.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, (match) => match.toUpperCase());
}

function getMagicLinkToken(url,authToken){
  return fetch(url, {
    headers: {
      'Authorization': authToken
    }
  })
  .then(function(response) {
    if (!response.ok) {
      throw new Error('Request failed with status:', response.status);
    }
    return response.json();
  })
  .then(function(data) {
    return data?.token
  })
  .catch(function(error) {
    console.error('Fetch error:', error);
  });
}


async function getMagicLinkParams(){
  
  const orderId = orderObj['orderId'] || 'ULOBL71Y9VM4Y'
  const url = `https://h01gq57mbd.execute-api.eu-west-1.amazonaws.com/prod/orders/${orderId}`
  return new Promise((resolve, reject)=>{
      cy.window().then(async(win) => {
          const authToken = JSON.parse(win.localStorage.getItem('TICKNOVATE_USER'))?.user.credentials.accessToken
          resolve(await getMagicLinkToken(url,authToken))
      });
  })
}

function visitWithOrder(order){
  if(order == ''){
      order = orderObj['orderId']
  }
  getMagicLinkParams().then((ref)=>{
    DATA.REF = order
      bookingUrls = `https://ullswater.booking.lakedistrict.ticknovate-uat.com/my-bookings/${order}?token=${ref}`
      cy.visit(bookingUrls)
  })
}

Given ('I have created an order as a customer',async ()=>{
  cy.visit('/booking')
  const data = { adults: 2, children: 2, step: '2 adults 2 children' }
  await rs2.startCreateOrder(data.adults, data.children,"Ullswater 'Steamers'")
  rs2.internalCheckOut('Checkout',"Ullswater 'Steamers'")
  

})

Then ('I get the previous order Order ID',async ()=>{
  cy.readFile('store.txt').then((lastOrderId)=>{  
    orderObj['orderId'] = lastOrderId
  })
})


Then ('I should see the {string} button',async (btntxt)=>{
  cy.get('a.chakra-button').contains(btntxt).should('exist')
})

And ('I click the {string} button in my email before 24 hours',async (txt)=>{
  const order = ''
  visitWithOrder(order)
})

And ('I click the {string} button in my email after 24 hours',async (txt)=>{
  const order = ''
  visitWithOrder(order)
})

And ('I click the {string} button in my email after 24 hours for order {string}',async (txt, order)=>{
  visitWithOrder(order)
})


Then ('I should see {string} as a header in the page that loads',async (headerText)=>{
 cy.get('h2.chakra-heading',{timeout:x6})
      .contains(headerText,{timeout:x6})
      .as('header')
      .should('exist')
      .and('be.visible')
})

And ('I should see {string}, {string} and {string} sections under Bookings',async (txt1,txt2,txt3)=>{
  let tag = 'h4.chakra-heading';
  
  [txt1,txt2,txt3].forEach((txt)=>{
      if(txt == 'Total:'){
          tag = 'p.chakra-text'
      }
      cy.get('@header')
      .parent()
      .siblings()
      .eq(0)
      .find(tag)
      .contains(txt)
      .should('exist')
      .and('be.visible')
  })
})

And ('I should not see The Edit button on the Page',async ()=>{
  cy.get(`a[href="/orders/${DATA.REF}/amend"]`).should('not.exist')
})

And ('I should see the {string} dropdown with {string} option',async (dropdown,option)=>{
  cy.get('button.chakra-menu__menu-button')
  .find('span')
  .contains(dropdown)
  .parent()
  .should('exist')
  .and('be.visible')
  .click(__force__)
  
  cy.get('div.chakra-menu__menu-list').as('moreMenuList')
  .should('exist')

  cy.get('@moreMenuList')
  .find('button.chakra-menu__menuitem>span')
  .contains(option)
  .should('exist')
  .and('be.visible')
})

And ('I should see that the QrCode is {string} with {string} Background color',async (expiredTxt,bgColor)=>{
  cy.get('p.chakra-text')
  .contains(expiredTxt)
  .as('expired')
  .should('have.text',expiredTxt)
  .and('be.visible')
  cy.get("@expired").parent().should('have.css', 'background-color',bgColor)
})

And ('I should see {string}, {string} and {string} Accordions',async (section1,section2,section3)=>{
  
})


When('I click {string} dropdown',async(detail)=>{
  let idx = 0
  idx = 1 ? detail == 'Contact Details' : 0
  cy.get('h3.chakra-heading')
  .contains(detail)
  .siblings().eq(0)
  .children().eq(idx)
  .click({force:true})
})

Then('The {string} section displays data consistent with the order created',async(detail)=>{

  let fields = [] 
  let collapseIndex = 0
  let extfield;

  if(detail=='Order Details'){
      collapseIndex = 1
      fields = ['Order Reference','Order Placed'] 
  }

  if(detail == 'Contact Details'){
      fields = ['First Name', 'Last Name', 'Phone', 'Email']
  }

  if(detail == 'Billing Details'){
      collapseIndex = 2
      fields = ['Address Line 1', 'City', 'Post Code', 'Country']
  }

  fields.forEach(async (field)=>{
      let value = ''
      switch(field){
      case 'Order Reference':
          value = DATA.REF
          break;
      case 'Order Placed':
          value = 'Order Placed'
          break;
      case 'Market':
          value = DATA_OBJECT.market
          break;
      case 'Channel':
          value = DATA_OBJECT.Channel
          break;
      case 'Status':
          value = toSentenceCase(window.localStorage.getItem('orderStatus'))
          break;
      case 'Payment Method':
          value = DATA_OBJECT.Payment_Method
          break;
      case 'First Name':
          value = DATA_OBJECT.firstname
          break;
      case 'Last Name':
          value = DATA_OBJECT.lastname
          break;
      case 'Phone':
          value = DATA_OBJECT.telephone
          break;
      case 'Email':
          extfield = 'Email'
          value = DATA_OBJECT.email
          break;
      case 'Address Line 1':
          value = DATA_OBJECT.line_1
          break;
      case 'City':
          value = DATA_OBJECT.town
          break;
      case 'Post Code':
          value = DATA_OBJECT.post_code
          break;
      case 'Country':
          value = DATA_OBJECT.Country_Code
          break;

  }
      if(value != 'Order Placed' && extfield != 'Email'){
          cy.get('div.chakra-collapse')
          .eq(collapseIndex)
          .find('div').contains(field)
          .contains(field)
          .siblings()
          .eq(0)
          .should('have.text', value)
      }

      if(extfield == 'Email'){
          cy.get('div.chakra-collapse')
          .eq(collapseIndex)
          .find('div').contains(field)
          .parent()
          .children()
          .eq(0)
          .siblings()
          .eq(0)
          .should('have.text', value)
      }
      
  })

})


Then ('The magic link takes the customer to the {string} page',async (page)=>{
  cy.get('h1').contains(page,{timeout:x6}).should('exist').and('be.visible')
})

Then ('The order reference {string} is pre-populated',async (reference)=>{
  cy.get('input.chakra-input').eq(0).should('have.value', reference)
})

When ('the {string} button is clicked',async (btntxt)=>{
  cy.get('button.chakra-button').contains(btntxt,{timeout:x6}).click(__force__)
})

Then ('I should see {string} header in the page that loads',async (header)=>{
  cy.get('h1.chakra-heading').contains(header).should('exist').and('be.visible')
})

And ('I should see body text with {string} in the page that loads',async (bodytxt)=>{
  cy.get('p.chakra-text').contains(bodytxt).should('exist').and('be.visible')
})

And ('The customer enters an invalid order reference {string}',async (invalidRef)=>{
  cy.get('input.chakra-input').eq(0).clear().type(invalidRef)
})

Then ('I should see an error alert with title {string} and description {string}',async (title, description)=>{
  cy.get('div.chakra-alert__title').contains(title).should('exist')
  cy.get('div.chakra-alert__desc').contains(description).should('exist')
})

When ('I click the {string} button',async (btntxt)=>{
  if(btntxt=='Edit Order'){
      cy.window().then((win)=>{
          cy.location().should((loc) => {  
              win.localStorage.setItem('url',loc) 
          })               
      })
  }
  cy.get('a.chakra-button').contains(btntxt,{timeout:x6}).click(__force__)
  
})

When ('I click the {string} button on customer portal',async (btntxt)=>{
  cy.get('button.chakra-button').contains(btntxt,{timeout:x6}).click(__force__)
})

Then ('I should be taken to {string} page',async (page)=>{ 
  cy.get('h2.chakra-heading')
  .as('page')
  .should('exist')
  .and('be.visible')
  .invoke('text')
  .then((txt)=>{
      expect(txt).to.include(page)
  })
})

Then ('I should be taken to {string} page',async (page)=>{ 
  cy.get('h2.chakra-heading')
  .as('page')
  .should('exist')
  .and('be.visible')
  .invoke('text')
  .then((txt)=>{
      expect(txt).to.include(page)
      expect(txt).to.include(window.localStorage.getItem('lastOrderID'))
  })
})

And('I should see {string} sections', (sections) => {
  const sectionsList = sections.split(',')
  sectionsList.forEach((section)=>{
      if(section=='Who' || section == 'when'){
          cy.get('button.chakra-button').as('btn')
      }
      else{
          cy.get('button.chakra-menu__menu-button').as('btn')
      }
      cy.get('@btn')
      .find('p')
      .contains(section.trim(),{timeout:x6})
      .should('exist')
      .and('be.visible')
  })
});

And('I should see {string} card which should contain {string} and {string}', (cardName, previousBtn, nextBtn) => {
    cy.get('h2.chakra-heading',{timeout:30000})
    .contains(cardName,{timeout:x6})
    cy.get('button.chakra-button')
    .contains(previousBtn,{timeout:x6})
    .should('exist')
    .and('be.visible')

    cy.get('button.chakra-button')
    .contains(nextBtn,{timeout:x6})
    .should('exist')
    .and('be.visible')
});

When('I proceed to change route by clicking the green swap location toggle', () => {
  cy.get("button[aria-label='Swap Locations']").click()
});


Then ('I should no longer see the {string} Seating Compartments section',async (section)=>{ 
  cy.get('h3.chakra-heading').each(($heading) => {
     const textContent = Cypress.$($heading).text().trim();
     expect(textContent).not.to.eq(section)
  })
})

When('I click the {string} button to return to the Order Page', (btntext) => {
  cy.get("button.chakra-button").contains(btntext,{timeout:x6}).click()
});

When('I edit the {string} section by removing {string}', (section, value) => {
  let vals = value.split('x')
  let number = vals[0].trim()
  let text = vals[1]
  cy.get('div.chakra-card').find('button > p').as("selectedDropdown").contains(section,{timeout:x6}).click(__force__)
  for(let t =0; t<parseInt(number);t++){
      if(text != ''){
          text = text.replace(/,/g, '').trim();
          cy.get('div[id^="disclosure-"]').find('p[class^="chakra-text"]').contains(text,{timeout:x6})
          .parent().parent().siblings().eq(0).as('In')
          cy.get('@In').find('input').invoke('val').then((val)=>{
              if(parseInt(val) > 1){
                  cy.get('@In').find('div[role="button"]').eq(0).as("subBtn").click(__force__)
              }
          })
          
      }
  }

  const filePath = 'cypress/integration/steps/reservation2_tests/OrdersAmendBooking/amendStore.txt';
  cy.writeFile(filePath, 
      {
          'orderId':window.localStorage.getItem('lastOrderID'),
          'data':{
                  'sections':[
                                  {   'sectionName':section,
                                      'actions':['remove'],
                                      'value':[value]
                                  }
                              ]
                 }
      });

});

Then ('I click the Edit Order Button beside More Actions dropdown',async ()=>{
  cy.window().then((win)=>{
      cy.visit(win.localStorage.getItem('url')).then(()=>{
          cy.get('button.chakra-menu__menu-button')
          .find('span',{timeout:x6})
          .contains('More Actions',{timeout:x6})
          .parent()
          .siblings()
          .eq(1).click()
      })
  })
  
})

When('I edit the {string} section by clicking the {string} button', (date,btntxt) => {
  btntxt = 'Previous Day'
  cy.get('button.chakra-button').contains(btntxt,{timeout:x6}).click(__force__)
});

When('I select a time for RES Single Train Ride', (type) => {
  cy.get('h2.chakra-heading')
      .contains('Available Options',{timeout:x6})
      .parent()
      .siblings()
      .eq(1)
      .find('p.chakra-text')
      .eq(0)
      .as('singleTrainRide')

      cy.get('@singleTrainRide')
      .siblings()
      .eq(0)
      .children()
      .eq(1)
      .click({ force: true })
});

Then ('I should see the Add-Ons section at the bottom of the page with atleast one option',async ()=>{ 
  cy.get('h3.chakra-heading')
  .contains('Add-Ons',{timeout:x6})
  .as('addonheader')

  cy.get('@addonheader')
  .parents()
  .each(($parentElement) => {
      cy.wrap($parentElement).invoke('css', 'overflow', 'visible');
  });

  cy.get('@addonheader').should('exist')
  .and('be.visible')

  cy.get('@addonheader').siblings().its('length').then((len)=>{
      expect(len).to.gte(1)
  })
})


When('I select a time for RES Single Train Ride with no Add-Ons', () => {
  cy.get('@singleTrainRideAddon')
  .siblings()
  .eq(2)
  .find('button.chakra-button')
  .eq(1)
  .click(__force__)
});

Then('I should no longer see the Add-Ons section at the bottom of the page', () => {
  cy.get('h3.chakra-heading').each(($heading) => {
      const textContent = Cypress.$($heading).text().trim();
      expect(textContent).not.to.eq('Add-Ons')
   })
});

Then('I select seats in the reservation compartment section', () => {
  core.selectSeats('Who')
});

Then('The {string} Button should be Inactive', (btnText) => {
  cy.get('button.chakra-button').contains(btnText).should('have.attr','disabled')
});

Then('The {string} Button should be Active', (btnText) => {
  cy.get('button.chakra-button').contains(btnText).should('not.have.attr','disabled')
});

Then('I click the checkout Button', (btnText) => {
  cy.get('button.chakra-button')
  .contains(btnText)
  .should('not.have.attr','disabled')
  .click({force:true})
});

When('I am on the Amending Booking page I click cancel order button', async() => {
  cy.get('h2.chakra-heading').invoke('text').then((txt)=>{
      expect(txt).to.include('Amending Booking')
  })
  cy.get('button.chakra-button', { timeout: 60000 }).then(($buttons) => {
      const cancelButton = $buttons.filter(':contains("Cancel order")');
      if (cancelButton.length > 0) {
      cy.wrap(cancelButton)
          .click({ force: true });
      } 
  });
})

Then('I should see {string} with color {string}', async(txt,color) => {
  cy.get('h5.chakra-heading').contains(txt).as('txt').should('be.visible')
  cy.get('@txt').should('have.css','color',color)
})

And('I should see a Refund Button', async() => {
  cy.get('button.chakra-button', { timeout: 30000 })
  .contains('Refund').as('refundBtn')
  .should('exist')
  .and('be.visible')
})

And('I click on the Refund Button', async() => {
  cy.get('@refundBtn')
  .click({ force: true })
})

Then('I should be taken to the Refund page', async() => {
  cy.wait(shortwait)
  cy.get('h3.chakra-heading')
  .contains('Refund options')
  .should('exist')
  .and('be.visible')

  cy.get('button.chakra-button').get('div.chakra-stack')
  .contains('Complete refund')
  .should('exist')
  .and('be.visible')
})

When('I click the {string} Button', async(btnText) => {
  cy.get('button.chakra-button').get('div.chakra-stack')
  .contains(btnText)
  .click()
})


Then('I should see {string} header with color {string} and {string} header', async(val1,val2,val3) => {
  cy.wait(shortwait)
  cy.get('h3.chakra-heading > span').contains(val1).as('cancelledH3').should('be.visible')
  cy.get('@cancelledH3').should('have.css','color',val2)
  cy.get('h5.chakra-heading').contains(val3).should('be.visible')
  cy.wait(shortwait).then(()=>{
      cy.visit('/');
  })
})

Then(
  'The {string} Button should be Active if The Sub Total is negative else the {string} Button should be active where either button is the action button',
  (refund, checkout) => {
    let btnText;
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
          .contains(btnText)
          .should('not.have.attr', 'disabled')
        cy.get('button.chakra-button').contains(btnText).should('be.visible')
      })
  },
)

Then('I click the action button', () => {
  cy.get('button.chakra-button').contains(btnText).click(__force__)
})

Then('I click the {string} button', (btnText) => {
  cy.get('button.chakra-button').contains(btnText).click(__force__)
})

Then('I process a refund or checkout', () => {
  if (btnText == 'Checkout') {
    cy.get('p.chakra-text')
      .contains('Continue to payment',{timeout:x6})
      .parent()
      .parent()
      .click(__force__)
    
    rs2.fillPaymentInformationForm()
  }
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


afterEach(()=>{
  cy.window().then((win) => {
      win.localStorage.clear()
  });
})