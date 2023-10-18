
import {
    Given,
    And,
    Then,
    When,
  } from 'cypress-cucumber-preprocessor/steps'
  import * as rs2 from '../../../functions/rs2'
  const x6 = 60000

Given ('I have created an order as a customer', async ()=>{
    cy.visit('/booking')
    const data = { adults: 2, children: 2, step: '2 adults 2 children' }
    await rs2.startCreateOrder(data.adults, data.children,"Ullswater 'Steamers'",3)
    rs2.internalCheckOut('Checkout',"Ullswater 'Steamers'",true)
  })

  When('I am on the reservations page', () => {
    cy.visit('/')
  })
  
  Then('I should be on the base url', () => {
    cy.url().then((url) => {
      const expectedUrl = Cypress.config('baseUrl')
      expect(url).to.equal(expectedUrl)
    })
  })

  When ('I click on the a row in the table for a draft order', async ()=>{
    cy.get('td').contains('draft').eq(0).parent().click()
  })

  Then('I should see the Order Preview widget', () => { 
    cy.get('h1.chakra-heading')
    .contains('Order Preview',{timeout:x6})
    .should('exist')
    .and('be.visible')
    .parent()
    .parent()
    .should('have.class','chakra-stack')
    .should('have.class','chakra-card')
    .and('be.visible')
    .as('orderPreviewWidget')
  })
  
  And('The Order Preview widget should contain {string} {string} {string} and {string} section', (section1,section2,section3,section4) => { 
    [section1,section2,section3,section4].forEach((section)=>{
      cy.get('h2.chakra-heading')
      .contains(section,{timeout:x6})
      .scrollIntoView()
      .should('exist')
      .and('be.visible')
      .parent()
      .should('exist')
      .and('be.visible')
    })
  })
  
  And('The Order Preview widget should have a {string} button with background colors {string}', (btnTxt1,bgColor) => { 
    [btnTxt1].forEach((btnTxt)=>{
      if(btnTxt == 'View Order Details'){
        cy.get('@orderPreviewWidget')
        .find('a.chakra-button').as('btn')
      }
      else{
        cy.get('@orderPreviewWidget')
        .find('button.chakra-button')
        .as('btn')
      }
      cy.get('@btn')
      .contains(btnTxt,{timeout:x6})
      .should('exist')
      .and('be.visible')
      .should('have.css','background-color',bgColor)
    })
  })
  
  
  And('The Order Preview widget {string} should contains a Name Label and the name in the Table matches the name on the Label value',
   (section) => { 
    cy.get('h2.chakra-heading')
    .contains(section,{timeout:x6})
    .scrollIntoView()
    .parent().as("section")
    cy.get('@section').find('p.chakra-text').contains('Name')
    .should('exist')
    .and('be.visible')
    .siblings().eq(0).as('customerNameEl')
  
    cy.task('getData', { key: 'lastOrderID' }).then((data) => { 
      const lastOrderId = data || 'ULO2OKILYXOEH'
      cy.get('td').contains(lastOrderId,{timeout:x6})
      .parent()
      .siblings()
      .eq(2)
      .invoke('text')
      .then((name)=>{
        cy.get('@customerNameEl')
        .invoke('text')
        .then((txt)=>{
          expect(txt).to.eq(name)
        })
      })
    })
  })
  
  And('The Order Preview widget {string} should contains a Email Label and the Email should be a valid Email Address',
   (section) => { 
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  
    cy.get('h2.chakra-heading')
    .contains(section,{timeout:x6})
    .scrollIntoView()
    .parent().as("section")
    cy.get('@section').find('p.chakra-text').contains('Email')
    .should('exist')
    .and('be.visible')
    .siblings().eq(0).as('customerEmailEl')
    .invoke('text')
    .then((email)=>{
      expect(emailPattern.test(email)).to.eq(true)
    })
   })

  