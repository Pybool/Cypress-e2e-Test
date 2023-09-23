export function getModalCaddy() {
  return cy.get('#portal').get('div[class*="modal_caddy_"]', { timeout: 40000 })
}

export function preventFailure() {
  Cypress.on('uncaught:exception', () => {
    return false
  })
}

export function logJqueryElement(el) {
  Cypress.$(el)
}

export function storage(key, val = null, mode = 'write') {
  if (mode == 'write') {
    return window.sessionStorage.setItem(key, val)
  }
  return window.sessionStorage.getItem(key)
}

export function openFieldModal(button) {
  cy.get('button[class^="button_button_"]', { timeout: 40000 }).as(
    'modalButton',
  )
  cy.get('@modalButton').contains(button)
  cy.get('@modalButton').should('be.visible')
  cy.get('@modalButton').click({ force: true })
}

export function selectVehicleType(vehicleType) {
  openFieldModal('Travel')
  selectModalHorizontalOption('Vehicle')
  selectModalOption(vehicleType)
  clickModalButton('Done')
}

export function selectVisitorSection() {
  openFieldModal('Visitors')
  cy.get('#portal')
    .get("input[id='ticket[0]qty']")
    .parent('div[class*="fieldwrapper_layout_"]')
    .siblings('button')
    .eq(1)
    .click({ force: true })
  clickModalButton('Done')
}

export function getButtonByText(btnText) {
  return cy
    .get('button[class^="button_button_"]', { timeout: 40000 })
    .contains(btnText)
}

export function selectModalOption(selectedName) {
  getModalCaddy()
    .get('div[class*="optionlist_row_"]')
    .get('span')
    .contains(selectedName)
    .click({ force: true })
}

export function outBoundSelectDateTicket(getprice = false) {
  openFieldModal('Date')
  cy.get("#portal div[class*='datecell_available_']", { timeout: 40000 })
    .eq(0)
    .click({ force: true })
  cy.get('#portal button span').contains('Next').click({ force: true })
  openFieldModal('Ticket')
  if (getprice) {
    cy.get(
      "#portal div[class*='datetile_list_'] div[class*='ticket_layout_'] p",
    )
      .eq(0)
      .invoke('text')
      .then((txt) => {
        storage('price', txt)
      })
  }

  cy.get("#portal div[class*='datetile_list_'] div[class*='ticket_layout_'] p")
    .contains('Single Journey')
    .click({ force: true })

  cy.get(
    "div[id='portal'] div[class*='row_spread_'] button[class*='button_button_'] span",
  )
    .contains('Done')
    .click({ force: true })
}
export function clickModalButton(selectedName) {
  if (selectedName == 'Done') {
    const button = getModalCaddy().find('button[class^="button_button_"]')
    button.click({ force: true })
    return
  }

  const button = getModalCaddy()
    .get('button')
    .get('span')
    .contains(selectedName)
  button.click({ force: true })
}
export function selectModalHorizontalOption(selectedName) {
  getModalCaddy()
    .get('div[class*="optionlisthorizontal_row_"]')
    .get('span')
    .contains(selectedName)
    .click({ force: true })
}
export function checkModalDisplay() {}
export function clickOutboundArrow() {}

export function completeRouteSection(from, to) {
  openFieldModal('From')
  selectModalOption(from)
  clickModalButton('Next')
  selectModalOption(to)
  clickModalButton('Done')
}

/**
 * Returns the color of a button with the given label text
 * @param {string} buttonText - The label text of the button
 * @returns {string} The CSS color of the button
 */
export function getButtonColor(buttonText) {
  let baseColor
  switch (buttonText) {
    case 'orange':
      baseColor = 'rgb(224, 80, 32)'
      break
    case 'greyed out':
      baseColor = 'rgb(203, 203, 203)'
      break
    case 'active-green':
      baseColor = 'rgb(112, 192, 160)'
      break
    case 'navy-blue':
      baseColor = 'rgb(0, 32, 64)'
      break
    default:
      baseColor = 'rgb(203, 203, 203)'
  }
  return cy
    .get('button[class^="button_button_"]')
    .contains(buttonText)
    .should('have.css', 'color', baseColor)
}

/**
 * Returns the background color of a button with the given label text
 * @param {string} buttonText - The label text of the button
 * @returns {string} The CSS background color of the button
 */
export function getButtonBackgroundColor(buttonText) {
  let baseColor
  switch (buttonText) {
    case 'orange':
      baseColor = 'rgb(224, 80, 32)'
      break
    case 'greyed out':
      baseColor = 'rgb(203, 203, 203)'
      break
    case 'active-green':
      baseColor = 'rgb(112, 192, 160)'
      break
    case 'navy-blue':
      baseColor = 'rgb(0, 32, 64)'
      break
    default:
      baseColor = 'rgb(203, 203, 203)'
  }
  return cy
    .get('button[class^="button_button_"] span')
    .contains(buttonText)
    .closest('button')
    .should('have.css', 'background-color', baseColor)
}

export function addCurrencyStrings(currencyString1, currencyString2) {
  const value1 = parseFloat(currencyString1.slice(1))
  const value2 = parseFloat(currencyString2.slice(1))

  const sum = value1 + value2
  return sum.toLocaleString('en-US', {
    style: 'currency',
    currency: 'EUR',
  })
}

function selectOption(optionIndex) {
  cy.get("div[area='options']", { timeout: 40000 }).as('optionsdiv')
  cy.get('@optionsdiv').children().as('divoptionschildren')
  cy.get('@divoptionschildren')
    .eq(optionIndex)
    .find('button', { timeout: 40000 })
    .find("div[class*='tick_layout_']", { timeout: 40000 })
    .eq(0)
    .click({ force: true })
}

export function selectedTermsConditions() {
  selectOption(0)
}

export function selectedNewletter() {
  selectOption(1)
}

export function dispalyedDetailsPage() {
  cy.get("div[area='options']", { timeout: 40000 }).as('optionsdiv')
  cy.get('@optionsdiv').children().as('divoptionschildren')

  cy.get('@divoptionschildren')
    .eq(0)
    .find("span[class*='inlinetextbox_layout_']")
    .find('span')
    .contains('I approve ForSea Ferries')
    .as('parent')

  cy.get('@parent').children().eq(0).should('contain', 'terms and conditions')

  cy.get('@parent').children().eq(1).should('contain', 'privacy policy')

  cy.get('@divoptionschildren')
    .eq(1)
    .find("span[class*='inlinetextbox_layout_']")
    .contains(
      'I would like to get information and newsletter from ForSea Ferries',
    )
}
