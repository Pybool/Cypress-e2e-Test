import { Given, And, Then, When } from 'cypress-cucumber-preprocessor/steps'
const x6 = 60000

Given('I am an Admin User', () => {})

When ('I click User Admin on the Nav bar', () => {
  cy.get('[class^="appstatus_busy_"]').should('not.exist')
  cy.get('span').contains('User Admin',{timeout:x6}).parent().should('be.visible').click({force:true})
})

Then('I click a {string} on {string} page', (submenu) => {
  // cy.get('[class^="appstatus_busy_"]').should('not.be.visible')
  cy.get('ul[class^="sidenavigation_options"]')
    .find('li')
    .contains(submenu)
    .should('be.visible')
    .click({ force: true })
})

Then('The {string} page loads up as expected', (submenu_header_text) => {
  if (submenu_header_text == 'Recommendations') {
    return cy
      .get('h1[class^="heading_section_"]')
      .should('contain', 'Recommendations')
  }

  if (
    submenu_header_text.includes('report') ||
    submenu_header_text == 'Functions manifest'
  ) {
    return cy
      .get('h1[class^="heading_heading_"]')
      .should('contain', submenu_header_text)
  }

  if (submenu_header_text == 'Terms') {
    return cy
      .get('h2[class^="heading_heading_"]')
      .should('contain', 'Cancellation & Amendments')
  }

  if (submenu_header_text == 'Languages & Currency') {
    return cy
      .get('h2[class^="heading_heading_"]')
      .should('contain', 'Language setup')
  }
  if (submenu_header_text == 'Cart Expiry & Timer') {
    return cy
      .get('h2[class^="heading_heading_"]')
      .should('contain', 'Cart expiry & timer settings')
  }
  if (submenu_header_text == 'Cache') {
    return cy
      .get('h2[class^="heading_heading_"]')
      .should('contain', 'Clear all caches')
  } else {
    return cy
      .get('h2[class^="heading_heading_"]')
      .should('contain', submenu_header_text)
  }
})

When('I click {string} dropdown', (ticket_type) => {
  cy.get("div[class^='view_layout_']")
    .find('span[class^="inlinetextbox_layout"]')
    .contains(ticket_type)
    .parentsUntil('div[class="row_layout_"]')
    .eq(0)
    .click({ force: true })
})

Then('{string} DropDown menus is collapsable', (ticket_type) => {
  cy.get('table[class^="table_layout_"]').should('be.visible')
})

Then('{string} tabs is clickable', (capacity) => {
  cy.get('button[class^="roundedtab_tab"]')
    .contains(capacity)
    .click({ force: true })
  cy.get('button[class^="roundedtab_tab"]')
    .contains(capacity)
    .invoke('attr', 'class')
    .then((classtext) => {
      expect(classtext).to.include('roundedtab_active_')
    })
})

When('I click a {string} tab on {string} page', (tab) => {
  cy.get('[class^="appstatus_busy_"]').should('not.exist')
  if (tab == 'Capacity') {
    return cy
      .get('ul[class^="sidenavigation_options"]')
      .find('li')
      .contains(tab)
      .should('be.visible')
      .click({ force: true })
  }
  
  cy.get("div[class^='view_layout_']")
    .find('button[class^="roundedtab_tab"]')
    .contains(tab)
    
    .click({ force: true })

})


    

Then('The {string} tab page loads up as expected', (capacity) => {
  cy.get('button[class^="roundedtab_tab"]')
    .contains(capacity)
    .invoke('attr', 'class')
    .then((classtext) => {
      expect(classtext).to.include('roundedtab_active_')
    })
})

And('I type {string} in search box', (search_param) => {
  cy.get('table[class^="table_layout_"]')
    .find('tr')
    .its('length')
    .should('be.gte', 2)

  cy.get('div[class^="statefulwrapper_layout_"]')
    .find('input[class^="input_input_"]')
    .eq(0)
    .type(`${search_param}`, { force: true })
})

Then('Search returns result containing {string}', (partial_result) => {
  cy.get('table[class^="table_layout_"]')
    .find('tr > td:nth-child(2)')
    .each((td) => {
      expect(td.text()).to.include(partial_result)
    })
})
