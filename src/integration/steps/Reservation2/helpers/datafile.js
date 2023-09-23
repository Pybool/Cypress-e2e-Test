export function getFutureDate(days) {
  const futureDate = new Date()
  futureDate.setDate(futureDate.getDate() + days)

  const options = {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour12: true,
  }

  const dateString = futureDate.toLocaleDateString('en-US', options)
  const date = new Date(dateString)

  return {
    month: new Intl.DateTimeFormat('en', { month: 'long' }).format(date),
    day: new Intl.DateTimeFormat('en', { day: 'numeric' }).format(date),
  }
}

export function getTomorrowDate() {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1) 
  const options = {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour12: true,
  }
  const dateString = tomorrow.toLocaleDateString('en-US', options)
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

export function getTodaysDate() {
  const currentDate = new Date()
  const options = {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour12: true,
  }
  const dateString = currentDate.toLocaleDateString('en-US', options)
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

export function getTodaysFullDate() {
  const currentDate = new Date()
  const options = {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }
  return currentDate.toLocaleDateString('en-US', options)
}

export const DATA_OBJECT = {
  market: 'Ravenglass',
  from: 'Dalegarth station',
  to: 'Ravenglass station',
  who: '2x Adult, 2x Child',
  when: getTomorrowDate(),
  options_available: '14:00 £28.00',
  firstname: 'Taye',
  lastname: 'Tester',
  email: 'taye.oyelekan@ticknovate.com',
  telephone: '01234567890',
  country: 'United Kingdom',
  line_1: '99 Tester Lane',
  town: 'Tester Town',
  post_code: 'EC1 4RW',
  'cardholder-name': 'Taye Tester',
  'card-number': '4929000000006',
  'expiry-date': '1230',
  'security-code': '123',
  market_when: ['From', 'To', 'Who', 'when'],
  Channel: 'Reservations',
  Status: window.localStorage.getItem('orderStatus'),
  Payment_Method: 'Card',
  Country_Code: 'GB',
  orderID: 'ULO7XVEGJ8GZM',
}

export const DATA_OBJECTII = {
  market: 'Ravenglass',
  from: 'Ravenglass station',
  to: 'Dalegarth station',
  who: '1x Adult',
  when: getTomorrowDate(),
  options_available: '14:00 £28.00',
  firstname: 'Taye',
  lastname: 'Tester',
  email: 'tay@out.com',
  telephone: '01234567890',
  country: 'United Kingdom',
  line_1: '99 Tester Lane',
  town: 'Tester Town',
  post_code: 'EC1 4RW',
  'cardholder-name': 'Taye Tester',
  'card-number': '4929000000006',
  'expiry-date': '1230',
  'security-code': '123',
  market_when: ['Market', 'From', 'To', 'Who', 'when'],
  market_what: ['Market', 'What', 'Who', 'when'],
  Channel: 'Reservations',
  Status: window.localStorage.getItem('orderStatus'),
  Payment_Method: 'Card',
  Country_Code: 'GB',
  orderID: 'ULO7XVEGJ8GZM',
  What: 'Goat yoga with Beer',
}

export const DATA_OBJECT_ULLSWATER = {
  market: "Ullswater 'Steamers'",
  from: 'Pooley Bridge pier',
  to: 'Howtown pier',
  who: '1x Adult',
  when: getTomorrowDate(),
  options_available: '14:00 £28.00',
  firstname: 'Taye',
  lastname: 'Tester',
  email: 'tay@out.com',
  telephone: '01234567890',
  country: 'United Kingdom',
  line_1: '99 Tester Lane',
  town: 'Tester Town',
  post_code: 'EC1 4RW',
  'cardholder-name': 'Taye Tester',
  'card-number': '4929000000006',
  'expiry-date': '1230',
  'security-code': '123',
  market_when: ['Market', 'From', 'To', 'Who', 'when'],
  market_what: ['Market', 'What', 'Who', 'when'],
  Channel: 'Reservations',
  Status: window.localStorage.getItem('orderStatus'),
  Payment_Method: 'Card',
  Country_Code: 'GB',
  orderID: 'ULO7XVEGJ8GZM',
  What: 'Goat yoga with Beer',
}

export function DYN_DATA_OBJECT_FN(key, value) {
  DATA_OBJECTII[key] = DATA_OBJECTII[key].replaceAll('1', value)
  return DATA_OBJECTII
}

export function ULLS_DYN_DATA_OBJECT_FN(key, value) {
  DATA_OBJECT_ULLSWATER[key] = DATA_OBJECT_ULLSWATER[key].replaceAll('1', value)
  return DATA_OBJECT_ULLSWATER
}



export const singleAdult = {
  adults: 2,
  children: 0,
  selections: [
    {
      compartment: 'Joan Pullman Observation',
      comps: 'Joan Comp. 3',
      seats: ['Seat 10'],
    },
  ],
}

export const twoChildrentwoAdults = {
  adults: 2,
  children: 2,
  selections: [
    {
      compartment: 'Joan Pullman Observation 4-seat compartment',
      comps: 'Joan Comp. 2',
      seats: ['Seats 5-8'],
    },
  ],
}

export const fourChildrenThreeAdults = {
  adults: 3,
  children: 4,
  selections: [
    {
      compartment: 'Joan Pullman Observation 4-seat compartment',
      comps: 'Joan Comp. 1',
      seats: ['Seats 1-4'],
    },
  ],
}

export const fourChildrenThreeAdultsClosedCarriage = {
  adults: 3,
  children: 4,
  selections: [
    {
      compartment: 'Closed carriage 6-seat compartment',
      comps: 'Carriage A',
      seats: ['Seats 1-6'],
    }
  ],
}

export const fourChildrenThreeAdultsSemiOpenCarriage = {
  adults: 3,
  children: 4,
  selections: [
    {
      compartment: 'Semi-open 4-seat compartment',
      comps: 'Carriage G',
      seats: ['Seats 11-14', 'Seats 7-10'],
    },
  ],
}

export const fourChildrenThreeAdultsOpenCarriage = {
  adults: 3,
  children: 4,
  selections: [
    {
      compartment: 'Open carriage 4-seat compartment',
      comps: 'Carriage C',
      seats: ['Seats 11-14', 'Seats 15-18'],
    },
  ],
}

export const fourChildrenThreeAdultsAccessibleCarriage = {
  adults: 3,
  children: 4,
  selections: [
    {
      compartment: 'Accessible carriage',
      comps: 'Carriage F',
      seats: ['Sit anywhere'],
    },
  ],
}
