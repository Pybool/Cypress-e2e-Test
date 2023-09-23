export const setBaseUrl = (name, BASE_URL) => {
  Cypress.config('baseUrl', BASE_URL[name])
}
