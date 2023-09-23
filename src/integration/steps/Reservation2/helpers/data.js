function findObjectsWithSumAndSameCompartment(dataArray, targetSum) {
  const compartmentMap = new Map();

  // Iterate through the data array to group objects by compartment name
  for (const item of dataArray) {
    const key = Object.keys(item)[0];
    const obj = item[key];
    const compartment = obj.compartment;
    if (!compartmentMap.has(compartment)) {
      compartmentMap.set(compartment, []);
    }
    compartmentMap.get(compartment).push({ key: parseInt(key), obj });
  }

  // Find objects with keys that add up to the targetSum and have the same compartment name
  const result = [];
  for (const [compartment, items] of compartmentMap.entries()) {
    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        
        if(items[i].key === targetSum){
            result.push({ [items[i].key]: items[i].obj });
            return result.filter((obj) => {
                const compartmentNames = new Set(Object.values(obj).map((item) => item.compartment));
                return compartmentNames.size === 1; // Return true if all compartment names are the same
            });
        }

        else if (items[i].key + items[j].key === targetSum) {
          if(result.includes({ [items[i].key]: items[i].obj, [items[j].key]: items[j].obj })==false){
            result.push({ [items[i].key]: items[i].obj, [items[j].key]: items[j].obj });
          }
          
        }
      }
    }
  }

  // Filter out the results where compartment names are different
  return result.filter((obj) => {
    const compartmentNames = new Set(Object.values(obj).map((item) => item.compartment));
    return compartmentNames.size === 1; // Return true if all compartment names are the same
  });
}


export function findSuitableSeats(seatData, numPeople) {
    let suitableSeats = [];
    let buffer = new Array()
  
    for (const compartment in seatData) {
      const entries = seatData[compartment];
  
      // Check for single seats within a carriage
      for (const entry of entries) {
        const carriageName = entry.carriage;
        const seatsInfo = entry.seats;
  
        for (const seat of seatsInfo) {
          if(seat.name != undefined){
            if (!seat.name.includes("Seats") && !seat.is_disabled) {
              if (!suitableSeats.includes({ compartment, carriage: carriageName, seat })){
                  suitableSeats.push({ compartment, carriage: carriageName, seat });
              }
              if (suitableSeats.length >= numPeople) {
                return suitableSeats.slice(0, numPeople);
              }
            }
          }
        }
      }
  
      // Check for consecutive seats with a difference of 3
      for (const entry of entries) {
        const carriageName = entry.carriage;
        const seatsInfo = entry.seats;

        for(let i= 0; i< seatsInfo.length; i++){
            let seat = seatsInfo[i].name
            let numSeats = seat.split(' ')[1].split("-")
            let lesserNum = parseInt(numSeats[0])
            let greaterNum = parseInt(numSeats[1])
            if((greaterNum - lesserNum) == numPeople && !seatsInfo[i].is_disabled){
                return {compartment:compartment,carriage:carriageName,seat:seatsInfo[i]}
            }
                
        }
      }
  
      // Check for consecutive seats with a difference of 2 and a single seat
      
      for (const entry of entries) {
        const carriageName = entry.carriage;
        const seatsInfo = entry.seats;
  
        for(let i= 0; i< seatsInfo.length; i++){
            let seat = seatsInfo[i].name
                
            let numSeats = seat.split(' ')[1].split("-")
            let lesserNum = parseInt(numSeats[0])
            let greaterNum = parseInt(numSeats[1])
            if(!seatsInfo[i].is_disabled){
                let obj = {compartment:compartment,carriage:carriageName,seat:JSON.stringify(seatsInfo[i])}
                if(Object.keys(obj).length > 0){
                    buffer.push({[greaterNum+1 - lesserNum]:obj})
                }
                
            }
                
        }
        
      }
    }
    return findObjectsWithSumAndSameCompartment(buffer, numPeople)
  }
