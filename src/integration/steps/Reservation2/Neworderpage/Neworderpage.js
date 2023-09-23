import { Then, When, And } from 'cypress-cucumber-preprocessor/steps'

When('I am on the New Order page', () => {
  
  cy.visit('/booking')
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

And(
  'I should see the market selection dropdown as the first component on the card below the page header',
  () => {
    cy.get('div.chakra-card')
      .get('div.chakra-stack')
      .find('button')
      .eq(0)
      .as('marketSelect')
      .should('exist')
      .click({ force: true })

    cy.get('@marketSelect')
      .siblings()
      .eq(0)
      .children()
      .eq(0)
      .as('menuList')
      .should('exist')
      .and('be.visible')

    cy.get('@menuList').children().its('length').should('be.gte', 1)
  },
)

And(
  'I should see the Travel Button next to the market selection dropdown',
  () => {
    cy.get('@marketSelect')
      .parent()
      .siblings()
      .eq(0)
      .as('travelButton')
      .invoke('text')
      .then((txt) => {
        expect(txt).to.eq('Travel')
      })
  },
)

And('I should see the Event Button next to the Travel Button', () => {
  cy.get('@marketSelect')
    .parent()
    .siblings()
    .eq(1)
    .as('eventButton')
    .invoke('text')
    .then((txt) => {
      expect(txt).to.eq('Event')
    })
})

And(
  'I should see the Add return single trip radio after the Event Button',
  () => {
    cy.get('@marketSelect')
      .parent()
      .parent()
      .children()
      .eq(0)
      .parent()
      .siblings()
      .as('radioLabel')
      .children()
      .eq(2)
      .should('exist')
      .and('be.visible')
      .invoke('text')
      .then((txt) => {
        expect(txt).to.eq('Add return single trip')
      })
    cy.get('@radioLabel')
      .find('input.chakra-checkbox__input')
      .should('exist')
      .and('be.visible')
  },
)

When('The Travel Button in the First Card is clicked', () => {
  cy.get('@travelButton').click()
})

Then(
  'Below the first card I should a second card containing a {string} button',
  (text) => {
    cy.get('@radioLabel')
      .parent()
      .siblings()
      .eq(0)
      .should('exist')
      .and('be.visible')
      .should(($el) => {
        const classes = $el[0].classList
        const containsPartialString = Array.from(classes).some((className) =>
          className.includes('chakra-card'),
        )
        expect(containsPartialString).to.be.true
      })
      .as('secondCard')
      
    cy.get('@secondCard')
      .children()
      .eq(0)
      .children()
      .eq(0)
      .as('firstLayer')

    cy.get('@secondCard')
      .children()
      .eq(0)
      .children()
      .eq(2)
      .as('secondLayer')
      
    cy.get('@firstLayer')
      .get(`button[aria-label*='${text}']`)
      .should('exist')
      .and('be.visible')
      .should('have.css', 'background-color', 'rgba(125, 227, 203, 0.5)')
  },
)

And(
  'In the {string} of the second card i should see a {string} dropdown and {string} dropdown',
  (layer, section1, section2) => {
    let count = 1
    let count2 = 0
    ;[section1, section2].forEach((section) => {
      if (layer == 'firstLayer') {
        cy.get(`@${layer}`)
          .find('button')
          .eq(count)
          .should('exist')
          .get('span > p')
          .contains(section)
          .as('text')
          .should('exist')
          .and('be.visible')
        count += 1
      } else {
        cy.get(`@${layer}`)
          .find('button')
          .eq(count2)
          .should('exist')
          .as('layer2Button')
          .get('p')
          .contains(section)
          .as('text')
          .should('exist')
          .and('be.visible')
        count2 += 1
      }

      cy.get('@text')
        .parent()
        .parent()
        .should(($el) => {
          const classes = $el[0].classList
          if (layer == 'firstLayer') {
            const containsPartialString = Array.from(classes).some(
              (className) => className.includes('chakra-menu__menu-button'),
            )
            expect(containsPartialString).to.be.true
          }
        })
    })
  },
)

Then(
  'The {string} and {string} buttons should be disabled by default if the {string} button was not selected',
  () => {
    const layer = 'secondLayer'
    cy.get(`@${layer}`)
      .find('button')
      .eq(0)
      .as('whobutton')
      .get('p')
      .contains('Who')
      .siblings()
      .eq(0)
      .as('WhoButtonText')

    cy.get(`@${layer}`)
      .find('button')
      .eq(1)
      .as('whenbutton')
      .get('p')
      .contains('when')

    cy.get(`@firstLayer`)
      .find('button')
      .eq(2)
      .get('span > p')
      .contains('To')
      .siblings()
      .eq(0)
      .invoke('text')
      .then((totxt) => {
        if (totxt.includes('Choose')) {
          cy.get('@whobutton').should('have.attr', 'disabled')
        } else {
          cy.get('@whobutton').should('not.have.attr', 'disabled')
        }
      })

    cy.get('@WhoButtonText')
      .invoke('text')
      .then((txt) => {
        if (txt.includes('Choose')) {
          cy.get('@whenbutton').should('have.attr', 'disabled')
        } else {
          cy.get('@whenbutton').should('not.have.attr', 'disabled')
        }
      })
  },
)

And(
  'The Cart Section should be visible and have a header with text {string}',
  (cartHeader) => {
    cy.get('h3.chakra-heading')
      .contains(cartHeader)
      .as('cartHeader')
      .should('exist')
      .and('be.visible')
      .invoke('text')
      .then((txt) => {
        expect(txt).to.eq('Cart')
      })
  },
)

And('A {string} Button should be visible beside the header', (clearText) => {
  cy.get('@cartHeader')
    .siblings()
    .eq(0)
    .should('exist')
    .and('be.visible')
    .invoke('text')
    .then((txt) => {
      expect(txt).to.eq(clearText)
    })
})
