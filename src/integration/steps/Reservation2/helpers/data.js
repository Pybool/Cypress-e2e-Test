// function findObjectsWithSumAndSameCompartment(dataArray, targetSum) {
//   const compartmentMap = new Map();

//   for (const item of dataArray) {
//     const key = Object.keys(item)[0];
//     const obj = item[key];
//     const compartment = obj.compartment;
//     if (!compartmentMap.has(compartment)) {
//       compartmentMap.set(compartment, []);
//     }
//     compartmentMap.get(compartment).push({ key: parseInt(key), obj });
//   }

//   const result = [];
//   for (const [compartment, items] of compartmentMap.entries()) {
//     for (let i = 0; i < items.length; i++) {
//       for (let j = i + 1; j < items.length; j++) {
        
//         if(items[i].key === targetSum){
//             result.push({ [items[i].key]: items[i].obj });
//             return result.filter((obj) => {
//                 const compartmentNames = new Set(Object.values(obj).map((item) => item.compartment));
//                 return compartmentNames.size === 1; 
//             });
//         }

//         else if (items[i].key + items[j].key === targetSum) {
//           if(result.includes({ [items[i].key]: items[i].obj, [items[j].key]: items[j].obj })==false){
//             result.push({ [items[i].key]: items[i].obj, [items[j].key]: items[j].obj });
//           }
          
//         }
//       }
//     }
//   }

//   return result.filter((obj) => {
//     const compartmentNames = new Set(Object.values(obj).map((item) => item.compartment));
//     return compartmentNames.size === 1; 
//   });
// }


// export function findSuitableSeats(seatData, numPeople) {
//     let suitableSeats = [];
//     let buffer = new Array()
  
//     for (const compartment in seatData) {
//       const entries = seatData[compartment];
  
//       for (const entry of entries) {
//         const carriageName = entry.carriage;
//         const seatsInfo = entry.seats;
  
//         for (const seat of seatsInfo) {
//           if(seat.name != undefined){
//             if (!seat.name.includes("Seats") && !seat.is_disabled) {
//               if (!suitableSeats.includes({ compartment, carriage: carriageName, seat })){
//                   suitableSeats.push({ compartment, carriage: carriageName, seat });
//               }
//               if (suitableSeats.length >= numPeople) {
//                 return suitableSeats.slice(0, numPeople);
//               }
//             }
//           }
//         }
//       }
  
//       for (const entry of entries) {
//         const carriageName = entry.carriage;
//         const seatsInfo = entry.seats;

//         for(let i= 0; i< seatsInfo.length; i++){
//             let seat = seatsInfo[i].name
//             let numSeats = seat.split(' ')[1].split("-")
//             let lesserNum = parseInt(numSeats[0])
//             let greaterNum = parseInt(numSeats[1])
//             if((greaterNum - lesserNum) == numPeople && !seatsInfo[i].is_disabled){
//                 return {compartment:compartment,carriage:carriageName,seat:seatsInfo[i]}
//             }
                
//         }
//       }
        
//       for (const entry of entries) {
//         const carriageName = entry.carriage;
//         const seatsInfo = entry.seats;
  
//         for(let i= 0; i< seatsInfo.length; i++){
//             let seat = seatsInfo[i].name
                
//             let numSeats = seat.split(' ')[1].split("-")
//             let lesserNum = parseInt(numSeats[0])
//             let greaterNum = parseInt(numSeats[1])
//             if(!seatsInfo[i].is_disabled){
//                 let obj = {compartment:compartment,carriage:carriageName,seat:JSON.stringify(seatsInfo[i])}
//                 if(Object.keys(obj).length > 0){
//                     buffer.push({[greaterNum+1 - lesserNum]:obj})
//                 }
                
//             }
                
//         }
        
//       }
//     }
//     return findObjectsWithSumAndSameCompartment(buffer, numPeople)
//   }
