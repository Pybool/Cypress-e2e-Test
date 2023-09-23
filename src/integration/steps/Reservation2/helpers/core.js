import * as sorter from './data'
import * as fragment from '../../../functions/seatfragmentparser'

function sumNumbersFromText(text) {
  const parts = text.split(',')
  let sum = 0
  for (const part of parts) {
    const number = parseInt(part.trim(), 10)
    if (!isNaN(number)) {
      sum += number
    }
  }
  return sum
}

function extractNumbersFromString(str) {
  const regex = /\d+/g
  const matches = str.match(regex)
  return matches ? matches.map(Number) : []
}

function delay(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds)
  })
}

function findParagraphWithSpecificText(element, searchText) {
  let result = null

  for (const childNode of element.childNodes) {
    if (childNode.nodeType === Node.ELEMENT_NODE) {
      if (
        childNode.tagName === 'P' &&
        childNode.textContent.trim() === searchText
      ) {
        result = childNode
        break
      } else {
        result = findParagraphWithSpecificText(childNode, searchText)
        if (result) {
          break
        }
      }
    }
  }

  return result
}

function findMostCommonCompartment(data) {
  const compartmentCounts = {}
  let mostCommonCompartment = null
  let mostCommonCount = 0
  let firstIndex = Infinity

  data.forEach((obj, index) => {
    let compartmentInfo

    if (Object.keys(obj).length === 1) {
      compartmentInfo = obj[Object.keys(obj)[0]].compartment
    } else {
      compartmentInfo = obj.compartment
    }

    if (!compartmentCounts[compartmentInfo]) {
      compartmentCounts[compartmentInfo] = 1
    } else {
      compartmentCounts[compartmentInfo]++
    }

    if (compartmentCounts[compartmentInfo] > mostCommonCount) {
      mostCommonCount = compartmentCounts[compartmentInfo]
      mostCommonCompartment = compartmentInfo
      firstIndex = index
    }
  })

  return {
    mostCommonCompartment: mostCommonCompartment,
    firstIndex: firstIndex,
  }
}

async function x(data) {
  const isArray = Array.isArray(data);

    if(isArray) {
        
    }
    else {
        data = [data]
    }
  var seatname
  var id
  const result = findMostCommonCompartment(data)
  const compartmentPill = Cypress.$('button.chakra-tabs__tab').filter(
    function () {
      try {
        if (result.mostCommonCompartment == undefined) {
          throw new Error('Fail intentionally')
        }
        return Cypress.$(this).text() === result.mostCommonCompartment
      } catch {
        return Cypress.$(this).text() === result.mostCommonCompartment
      }
    },
  )
  id = extractNumbersFromString(compartmentPill.attr('id').split("--")[1])[0]
  window.localStorage.setItem(
    'cmpid',
    extractNumbersFromString(compartmentPill.attr('id'))[0],
  )
  if (compartmentPill.attr('aria-selected') != 'true') {
    compartmentPill.click()
  }
  const _max = new Array()
  const _max_clicked = new Array()
  for (let i = 0; i < data.length; i++) {
    const key = Object.keys(data[i])[0]
    const tab = Cypress.$('button.chakra-tabs__tab').filter(function () {
      try {
        if (data[i][key]['carriage'] == undefined) {
          throw new Error('Fail intentionally')
        }
        return Cypress.$(this).text() === data[i][key]['carriage']
      } catch {
        return Cypress.$(this).text() === data[i]['carriage']
      }
    })
    tab.click()
    try {
      seatname = data[i]['seat']['name']
      if (seatname == undefined) {
        throw new Error('Fail intentionally')
      }
    } catch (error) {
      seatname = JSON.parse(data[i][key]['seat'])['name']
    }
    let children = []
    let ps = Cypress.$('div.chakra-tabs__tab-panels')[0].children
    for (let i=0; i< ps.length; i++){
      children.push(ps[i])
    }
    const pElementWithText = findParagraphWithSpecificText(children[id],seatname);
    if (pElementWithText) {
      let abtn = pElementWithText.parentElement.parentElement;
      if(abtn.hasAttribute('disabled') != true){
        if(_max.length <= data.length){
          _max.push(abtn)
        }
        
      }
    } 
  }

  _max.forEach((btn) => {
    delay(2000).then(() => {
      if (_max_clicked.includes(btn) == false) {
        btn.scrollIntoView({
          behavior: 'smooth', 
          block: 'start', 
          inline: 'nearest', 
        })
        btn.click()
        _max_clicked.push(btn)
        cy.log('clicked')
      } else {
        cy.log('Already clicked')
      }
    })
  })
}

function selectSuitableSeats(data, count) {
  try {
    x(data).then(() => {})
  } catch (err) {
    const groupedData = fragment.groupByCompartment(data)
    const targetSum = count
    const firstObjectsWithSum = fragment.findFirstObjectsWithSum(
      groupedData,
      targetSum,
    )
    x(firstObjectsWithSum).then(() => {})
  }
}

export function selectSeats(section) {
  if (section == 'Who' || section == 'when') {
    cy.get('button.chakra-button').as('btn')
  } else {
    cy.get('button.chakra-menu__menu-button').as('btn')
  }
  cy.get('@btn')
    .find('p')
    .contains(section.trim())
    .siblings()
    .eq(0)
    .invoke('text')
    .then((txt) => {
      const seatsNum = sumNumbersFromText(txt)
      const newcompartments = {}
      cy.getCompartmentNames().then((compartments) => {
        cy.get('div.chakra-tabs__tab-panels').eq(0).as('root')
        let idx
        new Promise((resolve) => {
          for (let i = 0; i < Array.from(Cypress.$(compartments)).length; i++) {
            const compartmentTxt = Array.from(Cypress.$(compartments))[i].textContent
            if (
              compartmentTxt == 'Joan Pullman Observation seat' ||
              compartmentTxt == 'Joan Pullman Observation 4-seat compartment' ||
              compartmentTxt == 'Ruth Directors Saloon 4-seat compartment' ||
              compartmentTxt == 'No 140 First Class seat'
            ) {
              idx = 1
            } else {
              idx = 0
            }
            cy.processCarriages(i, idx, compartmentTxt, newcompartments).then(
              (data) => {
                if (i + 1 >= Array.from(Cypress.$(compartments)).length) {
                  resolve(data)
                }
              },
            )
          }
        }).then((data) => {
          const suitableSeats = sorter.findSuitableSeats(
            smoothenFormat(data),
            seatsNum,
          )
          selectSuitableSeats(suitableSeats, seatsNum)
        })
      })
    })
}

function smoothenFormat(data) {
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
}
