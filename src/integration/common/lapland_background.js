import { Given, And, Then, When } from 'cypress-cucumber-preprocessor/steps'
import { BASE_URL } from '../index'
import { btndivspan } from '../functions/lapland_helper'
import { setBaseUrl } from './generic'
require('dotenv').config()
const x6 = 60000

const envFIle = process.env
const username = envFIle.username || 'taye.oyelekan@ticknovate.com'
const password = envFIle.laplandpassword || 'Radio9*981tai'
var choice

setBaseUrl('lapland', BASE_URL)

Given('I am on Booking Page', async () => {
  cy.visit('/login')
  cy.get('#username').eq(0).type(username)
  cy.get('#password').eq(0).type(password)
  cy.get('button[data-test-handle="btn-login"]').click()
  cy.get('h2').contains('New Booking',{timeout:x6}).click({ force: true })
  cy.get('ul[role="tablist"] > li').eq(1).click({ force: true })
  await btndivspan('Book an event')
  await btndivspan('Lapland UK 2023')
  await btndivspan('Select a party')
})

When('I input {string} data', async (data) => {
  choice = data
  const arr = data.split('1x')
  arr.forEach(async (text) => {
    if (text != '') {
      text = text.replace(/,/g, '').trim()
      return cy
        .iframe('#ticknovate-frame')
        .find('div[class^="column_layout_"]')
        .find('div>span')
        .contains(text)
        .parent()
        .parent()
        .siblings()
        .eq(0)
        .find('button')
        .eq(1)
        .as('addbtn')
        .click({ force: true })
    }
  })
})

When('I input {string} data for multiple', async (data) => {
  choice = data
  const arr = [] //data.split('1x')
  const numbs = []
  const array = data.split(',')
  array.forEach((num) => {
    numbs.push(parseInt(num.trim()[0]))
    arr.push(num.split('x')[1].trim())
  })

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] != '') {
      const text = arr[i].replace(/,/g, '').trim()
      for (let j = 0; j < numbs[i]; j++) {
        cy.iframe('#ticknovate-frame')
          .find('div[class^="column_layout_"]')
          .find('div>span')
          .contains(text)
          .parent()
          .parent()
          .siblings()
          .eq(0)
          .find('button')
          .eq(1)
          .as('addbtn')
          .click({ force: true })
        cy.iframe('#ticknovate-frame')
          .find('div[class^="column_layout_"]')
          .find('div>span')
          .contains(text)
          .parent()
          .parent()
          .siblings()
          .eq(0)
          .find('input')
          .as('input')
        if (j >= 4) {
          cy.get('@input').should('have.value', 4)
          cy.get('@input')
            .invoke('val')
            .then((val) => {
              window.sessionStorage.setItem('childCount', val)
            })
        } else {
          cy.get('@input').should('have.value', j + 1)
        }
      }
    }
  }
})

Then('Child count should remain 4', async () => {
  cy.iframe('#ticknovate-frame')
    .find('div[class^="column_layout_"]')
    .find('div>span')
    .contains('Child')
    .parent()
    .parent()
    .siblings()
    .eq(0)
    .find('input')
    .as('input')
  cy.get('@input').should('have.value', 4)
})

When('I input {string} data for tour', async (data) => {
  await btndivspan('Your tour')
  const date = data.split(' ')
  const day = date[0]

  cy.iframe('#ticknovate-frame', { timeout: 40000 })
    .find('div[class^="modal_caddy_"]', { timeout: 40000 })
    .find('span[class^="datecell_day_"]')
    .contains(`${day}`)
    .should(($el) => {
      const classes = $el.parent().attr('class')
      expect(classes).to.include('datecell_available',{timeout:x6})
    })

    .parent()
    .click({ force: true })
    
  cy.iframe('#ticknovate-frame', { timeout: 40000 })
    .find('div[class^="modal_caddy_"]', { timeout: 40000 })
    .find('span[class^="inlinetextbox_layout_"]')
    .contains('Next')
    .parent()
    .parent()
    .click({ force: true })
})

When('I input {string} data for tour with {string}', async () => {
  await btndivspan('Your tour')
  cy.iframe('#ticknovate-frame', { timeout: 40000 })
    .find('div[class^="modal_caddy_"]', { timeout: 40000 })
    .find('span[class^="datecell_day_"]')
    .eq(0)
    .parent()
    .click({ force: true })
  cy.iframe('#ticknovate-frame')
    .find('div[class^="modal_caddy_"]', { timeout: 40000 })
    .find('span[class^="inlinetextbox_layout_"]')
    .contains('Next')
    .parent()
    .parent()
    .click({ force: true })
})

Then('I am not able to select the greyed out date', async () => {
  cy.iframe('#ticknovate-frame')
    .find('div[class^="modal_caddy_"]', { timeout: 40000 })
    .find('span[class^="datecell_day_"]')
    .eq(0)
    .parent()
    .should(($el) => {
      const classes = $el.attr('class')
      expect(classes).to.not.include('datecell_available')
    })
})

When('I input time {string} data for tour', async (time) => {
  cy.get('#ticknovate-frame').then(() => {
    cy.iframe('#ticknovate-frame')
      .find('span[class^="inlinetextbox_layout_"]')
      .contains(`${time}`)
      .parent()
      .parent()
      .click({ force: true })

    cy.iframe('#ticknovate-frame')
      .find('span[class^="inlinetextbox_layout_"]')
      .contains('Next')
      .parent()
      .parent()
      .click({ force: true })
  })
})

Then(
  '{string} Summary displays with time {string} and date {string}',
  async () => {
    cy.iframe('#ticknovate-frame')
      .find('h4[class^="heading_heading_"]')
      .contains(`Booking Summary`)
      .as('bookingsummarryheader')
      .should('be.visible')
  },
)

When('I input {string}, {string}, {string} data', async (parties, time) => {
  choice = parties
  const arr = parties.split('1x')
  const p = new Promise((resolve) => {
    arr.forEach((text) => {
      if (text != '') {
        text = text.replace(/,/g, '').trim()
        return cy
          .iframe('#ticknovate-frame')
          .find('div[class^="column_layout_"]')
          .find('div>span')
          .contains(text)
          .parent()
          .parent()
          .siblings()
          .eq(0)
          .find('button')
          .eq(1)
          .as('addbtn')
          .click({ force: true })
      }
    })
    resolve(1)
  })
  p.then(async (val) => {
    if (val == 1) {
      cy.iframe('#ticknovate-frame')
        .find('span[class^="inlinetextbox_layout_"]')
        .contains('Select a party')
      await btndivspan('Next')
      await btndivspan('Select a tour')
    }
  })
})

When('{string} button is clicked', async (button) => {
  cy.iframe('#ticknovate-frame')
    .find('span[class^="inlinetextbox_layout_"]')
    .contains('Select a party')
    .as('selectedparty')
  await btndivspan(button)
})

Then('{string} button is not active', async (button) => {
  cy.iframe('#ticknovate-frame')
    .find('span[class^="inlinetextbox_layout_"]')
    .contains(button)
    .parent()
    .parent()
    .parent()
    .should('have.attr', 'disabled')
})

Then('{string} is populated with selected option', async () => {
  cy.iframe('#ticknovate-frame')
    .find('span[class^="inlinetextbox_layout_"]')
    .contains('Your party')
    .siblings().eq(0)
    .invoke('text')
    .then((txt) => {
      expect(txt.replaceAll('1 x', '1x')).to.eq(choice)
    })
})

And('I am not able to select {string}', async () => {
  cy.get('@addbtn').should('have.attr', 'disabled')
})
