import {
  DATA_OBJECT,
  DYN_DATA_OBJECT_FN,
  ULLS_DYN_DATA_OBJECT_FN,
  twoChildrentwoAdults,
  fourChildrenThreeAdults,
  fourChildrenThreeAdultsClosedCarriage,
  fourChildrenThreeAdultsSemiOpenCarriage,
  fourChildrenThreeAdultsOpenCarriage,
  fourChildrenThreeAdultsAccessibleCarriage,
  getFutureDate,
} from '../steps/Reservation2/helpers/datafile'
import { BASE_URL } from '../index'
const x6 = 60000

function resetAndClick(text,number){
  cy.get('div[id^="disclosure-"]').find('p[class^="chakra-text"]').contains(text)
  .parent().parent().siblings().eq(0).find('input').as('input').invoke('val').then((txt)=>{
      if(txt != '0'){
          for(let i=0; i < parseInt(txt); i++){
              cy.get('div[id^="disclosure-"]').find('p[class^="chakra-text"]').contains(text)
              .parent().parent().siblings().eq(0).find('div[role="button"]').eq(0).click({force:true})
          }
          window.sessionStorage.removeItem('bookingFlowState')
      }
  })

  for(let t =0; t<parseInt(number);t++){
      if(text != ''){
          text = text.replace(/,/g, '').trim();
          cy.get('div[id^="disclosure-"]').find('p[class^="chakra-text"]').contains(text)
          .parent().parent().siblings().eq(0).find('div[role="button"]').eq(1).as("addbtn").click({force:true})
      }
  }
}

export function saveToSessionStorage(key, value) {
  const filePath = 'store.txt'
  cy.writeFile(filePath, value)
}

export function containsStringInCells($table, searchString) {
  let found = false
  $table.find('td').each((index, cell) => {
    const cellText = Cypress.$(cell).text()
    if (cellText.includes(searchString)) {
      found = true
      return false
    }
  })
  return found
}

async function cancelOrderFn(lastOrderId, amend) {
  cy.readFile('store.txt').then((content) => {
      cy.get('table.chakra-table', { timeout: 20000 })
      .find('tr > td')
      .contains(content)
      .parent()
      .children()
      .as('tds')
      .last()
      .as('last')

      return cy.get('@tds')
        .eq(1)
        .invoke('text')
        .then((txt) => {
          if (txt == 'ordered') {
            if (amend) {
              return new Promise((resolve) => {
                cy.get('@lastTd').eq(0).click({ force: true })
                window.localStorage.setItem('actionType', 'view')
                resolve('view')
              })
            } else {
              cy.visit(`/orders/${lastOrderId}/amend`).then(() => {
                cy.get('button.chakra-button')
                .contains('Cancel order',{timeout:x6})
                .should('exist').and('be.visible')
                .and('have.css','background-color','rgb(239, 211, 204)')
                .click({force:true})

    
                cy.get('button.chakra-button', { timeout: 30000 })
                  .contains('Refund',{timeout:x6})
                  .click({ force: true })
                  
                cy.get('button.chakra-button')
                  .get('div.chakra-stack')
                  .contains('Complete refund',{timeout:x6})
                  .click()
                cy.visit('/booking')
              })
            }
          } else {
            return new Promise((resolve) => {
              cy.visit('/booking')
              window.localStorage.setItem('actionType', 'new')
              resolve('new')
            })
          }
      })
  })
}

export async function cancelLastOrder(amend = false) {
  return cy.readFile('store.txt').then((lastOrderId) => {
    if (lastOrderId != false && lastOrderId != undefined) {
      return cy.url().then(async (currentUrl) => {
        const orderUrl = Cypress.config('baseUrl', BASE_URL['rs2']['uat']) + '/'
        if (currentUrl !== orderUrl) {
          return cy.visit('/').then(() => {
            return cy
              .get('table.chakra-table', { timeout: 30000 })
              .as('o_table')
              .then(async ($table) => {
                const hasRows = $table.find('tr').length > 1
                if (hasRows) {
                  const lastOrderIdFound = containsStringInCells(
                    $table,
                    lastOrderId,
                  )
                  if (lastOrderIdFound) {
                    Cypress.config()['exists'] = 'exists'
                    cancelOrderFn(lastOrderId, amend).then(() => {
                      cy.log(
                        'ACTION 1: ' +
                          window.localStorage.getItem('actionType'),
                      )
                    })
                  } else {
                    window.localStorage.setItem('actionType', 'new')
                    cy.visit('/booking')
                  }
                }
              })
          })
        }
      })
    }
  })
}

export function startCreateOrder(number, secondchoice,market='') {
  let dataObject  = DYN_DATA_OBJECT_FN('who', number)
    if (market == "Ullswater 'Steamers'"){
      dataObject =  ULLS_DYN_DATA_OBJECT_FN('who', number)
    }
  cy.get('div.chakra-card', { timeout: 30000 })
  .get('div.chakra-stack')
  .find('button')
  .eq(0)
  .should('exist')
  .click({ force: true })
  if(market != ''){
    cy.get('span')
    .contains(market,{timeout:x6})
    .click({force:true})
  }
  

  return new Promise((resolve) => {
    
    dataObject.market_when.forEach(async (select) => {
      if (select != 'Who' && select != 'when') {
        if (select == 'Market') {
          cy.get('div.chakra-card', { timeout: 30000 })
            .find('button > span >p')
            .as('selectedDropdown')
            .eq(0)
            .click({ force: true })

        } else {
          cy.get('div.chakra-card', { timeout: 30000 })
            .find('button > span >p')
            .as('selectedDropdown')
            .contains(select,{timeout:x6})
            .click({ force: true })
        }
      } else {
        cy.get('div.chakra-card', { timeout: 30000 })
          .find('button > p')
          .as('selectedDropdown')
          .contains(select,{timeout:x6})
          .click({ force: true })
      }

      switch (select) {
        case 'From':
          cy.get('div.chakra-menu__menu-list')
            .eq(1)
            .find('button>span')
            .contains(dataObject.from,{timeout:x6})
            .parent()
            .click({ force: true })
          break
        case 'To':
          cy.get('div.chakra-menu__menu-list')
            .eq(2)
            .find('button>span')
            .contains(dataObject.to,{timeout:x6})
            .parent()
            .click({ force: true })
          break
        case 'Who':
          {
            const choice = dataObject.who.replaceAll('2', String(number))
            let arr
            let text

            if (secondchoice != 0) {
              const choices = [`${number}x Adult`, `${number}x Child`]
              for (let choiceidx = 0; choiceidx < choices.length; choiceidx++) {
                arr = choices[choiceidx].split(`${number}x`)
                text = arr[1].trim()
                resetAndClick(text,number)
              }
            } else {
              arr = choice.split(`${number}x`)
              text = arr[1].trim()
              resetAndClick(text,number)
            }
          }
          break
      }
    })
    resolve(1)
  }).then(async () => {
    for (let i = 0; i < 2; i++) {
      cy.get('button.chakra-button').contains('Next Day',{timeout:x6}).click({ force: true })
    }

    
    cy.get('h2.chakra-heading')
      .contains('Available Options',{timeout:x6})
      .parent()
      .siblings()
      .eq(1)
      .find('h3')
      .eq(0)
      .as('singleTrainRide')
      .parent()
      .parent()
      .siblings()
   
      
      cy.get('@singleTrainRide')
      .parent()
      .siblings()
      .eq(0)
      .children()
      .eq(1)
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
  })
}

export function startCreateOrderInLine(data) {
  cy.get('div.chakra-card', { timeout: 30000 })
    .get('div.chakra-stack')
    .find('button > span')
    .contains(data.MARKET,{timeout:x6})
    .should('exist')
    .click({ force: true })

  cy.get('div.chakra-menu__menu-list')
    .eq(1)
    .find('button>span')
    .contains(data.FROM,{timeout:x6})
    .parent()
    .click({ force: true })

  cy.get('div.chakra-menu__menu-list')
    .eq(2)
    .find('button>span')
    .contains(data.TO,{timeout:x6})
    .parent()
    .click({ force: true })

  const whoData = data.WHO.split('x')
  const whocount = parseInt(whoData[0].trim())

  if (whoData[1].trim() != '') {
    const text = whoData[1].trim()
    cy.get('div.chakra-card', { timeout: 30000 })
      .find('button > p')
      .as('selectedDropdown')
      .contains('Who',{timeout:x6})
      .as('whobtn')
      .click({ force: true })

    cy.get('div[id^="disclosure-"]')
      .find('p.chakra-text')
      .contains(text,{timeout:x6})
      .parent()
      .parent()
      .siblings()
      .eq(0)
      .find('input')
      .type(whocount)

    cy.get('@whobtn').click({ force: true })
  }
  selectDate()
}

export function selectCompartments(step) {
  const keyVals = {
    '3 adults 4 children': fourChildrenThreeAdults,
    '2 adults 2 children': twoChildrentwoAdults,
    '3 adults 4 children in closed carriages':
      fourChildrenThreeAdultsClosedCarriage,
    '3 adults 4 children in semi-open carriages':
      fourChildrenThreeAdultsSemiOpenCarriage,
    '3 adults 4 children in open carriages':
      fourChildrenThreeAdultsOpenCarriage,
    '3 adults 4 children in Accessible carriages':
      fourChildrenThreeAdultsAccessibleCarriage,
  }

  cy.get('h3.chakra-heading')
    .contains('Single train ride',{timeout:x6})
    .as('singleTrainRide')
    .parent()
    .parent()
    .siblings()
    .its('length')
    .then((len) => {
      if (len == 2) {
        cy.get('@singleTrainRide')
          .parent()
          .siblings()
          .eq(0)
          .children()
          .eq(1)
          .click({ force: true })
      } else if (len == 3) {
        cy.get('@singleTrainRide')
          .parent()
          .parent()
          .siblings()

          .eq(2)
          .find('h3.chakra-heading')
          .contains('Single train ride',{timeout:x6})
          .parent()
          .siblings()
          .eq(0)
          .children()
          .eq(1)
          .click({ force: true })
      }
    })

  cy.get('button.chakra-button')
    .contains('Add To Cart',{timeout:x6})
    .click({ force: true })
  for (let i = 0; i < keyVals[step].selections.length; i++) {
    cy.get('button.chakra-tabs__tab').as('selected')
    cy.get('selected')
      .should('exist')
      .and('be.visible')
      .contains(keyVals[step].selections[i].compartment,{timeout:x6})
      .scrollIntoView()
    cy.get('@selected').click({ force: true })
    cy.get('@selected').should('have.attr', 'aria-selected', 'true')
    cy.get('button.chakra-tabs__tab')
      .contains(keyVals[step].selections[i].comps,{timeout:x6})
      .as('tab')
      .then((button) => {
        const element = button[0]
        element.click()
      })

    cy.get('@tab').should('have.attr', 'aria-selected', 'true')
    cy.get('@tab')
      .invoke('text')
      .then(() => {
        cy.get('@tab').click({ force: true })
      })

    for (let s = 0; s < keyVals[step].selections[i].seats.length; s++) {
      cy.get('div.chakra-tabs__tab-panels').as('seat')
      cy.get('@seat').find('p')
      cy.get('@seat')
        .contains(keyVals[step].selections[i].seats[s],{timeout:x6})
        .parent()
        .parent()

      cy.get('@seat').scrollIntoView()
      cy.get('@seat').then(($seat) => {
        const isDisabled = Cypress.$($seat).prop('disabled')
        if (isDisabled) {
          cy.log('Seat is disabled')
        } else {
          cy.get('@seat').trigger('mousedown')
          cy.get('@seat').trigger('mouseup')
          cy.get('@seat').click({ force: true })
        }
      })
    }
  }
}

export function fillGeneralInformationForm(market = '') {
  [
    'firstname',
    'lastname',
    'email',
    'telephone',
    'country',
    'line_1',
    'town',
    'post_code',
  ].forEach((field) => {
    if (field != 'country') {
      cy.log(field, DATA_OBJECT[field])
      cy.get(`input[name=${field}]`, { timeout: 40000 }).as('inputField')
      cy.get('@inputField').scrollIntoView()
      cy.get('@inputField').fastType(DATA_OBJECT[field], { force: true })
    } else {
      cy.get(`select[name=${field}]`, { timeout: 40000 }).select(
        DATA_OBJECT[field],
        { force: true },
        {timeout:60000}
      )
    }
  })
  
  cy.get('button[class^="chakra-button"]', { timeout: 40000 })
    .find('div>p')
    .contains('Continue to payment',{timeout:x6})
    .click({ force: true })
  
    cy.get('p.chakra-text')
    .contains('Via Card (SagePay)',{timeout:x6})
    .click()
}

export function fillPaymentInformationForm() {
  
  ['cardholder-name', 'card-number', 'expiry-date', 'security-code'].forEach(
    (field) => {
      cy.iframe('#payment-iframe',{timeout:x6}).as('paymentIframe')
      cy.get('@paymentIframe').scrollIntoView()
      cy.get('@paymentIframe')
        .find(`input[name=${field}]`)
        .fastType(DATA_OBJECT[field], { force: true })
    },
  )
  cy.get('button[class^="chakra-button"]')
    .find('div>p')
    .contains('Pay',{timeout:x6})
    .click({ force: true })

  cy.get('p.chakra-text').as('paragraphs')
  cy.get('@paragraphs').contains('Order reference',{timeout:x6}).as('reflabel')

  cy.get('@reflabel').scrollIntoView()
  cy.get('@reflabel').should('exist').and('be.visible')

  cy.get('@reflabel')
    .siblings()
    .eq(0)
    .should('exist')
    .and('be.visible')
    .invoke('text')
    .then((txt) => {
      expect(txt.length).to.be.greaterThan(5)
      saveToSessionStorage('order_id', txt)
      const myModCapacityData = Cypress.env('modCapacityData');
      /* Update capacity.json */
      if(Array.isArray(myModCapacityData)){
        let filename = 'src\\fixtures\\capacity.json'
        if (Cypress.platform != 'win32') {
          filename = 'src/fixtures/capacity.json'
        }
        cy.writeFile(filename, {
          capacities: myModCapacityData,
        })
      }
    })
}

export function internalCheckOut(checkout='',market='') {
  if(market==''){
    cy.get('footer.chakra-modal__footer')
    .find('button')
    .should('not.have.attr', 'disabled',{timeout:x6})
    cy.get('footer.chakra-modal__footer').find('button').click({ force: true })
  }
  

  cy.get('div[class^="chakra-stack"]')
    .find('button', { timeout: 30000 })
    .contains('Checkout',{timeout:x6})
    .should('exist')
    .click({ force: true })

  fillGeneralInformationForm(market)
  fillPaymentInformationForm()
}

export function selectDate() {
  const futureDate = getFutureDate(35)
  cy.get('div.chakra-card', { timeout: 30000 })
    .find('button > p')
    .as('selectedDropdown')
    .contains('when',{timeout:x6})
    .click({ force: true })

  cy.get('table.chakra-table').then(() => {
    cy.get('select.chakra-select').eq(0)
    .select(futureDate.month)
    .should('exist')
    .and('be.visible')

    cy.get('table.chakra-table')
      .find('td>button')
      .contains(futureDate.day,{timeout:x6})
      .click()
      .then((selectedDate) => {
        if (Cypress.$(selectedDate).attr('aria-disabled') != 'true') {
          cy.wrap(Cypress.$(selectedDate)).should('exist').and('be.enabled').trigger('click')
        } else {
          cy.get('table.chakra-table')
            .find('td > button')
            .then((days) => {
              const daysArray = Array.from(days)
              for (const day of daysArray) {
                const text_ = Cypress.$(day).text().split(`£`)[0]
                if (
                  Cypress.$(day).attr('aria-disabled') !== 'true' &&
                  Cypress.$(day).prop('ariaLabel').includes(futureDate.month) &&
                  parseInt(text_) >= 1
                ) {
                  Cypress.$(day).trigger('click')
                  break
                }
              }
            })
        }
      })
  })
}
