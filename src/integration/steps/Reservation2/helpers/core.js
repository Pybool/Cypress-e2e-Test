const hasDescription = ['Joan Pullman Observation seat',
                        'Joan Pullman Observation 4-seat compartment',
                        'Ruth Directors Saloon 4-seat compartment',
                        'No 140 First Class seat'
                      ]

function getObjectFromArray(arr,compartment){
  const obj = arr.find(x => x.compartment === compartment);
  return obj
}

function deleteObjectFromArray(arr, compartment) {
  const index = arr.findIndex((obj) => obj.compartment === compartment);
  if (index !== -1) {
    arr.splice(index, 1);
  }
  return arr;
}

function updateObjectInArray(array, cmpToUpdate, updatedObject) {
  return array.map((item) => {
    if (item.compartment === cmpToUpdate) {
      return { ...item, ...updatedObject };
    }
    return item;
  });
}

function delay(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

function seatMapping(selector,unitTarget){
  const offset = sumNumbersFromText(selector)/unitTarget
  return cy.fixture("capacity.json").then((json) => {
    let selectedCapacities = []
    for (let capacity of json.capacities){
      
      if(unitTarget==3){unitTarget=4}
      console.log("Active capacity ==> ", capacity,String(unitTarget)+'-')
      if(capacity.compartment.includes(String(unitTarget)+'-')){
        if(!selectedCapacities.includes(capacity.compartment) && capacity.marked!=true){
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
  return new Promise((resolve,reject)=>{
    if (section == 'Who' || section == 'when') {
      cy.get('button.chakra-button').as('btn')
    } else {
      cy.get('button.chakra-menu__menu-button').as('btn')
    }
    
    seatMapping(selector,unitTarget).then(async(seatsData)=>{
      let modCapacityData = {}
      for (let key of seatsData[0]){
        modCapacityData = await selectSeats(key,seatsData[1])
      }
      resolve(modCapacityData)
    })
  })
    
}

function getTabsOrSeats(id,index,compartment){
  const hasDescriptionID = hasDescription.includes(compartment) ? 1 : 0;
  return Cypress.$(`.chakra-tabs__tab-panels`)
            .eq(0).children().eq(parseInt(id))
            .children().eq(hasDescriptionID).children().eq(index)
            .children()
}
 async function selectSeats(key,seatData) {
  let seatObj = getObjectFromArray(seatData,key)
  
  const compartmentPill = Cypress.$('.chakra-tabs__tablist')
  .eq(0).children().filter(
    function () {
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

  console.log(Cypress.$('.chakra-tabs__tablist') 
  .children()
  )

  console.log(key, seatData, seatObj, compartmentPill)
  if(!compartmentPill.attr('id')){
    // seatObj['marked'] = false;
    return updateObjectInArray(seatData,key,seatObj)
  }
  let id = extractNumbersFromString(compartmentPill.attr('id').split("--")[1])[0]
  window.localStorage.setItem('cmpid',id[0])
  if (compartmentPill.attr('aria-selected') != 'true') {
    compartmentPill.click()
  }

  const tab = getTabsOrSeats(parseInt(id),0,key)
  .filter(function () {
      try {
        if (seatObj.carriage == undefined) {
          throw new Error('Fail intentionally')
        }
        return Cypress.$(this).text() === seatObj.carriage
      } catch {}
    })
    let selTab = tab.toArray()[0]
    if(selTab){selTab.click()}
    else{
      // seatObj['marked'] = false;
      return updateObjectInArray(seatData,key,seatObj)
    }
    

  let seat = getTabsOrSeats(parseInt(id),1,key).eq(0).children().eq(0).children()
              .filter(function () {
                try {
                  if (seatObj.seats == undefined) {
                    throw new Error('Fail intentionally')
                  }
                  return Cypress.$(this).children().eq(0).children().eq(0).text() === seatObj.seats
                } catch {}
              })
  let selSeat = seat.toArray()[0]
  let retry = 5;
  while(selSeat==undefined && retry > 0){
    let vals = getNewKey(seatData,key)
    seatObj = vals[0]
    seatData = vals[1]
    seat = getTabsOrSeats(parseInt(id),1,key).eq(0).children().eq(0).children()
              .filter(function () {
                try {
                  if (seatObj.seats == undefined) {
                    throw new Error('Fail intentionally')
                  }
                  return Cypress.$(this).children().eq(0).children().eq(0).text() === seatObj.seats
                } catch {}
              })
    selSeat =seat.toArray()[0]
    console.log("Retrying selseats ===> ", selSeat)
    retry -= 1
  }
  await delay(100)
  try{
    selSeat.click()
    // seatObj['marked'] = false;
    return updateObjectInArray(seatData,key,seatObj)
  }
  catch(err){console.log("Update error ", err)}
}

function getNewKey(seatData,key){
  let modSeatData = deleteObjectFromArray(seatData,key)
  let seatObj = getObjectFromArray(modSeatData,key)
  return [seatObj, modSeatData]
}
