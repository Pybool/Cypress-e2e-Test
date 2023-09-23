import '@testing-library/cypress/add-commands'

const compareSnapshotCommand = require('cypress-image-diff-js/dist/command')

compareSnapshotCommand()

Cypress.Commands.add('login', () => {
  cy.request({
    method: 'POST',
    url: `${Cypress.env('VITE_GATEWAY_URL')}/users/login`,
    form: false,
    body: {
      username: Cypress.env('CYPRESS_E2E_USERNAME'),
      password: Cypress.env('CYPRESS_E2E_PASSWORD'),
    },
  })
    .its('body')
    .then((loginData) => {
      cy.request({
        method: 'GET',
        url: `${Cypress.env('VITE_GATEWAY_URL')}/me/profile`,
        form: false,
        headers: {
          Authorization: loginData.accessToken,
        },
      })
        .its('body')
        .then((profileData) => {
          window.localStorage.setItem(
            'TICKNOVATE',
            JSON.stringify({
              user: {
                ...loginData,
                ...profileData,
              },
            }),
          )
        })
    })
})

Cypress.Commands.add('getCompartmentNames', () => {
  return cy.get('div.chakra-tabs__tablist').eq(0).children()
})

 Cypress.Commands.add('getCarriagesAndSeats', (compartmentIndex,carraigeindex, refine = false) => {
  var seats;
  return cy.get('.chakra-tabs__tab-panels')
    .children()
    .eq(compartmentIndex)
    .children().as('childs').its('length')
    .then((len)=>{
      
      cy.get('@childs')
      .eq(len-1)
      .children()
      .eq(1)
      .children()
      .eq(carraigeindex)
      .children()
      .eq(0).as('hasNodes').then((btnw)=>{
        if(Cypress.$(btnw).children().length > 0){
          cy.get('@hasNodes')
          .children()
          .then((seatsList)=>{
            seats = []
            Array.from(Cypress.$(seatsList)).forEach((btn) => {
              seats.push({
                name: btn.children[0].children[0].textContent,
                is_disabled: btn.hasAttribute('disabled'),
              })
            })
            return seats
          })
        }
      })
      
    })
});

Cypress.Commands.add('smoothenFormat', (data) => {
  const convertedData = {}
  for (const compartment in data) {
    for (const entry of data[compartment]) {
      const [carriageName] = Object.keys(entry)
      const compartmentName = entry[carriageName].compartment
      const seats = entry[carriageName].seats.map((seat) => ({
        name: seat.name,
        is_disabled: seat.is_disabled,
      }))

      if (!convertedData[compartmentName]) {
        convertedData[compartmentName] = []
      }
      convertedData[compartmentName].push({
        carriage: carriageName,
        seats: seats,
      })
    }
  }
  return convertedData
})

Cypress.Commands.add(
  'processCarriages',
  (compartmentIndex, idx, compartmentTxt, newcompartments) => {
    var carriages
    let index = -1
    return cy
      .get('@root')
      .children()
      .eq(compartmentIndex)
      .children()
      .eq(idx)
      .children()
      .eq(0)
      .children()
      .then((carriagesList) => {
        carriages = []
        return new Promise((resolve) => {
          let carriageObj
          const promises = Array.from(Cypress.$(carriagesList)).map(
            async (carriage) => {
              index += 1
              cy.getCarriagesAndSeats(compartmentIndex, index, true).then(
                (val) => {
                  const keys = Object.keys(val)
                  if (!keys.includes('prevObject')){
                    carriageObj = {
                      [carriage.textContent]: {
                        idx: index,
                        seats: val,
                        compartment: compartmentTxt,
                        dataIndex: carriage.getAttribute('data-index'),
                      },
                    }
                    carriages.push(carriageObj)
                  }
                },
              )
            },
          )
          Promise.all(promises).then(() => {
            newcompartments[compartmentTxt] = carriages
            resolve(newcompartments)
          })
        })
      })
  },
)

Cypress.Commands.add('loginAdminApp', (username, password) => {
  cy.session(
    [username, password],
    () => {
      cy.visit('/login')

      cy.get('#username').type(username)
      cy.get('#password').type(password)
      cy.get('button').contains('Login').click()
    },
    {
      validate() {
        cy.visit('/blocks/tickets')
      },
    },
  )
})

Cypress.Commands.add('loginReservations2', (email, password) => {
  cy.visit('/login')

  cy.get('body').then(($body) => {
    if (!$body.find('[data-testid="test-login-button"]', { timeout: 0 })) {
      cy.findByTestId('test-login-email').type(email)
      cy.findByTestId('test-login-password').type(password)
      cy.findByTestId('test-login-button').click()
    } else {
      cy.log('.some-element does not exist')
    }
  })
})

Cypress.Commands.add(
  'fastType',
  { prevSubject: 'element' },
  (subject, text) => {
    cy.wrap(subject).type(text, { delay: 0 })
  },
)
