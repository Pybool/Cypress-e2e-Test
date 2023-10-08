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
        new Promise((resolve) => {
          let carriageObj
          const promises = Array.from(Cypress.$(carriagesList)).map(
            (carriage) => {
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

Cypress.Commands.add('loginAdminUat', (email, password) => {
  cy.visit('https://admin.lakedistrict.ticknovate-uat.com/login',{force:true})

  .then(() => {
    cy.get('#username').fastType(email)
    cy.get('#password').fastType(password)
    cy.get('button').contains('Login').click()
  })
})

Cypress.Commands.add('getCapacity', (time,date,entityID) => {
  const x6 = 60000
  const username = 'taye.oyelekan@ticknovate.com'
  const password = 'Radio9*981tai'

  const getSelectedText = (el)=> {
    let selectedIndex = el.selectedIndex;
    let selectedText = el.options[selectedIndex].text;
    return selectedText
  }

  cy.loginAdminUat(username,password).then(()=>{
    cy.get('h1').contains('Building Blocks',{timeout:x6}).should('be.visible')
    .then(()=>{
      cy.visit(`https://admin.lakedistrict.ticknovate-uat.com/services/${entityID}`,{force:true})
      cy.get('button')
      .contains('Departure Schedule')
      .click()

      cy.get('span').contains('Start date').eq(0).siblings().last().children().last().as('calender').click().then(()=>{
        cy.get('@calender')
        .siblings().last()
        .siblings().last()
        .children().eq(0)
        .children().eq(2)
        .find('span')
        .contains(date)
        .click()

        cy.get('p')
        .contains(time)
        .eq(0).parent()
        .siblings()
        .last()
        .children()
        .last()
        .click()

        cy.get('button')
        .contains('Capacity')
        .eq(0)
        .click()

        cy.get('h3')
        .siblings()
        .eq(0)
        .click()

        cy.get('button')
        .contains('I understand the consequences and want to proceed.')
        .click()

        cy.get('table[data-testid="test-table-simplified-capacity-plan-list"').find('tbody > tr').then((trs)=>{
          let capacityDataList = []
          for(let i=0; i < trs.length; i++){
            let capacityDataObj = {}
            let sel = Cypress.$(trs[i]).find('select')
            capacityDataObj['compartment'] = getSelectedText(Cypress.$(sel)[0])
            capacityDataObj['carriage'] = Cypress.$(trs[i]).children().eq(2).find('input').val()
            capacityDataObj['seats'] = Cypress.$(trs[i]).children().eq(3).find('input').val()
            capacityDataList.push(capacityDataObj)
          }
          let filename = 'src\\fixtures\\capacity.json'
          if (Cypress.platform != 'win32') {
            filename = 'src/fixtures/capacity.json'
          }
          cy.writeFile(filename, {
            capacities: capacityDataList,
          })
        })
      })
    })
  })
})

Cypress.Commands.add(
  'fastType',
  { prevSubject: 'element' },
  (subject, text) => {
    cy.wrap(subject).type(text, { delay: 0 })
  },
)


