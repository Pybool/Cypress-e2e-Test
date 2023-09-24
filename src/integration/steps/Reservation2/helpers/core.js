let filename = 'src\\fixtures\\capacity.json'
const scrollConfig = {behavior: 'smooth',block: 'start',inline: 'nearest',}

function getObjectFromArray(arr,compartment){
  const obj = arr.find(x => x.compartment === compartment);
  return obj
}

function deleteObjectFromArray(arr,compartment){
  console.log(arr, id)
  const obj = arr.find(x => x.compartment === compartment);
  let newObj = []
  arr.forEach((arrObj)=>{
    if (arrObj.compartment != compartment){
      newObj.push(arrObj)
    }
  })
  return newObj
}

function seatMapping(selector,unitTarget){
  const offset = sumNumbersFromText(selector)/unitTarget
  return cy.fixture("capacity.json").then((json) => {
    let selectedCapacities = []
    for (let capacity of json.capacities){
      if(capacity.compartment.includes(String(unitTarget)+'-')){
        if(!selectedCapacities.includes(capacity.compartment)){
          selectedCapacities.push(capacity.compartment)
        }
        if(offset == selectedCapacities.length){
          break;
        }
      }
    }
    return [selectedCapacities, json.capacities]
  })
}

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

export function processSeats(section,selector,unitTarget) {
  if (section == 'Who' || section == 'when') {
    cy.get('button.chakra-button').as('btn')
  } else {
    cy.get('button.chakra-menu__menu-button').as('btn')
  }
  
  seatMapping(selector,unitTarget).then((seatsData)=>{
    console.log("SEATS DATA ", seatsData)
    for (let key of seatsData[0]){
      selectSeats(key,seatsData[1])
    }
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

function getTabsOrSeats(id,index){
  return Cypress.$(`.chakra-tabs__tab-panels`)
            .eq(0).children().eq(parseInt(id))
            .children().eq(0).children().eq(index)
            .children()
}
 function selectSeats(key,seatData) {
  console.log(key,seatData)
  let seatObj = getObjectFromArray(seatData,key)
  const compartmentPill = Cypress.$('.chakra-tabs__tablist')
  .eq(0).children().filter(
    function () {
      console.log(Cypress.$(this).text(), seatObj.compartment)
      try {

        if (seatObj.compartment == undefined) {
          throw new Error('Fail intentionally')
        }
        return Cypress.$(this).text() === seatObj.compartment
      } catch {
        return Cypress.$(this).text() === seatObj.compartment
      }
    },
  )

  let id = extractNumbersFromString(compartmentPill.attr('id').split("--")[1])[0]
  window.localStorage.setItem('cmpid',id[0])
  if (compartmentPill.attr('aria-selected') != 'true') {
    compartmentPill.click()
  }

  const tab = getTabsOrSeats(parseInt(id),0)
  .filter(function () {
      try {
        if (seatObj.carriage == undefined) {
          throw new Error('Fail intentionally')
        }
        return Cypress.$(this).text() === seatObj.carriage
      } catch {}
    })
    // tab.scrollIntoView(scrollConfig)
    // tab.click()

  const seat = getTabsOrSeats(parseInt(id),1)
  .filter(function () {
    try {
      if (seatObj.seats == undefined) {
        throw new Error('Fail intentionally')
      }
      return Cypress.$(this).find('p').text() === seatObj.seats
    } catch {}
  })
  // seats.scrollIntoView(scrollConfig)
  // seats.click()

  const newCapacityJson = deleteObjectFromArray(seatData,key)
  if (Cypress.platform != 'win32') {
    filename = 'src/fixtures/capacity.json'
  }
  cy.writeFile(filename, {
    capacities: newCapacityJson,
  })

  console.log("ID ===> ", id)
  console.log("Carriage text ===>",seatObj.carriage)
  console.log("Compartment ==> ",compartmentPill)
  console.log("Carriage and seat ===>  ", tab, seat)
  // 
    // try {
    //   seatname = data[i]['seat']['name']
    //   if (seatname == undefined) {
    //     throw new Error('Fail intentionally')
    //   }
    // } catch (error) {
    //   seatname = JSON.parse(data[i][key]['seat'])['name']
    // }
    // let children = []
    // let ps = Cypress.$('div.chakra-tabs__tab-panels')[0].children
    // for (let i=0; i< ps.length; i++){
    //   children.push(ps[i])
    // }
    // const pElementWithText = findParagraphWithSpecificText(children[id],seatname);
    // if (pElementWithText) {
    //   let abtn = pElementWithText.parentElement.parentElement;
    //   if(abtn.hasAttribute('disabled') != true){
    //     if(_max.length <= data.length){
    //       _max.push(abtn)
    //     }
        
    //   }
    // } 

  // _max.forEach((btn) => {
  //   delay(2000).then(() => {
  //     if (_max_clicked.includes(btn) == false) {
  //       btn.scrollIntoView({
  //         behavior: 'smooth', 
  //         block: 'start', 
  //         inline: 'nearest', 
  //       })
  //       btn.click()
  //       _max_clicked.push(btn)
  //       cy.log('clicked')
  //     } else {
  //       cy.log('Already clicked')
  //     }
  //   })
  // })
}
