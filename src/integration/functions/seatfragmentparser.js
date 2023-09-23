export function groupByCompartment(data) {
  const groupedData = {}

  data.forEach((item) => {
    const key = Object.keys(item)[0]
    const compartment = item[key].compartment

    if (!groupedData[compartment]) {
      groupedData[compartment] = []
    }

    groupedData[compartment].push({
      key: key,
      ...item[key],
    })
  })

  return Object.values(groupedData).map((entry) => {
    return entry.length === 1 ? entry[0] : entry
  })
}

export function findFirstObjectsWithSum(groupedData, targetSum) {
  for (const group of groupedData) {
    for (let i = 0; i < group.length; i++) {
      let sum = parseInt(group[i].key, 10)
      const selectedObjects = [group[i]]

      for (let j = i + 1; j < group.length; j++) {
        sum += parseInt(group[j].key, 10)
        selectedObjects.push(group[j])

        if (sum === targetSum) {
          return selectedObjects
        }
      }
    }
  }

  return null
}
