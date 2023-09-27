
import {
    And,
    Then,
    When,
  } from 'cypress-cucumber-preprocessor/steps'
  import * as rs2 from '../../../functions/rs2'
  const x6 = 60000


  When('I attempt to create an order selecting {string} adult for when choosing who', async(number) => {
    await fn(number)
  })

  Then('I close the compartments modal', async() => {
    cy.get('button.chakra-modal__close-btn').click({force:true})
  })

  And('I click The {string} button', async(button) => {
    cy.get('div.chakra-tabs__tab-panels').find('p').contains(button,{timeout:x6}).parent().parent().click({force:true})
  })
  
  Then('The {string} compartments are not displayed in the select reservation modal', async(wildCard) => {
    compartmentShouldShowOrNot(wildCard)
  })

  Then('The {string} compartments are displayed in the select reservation modal', async(wildCard) => {
    compartmentShouldShowOrNot(wildCard,1)
  })
  
  async function fn(number,secondchoice=0){
      await rs2.startCreateOrder(number,secondchoice)
  }

  function compartmentShouldShowOrNot(wildCard,val=0){
    let compartments = []
    cy.get('h3.chakra-heading').contains(Cypress.env('product'),{timeout:x6}).parent().siblings().eq(0).children().eq(2).click({force:true})
    cy.get('button.chakra-button').contains('Add To Cart',{timeout:x6}).click({force:true})
    cy.get('div.chakra-tabs__tablist').eq(0).should('be.visible')

    cy.get('p.chakra-text').contains('Select Reservation')
    .eq(0).should('be.visible').then(()=>{
        cy.wait(1000) //This wait is essential as compartments that should be present appear first before disappering
        Cypress.$('.chakra-tabs__tablist')
            .eq(0).children().filter(
            function () {
            try {
                if (wildCard == undefined) {throw new Error('Fail intentionally')}
                if (Cypress.$(this).text().includes(wildCard) && !Cypress.$(this).is('[disabled]')){
                    compartments.push(Cypress.$(this).text())
                }
            } catch {}
            },
        )
        cy.wrap(compartments).should('have.length.at.least',val)
    })
  }
  


