import { And, Then, When } from 'cypress-cucumber-preprocessor/steps'
import { rmDir } from '../../../../functions/backend_helper'

let _buttonText

function generateID() {
  const timestamp = Date.now().toString()
  const randomChars = Math.random().toString(36).substr(2, 6)
  return timestamp + randomChars
}

async function clickAddButton(buttonText) {
  cy.get("div[class^='view_layout_']")
    .find('button[class^="ctabutton_button_"]')
    .contains(buttonText)
    .click({ force: true })
}

async function downloadReport(buttonText) {
  cy.get("div[class^='view_layout_']")
    .find('button[class^="ctabutton_button_"]')
    .contains(buttonText)
    .should('exist')
    .scrollIntoView()
    .and('be.visible')
    .should('have.css','background-color', 'rgb(96, 191, 61)')
    .click({ force: true })
}



async function clickShadowWrapperAddButton(buttonText) {
  cy.get("div[class^='shadowwrapper_layout_']")
    .find('button[class^="ctabutton_button_"]')
    .contains(buttonText)
    .click({ force: true })
}

async function fillNameAndExternalId(name, external_id, fields, more = '') {
  let count = 0
  var valToType

  fields.forEach((field) => {
    if (count == 0) {
      valToType = name
    }
    if (count == 1) {
      valToType = external_id
    }
    if (count == 2) {
      valToType = more
    }

    cy.get("div[class^='formview_layout_']")
      .find('label')
      .find('span')
      .contains(field)
      .siblings()
      .eq(0)
      .find('input')
      .fastType(valToType, { force: true })
    count += 1
  })
}

And('I click the {string} button', async (buttonText) => {
  if (buttonText == 'Add a new recommendation') {
    cy.get('ul[class^="sidenavigation_options"]')
      .find('li')
      .contains('Recommendations')
      .click({ force: true })
  }
  _buttonText = buttonText
  await clickAddButton(_buttonText)
})

And(
  'I enter a {string}, {string} and enter other relevant details for {string} section after clicking {string}',
  async (name, external_id, section, add) => {
    const unique_external_id = `${generateID()}`
    if (!['Combos', 'Promos', 'Extras', 'User Admin'].includes(section)) {
      await clickShadowWrapperAddButton(_buttonText)
    }

    switch (section) {
      case 'Services':
        await fillNameAndExternalId(name, unique_external_id, [
          'Service Name',
          'External ID',
        ])
        break

      case 'Products':
        await fillNameAndExternalId(name, unique_external_id, [
          'Product name',
          'External ID',
        ])
        break
      case 'Promos':
      case 'Combos':
        await fillNameAndExternalId(name, unique_external_id, [
          'Name',
          'External ID',
        ])
        break

      case 'Extras': {
        let text
        let nameOrTitle = 'Name'
        if (add == 'Create a New Add-on') {
          nameOrTitle = 'Title'
        }
        await fillNameAndExternalId(name, unique_external_id, [
          nameOrTitle,
          'External ID',
        ])
        if (add != 'Add a new recommendation') {
          text = 'Add option'
        } else {
          text = 'Add a new record'
        }
        cy.get("div[class^='formview_wrapper_']")
          .find('button[class^="iconbutton_layout_"]')
          .contains(text)
          .click({ force: true })

        if (add != 'Add a new recommendation') {
          cy.get('button[class^="roundedtab_tab"]')
            .contains('Linked Product')
            .click({ force: true })
        }

        cy.get("div[class^='formview_wrapper_']")
          .find('button[class^="iconbutton_layout_"]')
          .contains('Add a new record')
          .eq(0)
          .click({ force: true })

        cy.get("div[class^='formview_wrapper_']")
          .find('select[class^="select_select_"]')
          .eq(0)
          .select(1, { force: true })

        cy.get(
          '#full > div > div > div > div.historyfull_scroller_g1PKU > div > div.formview_layout_3GXdS > div > div > div:nth-child(2) > div > div > div:nth-child(3) > button',
        )
          .eq(0)
          .click({ force: true })

        cy.get("div[class^='formview_wrapper_']")
          .find('select[class^="select_select_"]')
          .eq(1)
          .select(1)

        if (add == 'Create a New Add-on') {
          cy.get('tbody')
            .find('span')
            .contains('Outbound start')
            .parent()
            .click({ force: true })
        }

        break
      }
      case 'User Admin':
        await fillNameAndExternalId(
          name,
          `${unique_external_id}@mail.com`,
          ['Name', 'email', 'Department'],
          'IT',
        )
        cy.get("div[class^='formview_wrapper_']")
          .find('select[class^="select_select_"]')
          .eq(0)
          .select(5)
    }
  },
)

Then(
  'The record should have been created on post request to {string}',
  () => {},
)

And(
  'I click the Save button The record should have been created on post request to {string}',
  (url) => {
    cy.intercept('POST', url, (req) => {
      req.continue(() => {})
    }).as('postRequest')

    cy.get('main').find('button').contains('Save').click({ force: true })

    cy.wait('@postRequest').then((interception) => {
      const response = interception.response
      expect(String(response.statusCode)).to.eq('200')
    })
  },
)

And('I am a user on Report page', () => {
  cy.get('li[class^="navigator_wrapper_"]')
    .find('a>span')
    .contains('Reports')
    .as('selectedlink')
  cy.get('@selectedlink').click({ force: true })
})

And('I click {string} report', async () => {
  await downloadReport('Download report')
})

When('I click a {string} on {string} page', (submenu) => {
  cy.get('ul[class^="sidenavigation_options"]')
    .find('li')
    .contains(submenu)
    .click({ force: true })
})

Then('The {string} is downloaded', (report) => {
  if (Cypress.platform === 'win32') {
    cy.log('Running on Windows platform.')
    cy.readFile(`src\\downloads\\${report}.xlsx`).should('exist')
  } else {
    cy.log('Not running on Windows platform.')
    cy.readFile(`src/downloads/${report}.xlsx`).should('exist')
  }
})
;